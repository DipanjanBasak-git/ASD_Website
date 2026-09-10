/**
 * POST /api/screening/combined
 *
 * Accepts multipart/form-data with:
 *   - image: File (patient facial image)
 *   - questionnaire: JSON string of questionnaire answers
 *
 * Runs BOTH models independently:
 *   1. Facial model (TF.js singleton) -> Facial ASD Risk (Weight = 0.40)
 *   2. Questionnaire model (Python microservice) -> Questionnaire ASD Risk (Weight = 0.60)
 *
 * Persists:
 *   - Facial image stored securely outside /public
 *   - Full Screening record in DB linked to patient
 *   - Complete rawResponse containing answers, individual scores, contributions, and combined assessment
 *
 * SECURITY: PATIENT session required. Images served only via authenticated API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { getModel } from '@/lib/ml/asdModel';
import { preprocessImage } from '@/lib/ml/preprocess';
import { runQuestionnaireInference, type QuestionnaireFeatures } from '@/lib/ml/questionnaireInference';
import { saveScreeningImage } from '@/lib/screening/storage';
import * as tf from '@tensorflow/tfjs';

export const runtime = 'nodejs';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── Types ─────────────────────────────────────────────────────────────────────

type FacialResult = {
    prediction: 'ASD Positive' | 'ASD Negative';
    score: number;          // P(ASD) in [0,1]
    confidence: number;     // confidence of predicted class [0,1]
    risk: number;           // ASD risk [0,1]
};

type QuestionnaireResult = {
    prediction: string;     // 'Mild' | 'Moderate'
    confidence: number;     // model confidence [0, 1]
    probabilities: Record<string, number>;
    risk: number;           // calculated ASD risk [0, 1]
};

type CombinedResult = {
    score: number;          // [0, 1]
    scorePercentage: number;// [0, 100]
    facialWeight: number;   // 0.4
    questionnaireWeight: number; // 0.6
    facialContribution: number; // [0, 40]
    questionnaireContribution: number; // [0, 60]
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    assessment: string;
    summary: string;
};

// ── Questionnaire Risk Calculation ────────────────────────────────────────────
/**
 * The questionnaire Random Forest was trained on the NILD 2026 clinical cohort
 * (children with diagnosed ASD categorized into Mild vs Moderate by ISAA score).
 *
 * We do NOT treat the model's confidence percentage as ASD risk.
 * Instead, we map the model's class probabilities between ISAA severity anchor points:
 *   - Mild anchor: ~0.48 (48% clinical ASD severity index)
 *   - Moderate anchor: ~0.78 (78% clinical ASD severity index)
 *
 * Formula:
 *   Questionnaire ASD Risk = (P(Mild) * 0.48) + (P(Moderate) * 0.78)
 */
function calculateQuestionnaireRisk(
    prediction: string,
    probabilities: Record<string, number>,
    confidence: number
): number {
    const pModerate = probabilities['Moderate'] !== undefined
        ? probabilities['Moderate']
        : (prediction.toLowerCase() === 'moderate' ? confidence : 1 - confidence);
    const pMild = probabilities['Mild'] !== undefined
        ? probabilities['Mild']
        : (1 - pModerate);

    const risk = (pMild * 0.48) + (pModerate * 0.78);
    return Math.min(1.0, Math.max(0.0, Math.round(risk * 1000) / 1000));
}

// ── Combined Assessment Builder ───────────────────────────────────────────────
function buildCombinedAssessment(
    facialRisk: number,
    facialPrediction: string,
    questionnaireRisk: number,
    questionnairePrediction: string
): CombinedResult {
    const facialWeight = 0.4;
    const questionnaireWeight = 0.6;

    const facialContribution = Math.round((facialRisk * facialWeight * 100) * 10) / 10;
    const questionnaireContribution = Math.round((questionnaireRisk * questionnaireWeight * 100) * 10) / 10;

    const combinedScore = (facialRisk * facialWeight) + (questionnaireRisk * questionnaireWeight);
    const scorePercentage = Math.round(combinedScore * 100);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (combinedScore >= 0.65) riskLevel = 'HIGH';
    else if (combinedScore >= 0.40) riskLevel = 'MEDIUM';

    let assessment = '';
    let summary = '';

    if (facialPrediction === 'ASD Positive') {
        assessment = `ASD Indicators Present — ${questionnairePrediction} Clinical Profile (Risk: ${scorePercentage}%)`;
        summary =
            `Facial biomarker analysis identified ASD indicators (Risk: ${Math.round(facialRisk * 100)}%, contribution: ${facialContribution}%). ` +
            `ISAA questionnaire analysis classified a ${questionnairePrediction.toLowerCase()} clinical profile ` +
            `(Risk: ${Math.round(questionnaireRisk * 100)}%, contribution: ${questionnaireContribution}%). ` +
            `The 40/60 weighted combined score is ${scorePercentage}% (${riskLevel} risk level). ` +
            `Clinical review by a developmental specialist is recommended.`;
    } else {
        assessment = `Lower ASD Biomarker Profile — ${questionnairePrediction} Questionnaire Profile (Risk: ${scorePercentage}%)`;
        summary =
            `Facial biomarker analysis did not detect predominant ASD markers (Risk: ${Math.round(facialRisk * 100)}%, contribution: ${facialContribution}%). ` +
            `ISAA questionnaire assessment indicates a ${questionnairePrediction.toLowerCase()} behavioral profile ` +
            `(Risk: ${Math.round(questionnaireRisk * 100)}%, contribution: ${questionnaireContribution}%). ` +
            `The 40/60 weighted combined score is ${scorePercentage}% (${riskLevel} risk level).`;
    }

    return {
        score: Math.round(combinedScore * 1000) / 1000,
        scorePercentage,
        facialWeight,
        questionnaireWeight,
        facialContribution,
        questionnaireContribution,
        riskLevel,
        assessment,
        summary,
    };
}

export async function POST(req: NextRequest) {
    // ── 1. Auth ───────────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'PATIENT') {
        return NextResponse.json({ error: 'Forbidden: PATIENT role required' }, { status: 403 });
    }

    // Find the patient linked to this guardian user
    const patient = await prisma.patient.findFirst({
        where: { guardianId: session.userId },
        select: { id: true, patientUniqueId: true, firstName: true, lastName: true },
    });

    if (!patient) {
        return NextResponse.json(
            { error: 'No patient record linked to your guardian account.' },
            { status: 404 }
        );
    }

    // ── 2. Parse form data ────────────────────────────────────────────────────
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const imageFile = formData.get('image');
    const questionnaireRaw = formData.get('questionnaire');

    if (!imageFile || !(imageFile instanceof File)) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }
    if (!questionnaireRaw || typeof questionnaireRaw !== 'string') {
        return NextResponse.json({ error: 'No questionnaire data provided' }, { status: 400 });
    }

    // ── 3. Validate image ─────────────────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
        return NextResponse.json(
            { error: 'Invalid file type. Only JPG and PNG are accepted.' },
            { status: 400 }
        );
    }
    if (imageFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
            { error: 'Image too large. Maximum size is 5MB.' },
            { status: 400 }
        );
    }
    if (imageFile.size === 0) {
        return NextResponse.json({ error: 'Empty image file' }, { status: 400 });
    }

    // ── 4. Validate questionnaire JSON ────────────────────────────────────────
    let questionnaireFeatures: QuestionnaireFeatures;
    try {
        questionnaireFeatures = JSON.parse(questionnaireRaw);
    } catch {
        return NextResponse.json({ error: 'Invalid questionnaire data format' }, { status: 400 });
    }

    const requiredFields: (keyof QuestionnaireFeatures)[] = [
        'age', 'gender', 'hyperactive', 'responsive', 'epilepsy',
        'diagnosed', 'color_recognize', 'emotional_response',
        'head_injury', 'speech', 'eye_contact',
    ];
    const missing = requiredFields.filter(
        f => questionnaireFeatures[f] === undefined || questionnaireFeatures[f] === null || String(questionnaireFeatures[f]).trim() === ''
    );
    if (missing.length > 0) {
        return NextResponse.json(
            { error: `Missing required questionnaire fields: ${missing.join(', ')}` },
            { status: 400 }
        );
    }

    // ── 5. Run facial model ───────────────────────────────────────────────────
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    let facialResult: FacialResult;
    let inputTensor: tf.Tensor4D | null = null;

    try {
        const model = await getModel();
        inputTensor = await preprocessImage(imageBuffer);

        const predTensor = model.predict(inputTensor) as tf.Tensor;
        const scoreArr = await predTensor.data();
        predTensor.dispose();

        const rawScore = scoreArr[0];
        // class_indices: {'ASD': 0, 'Non-ASD': 1} — sigmoid output = P(Non-ASD)
        const probNonASD = rawScore;
        const probASD = 1.0 - rawScore;
        const isPositive = probASD >= 0.5;

        facialResult = {
            prediction: isPositive ? 'ASD Positive' : 'ASD Negative',
            score: Math.round(probASD * 1000) / 1000,
            confidence: Math.round((isPositive ? probASD : probNonASD) * 1000) / 1000,
            risk: Math.round(probASD * 1000) / 1000,
        };

        console.log(`[Combined API] Facial: ${facialResult.prediction} (Risk: ${(facialResult.risk * 100).toFixed(1)}%)`);
    } catch (err) {
        console.error('[Combined API] Facial model error:', err);
        return NextResponse.json(
            { error: 'Facial analysis failed. Please try again.' },
            { status: 500 }
        );
    } finally {
        if (inputTensor) inputTensor.dispose();
    }

    // ── 6. Run questionnaire model ────────────────────────────────────────────
    let questionnaireResult: QuestionnaireResult;
    try {
        const qResult = await runQuestionnaireInference(questionnaireFeatures);
        const qRisk = calculateQuestionnaireRisk(
            qResult.prediction,
            qResult.probabilities,
            qResult.confidence
        );

        questionnaireResult = {
            prediction: qResult.prediction,
            confidence: Math.round(qResult.confidence * 1000) / 1000,
            probabilities: qResult.probabilities,
            risk: qRisk,
        };
        console.log(`[Combined API] Questionnaire: ${questionnaireResult.prediction} (Confidence: ${(questionnaireResult.confidence * 100).toFixed(1)}%, Risk: ${(questionnaireResult.risk * 100).toFixed(1)}%)`);
    } catch (err) {
        console.error('[Combined API] Questionnaire model error:', err);
        return NextResponse.json(
            {
                error: 'Questionnaire analysis failed. Please ensure the analysis service is running.',
            },
            { status: 500 }
        );
    }

    // ── 7. Calculate 40/60 weighted combined assessment ───────────────────────
    const combined = buildCombinedAssessment(
        facialResult.risk,
        facialResult.prediction,
        questionnaireResult.risk,
        questionnaireResult.prediction
    );

    console.log(`[Combined API] Weighted Combined Score: ${combined.scorePercentage}% (${combined.riskLevel})`);

    // ── 8. Persist image securely to disk ─────────────────────────────────────
    let facialImagePath: string | null = null;
    try {
        const saved = await saveScreeningImage(imageBuffer, imageFile.type);
        facialImagePath = saved.relativePath;
    } catch (saveErr) {
        console.error('[Combined API] Failed to save screening image to disk:', saveErr);
        // Continue even if disk save fails, but log error
    }

    // ── 9. Persist complete screening record to DB ────────────────────────────
    let savedScreening;
    try {
        const rawPayload = {
            answers: questionnaireFeatures,
            facial: {
                prediction: facialResult.prediction,
                score: facialResult.score,
                confidence: Math.round(facialResult.confidence * 100),
                riskPercentage: Math.round(facialResult.risk * 100),
                weight: combined.facialWeight,
                contribution: combined.facialContribution,
            },
            questionnaire: {
                prediction: questionnaireResult.prediction,
                confidence: Math.round(questionnaireResult.confidence * 100),
                probabilities: questionnaireResult.probabilities,
                riskPercentage: Math.round(questionnaireResult.risk * 100),
                weight: combined.questionnaireWeight,
                contribution: combined.questionnaireContribution,
            },
            combined: {
                score: combined.score,
                scorePercentage: combined.scorePercentage,
                riskLevel: combined.riskLevel,
                facialWeight: combined.facialWeight,
                questionnaireWeight: combined.questionnaireWeight,
                facialContribution: combined.facialContribution,
                questionnaireContribution: combined.questionnaireContribution,
                assessment: combined.assessment,
                summary: combined.summary,
            },
            timestamp: new Date().toISOString(),
        };

        savedScreening = await prisma.screening.create({
            data: {
                patientId: patient.id,
                evaluatorId: session.userId,
                toolName: 'COMBINED_ASD',
                toolVersion: '2.0',
                scoringVersion: 'WEIGHTED_40_60',
                calculatedScore: combined.scorePercentage,
                riskLevel: combined.riskLevel,
                facialImagePath,
                rawResponse: rawPayload,
            },
        });

        // Pipeline escalation if High Risk
        if (combined.riskLevel === 'HIGH') {
            await prisma.riskFlag.create({
                data: {
                    patientId: patient.id,
                    riskLevel: 'HIGH',
                    reason: `Auto-flagged by Combined ASD Screening score: ${combined.scorePercentage}%`,
                },
            });

            await prisma.patient.update({
                where: { id: patient.id },
                data: { pipelineStage: 'DIAGNOSIS' },
            });
        }

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'SCREENING_SUBMITTED',
                resource: 'Screening',
                resourceId: savedScreening.id,
                userId: session.userId,
                severity: combined.riskLevel === 'HIGH' ? 'WARN' : 'INFO',
                newValues: {
                    patientId: patient.id,
                    score: combined.scorePercentage,
                    riskLevel: combined.riskLevel,
                },
            },
        });

    } catch (dbErr) {
        console.error('[Combined API] DB persistence error:', dbErr);
        // Do not fail the user's screening view if DB write fails, but report error in log
    }

    // ── 10. Return response with separate & combined results ──────────────────
    return NextResponse.json({
        screeningId: savedScreening?.id || null,
        imageUrl: savedScreening?.id ? `/api/screening/${savedScreening.id}/image` : null,
        patient: {
            name: `${patient.firstName} ${patient.lastName}`,
            patientUniqueId: patient.patientUniqueId,
        },
        facial: {
            prediction: facialResult.prediction,
            score: facialResult.score,
            riskPercentage: Math.round(facialResult.risk * 100),
            confidence: Math.round(facialResult.confidence * 100),
            weight: combined.facialWeight,
            contribution: combined.facialContribution,
        },
        questionnaire: {
            prediction: questionnaireResult.prediction,
            riskPercentage: Math.round(questionnaireResult.risk * 100),
            confidence: Math.round(questionnaireResult.confidence * 100),
            probabilities: questionnaireResult.probabilities,
            weight: combined.questionnaireWeight,
            contribution: combined.questionnaireContribution,
        },
        combined: {
            score: combined.score,
            scorePercentage: combined.scorePercentage,
            riskLevel: combined.riskLevel,
            facialWeight: combined.facialWeight,
            questionnaireWeight: combined.questionnaireWeight,
            facialContribution: combined.facialContribution,
            questionnaireContribution: combined.questionnaireContribution,
            assessment: combined.assessment,
            summary: combined.summary,
        },
        disclaimer:
            'This AI-assisted screening provides predictive observational insights and is NOT a clinical diagnosis. ' +
            'Results must be reviewed by a qualified healthcare professional and should not be used ' +
            'as the sole basis for medical decisions.',
    });
}

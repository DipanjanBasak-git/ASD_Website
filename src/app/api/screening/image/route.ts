/**
 * POST /api/screening/image
 *
 * Accepts a multipart/form-data upload with a single image field.
 * Validates session (PATIENT role only), file type, and file size.
 * Runs inference via the singleton ASD model and returns score + prediction.
 *
 * Uses pure @tensorflow/tfjs — no native bindings required.
 * STRICTLY ISOLATED — no Prisma writes, no schema changes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptSession } from '@/lib/auth/session';
import { getModel } from '@/lib/ml/asdModel';
import { preprocessImage } from '@/lib/ml/preprocess';
import * as tf from '@tensorflow/tfjs';

export const runtime = 'nodejs';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
    // ── 1. Auth: validate session & role ─────────────────────────────────────
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'PATIENT') {
        return NextResponse.json({ error: 'Forbidden: PATIENT role required' }, { status: 403 });
    }

    // ── 2. Parse multipart form data ──────────────────────────────────────────
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // ── 3. Validate file type ─────────────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
            { error: 'Invalid file type. Only JPG and PNG images are accepted.' },
            { status: 400 }
        );
    }

    // ── 4. Validate file size ─────────────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
            { error: 'File too large. Maximum allowed size is 5MB.' },
            { status: 400 }
        );
    }

    if (file.size === 0) {
        return NextResponse.json({ error: 'Empty file provided' }, { status: 400 });
    }

    // ── 5. Convert to Buffer ──────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── 6. Preprocess & Inference ─────────────────────────────────────────────
    let score: number;
    let inputTensor: tf.Tensor4D | null = null;

    try {
        const model = await getModel();

        // Preprocess image to [1, 224, 224, 3] float32 tensor
        // NOTE: pixels are raw [0-255] — the model's internal rescaling_1 layer
        // handles the /255 normalization (scale=0.003921568 confirmed in model.json).
        inputTensor = await preprocessImage(buffer);

        // ── Debug: verify input tensor range ──────────────────────────────────
        const inputMin = inputTensor.min().dataSync()[0];
        const inputMax = inputTensor.max().dataSync()[0];
        console.log(`[Screening API] Input tensor range: min=${inputMin.toFixed(2)}, max=${inputMax.toFixed(2)}`);
        // Expected: min~0, max~255 (raw pixel values)

        // Run inference; output shape is [1,1] with sigmoid activation
        const predTensor = model.predict(inputTensor) as tf.Tensor;
        const scoreArr = await predTensor.data();
        score = scoreArr[0];
        predTensor.dispose();
    } catch (err) {
        console.error('[Screening API] Inference error:', err);
        return NextResponse.json({ error: 'Model inference failed. Please try again.' }, { status: 500 });
    } finally {
        // Dispose input tensor to prevent memory leaks
        if (inputTensor) {
            inputTensor.dispose();
        }
    }

    // ── 7. Classify and respond ───────────────────────────────────────────────
    // Training class mapping (flow_from_directory alphabetical order):
    //   {'ASD': 0, 'Non-ASD': 1}
    // Model has sigmoid output (binary_crossentropy loss):
    //   raw score → 0 means ASD (class 0)
    //   raw score → 1 means Non-ASD (class 1)
    const probNonASD = score;         // raw sigmoid output = P(Non-ASD)
    const probASD = 1.0 - score;   // P(ASD) = 1 - P(Non-ASD)
    const predictedClassIndex = score >= 0.5 ? 1 : 0; // 1=Non-ASD, 0=ASD

    // ── Debug: log both class probabilities ───────────────────────────────────
    console.log(`[Screening API] Raw sigmoid score (P(Non-ASD)): ${probNonASD.toFixed(4)}`);
    console.log(`[Screening API] P(ASD):    ${(probASD * 100).toFixed(1)}%`);
    console.log(`[Screening API] P(Non-ASD): ${(probNonASD * 100).toFixed(1)}%`);
    console.log(`[Screening API] Predicted class index: ${predictedClassIndex} (0=ASD, 1=Non-ASD)`);

    const isPositive = probASD >= 0.50;
    const prediction = isPositive ? 'ASD Positive' : 'ASD Negative';
    const displayConfidence = isPositive ? probASD * 100 : probNonASD * 100;
    console.log(`[Screening API] Final prediction: ${prediction} (confidence: ${displayConfidence.toFixed(1)}%)`);

    return NextResponse.json({
        score: Math.round(probASD * 1000) / 1000,
        prediction,
    });
}

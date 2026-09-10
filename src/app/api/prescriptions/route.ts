/**
 * POST /api/prescriptions  — Upload a new prescription
 * GET  /api/prescriptions  — List all prescriptions for the authenticated patient
 *
 * Security: PATIENT role only. Prescriptions are tied to the authenticated
 * patient's DB record via session.userId → Patient.guardianId.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import {
    savePrescriptionFile,
    validatePrescriptionFile,
    ALLOWED_MIME_TYPES,
} from '@/lib/prescriptions/storage';
import { parsePrescriptionImage } from '@/lib/prescriptions/aiParser';

// ─── POST: Upload Prescription ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate — PATIENT only
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Access denied — patients only' }, { status: 403 });
        }

        // 2. Get patient record from DB
        const patient = await prisma.patient.findFirst({
            where: { guardianId: session.userId as string },
            select: { id: true, patientUniqueId: true },
        });
        if (!patient) {
            return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
        }

        // 3. Parse multipart form data
        const formData = await req.formData();
        const file = formData.get('prescription') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 4. Read file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;
        const originalName = file.name;

        // 5. Validate file
        const validationError = validatePrescriptionFile(buffer, mimeType, originalName);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // 6. Save file securely (outside /public)
        const { relativePath, savedFileName } = await savePrescriptionFile(
            buffer,
            mimeType,
            originalName
        );

        // 7. Create DB record in PROCESSING state
        const prescription = await prisma.prescription.create({
            data: {
                patientId: patient.id,
                originalFilePath: relativePath,
                originalFileName: savedFileName,
                fileMimeType: mimeType,
                processingStatus: 'PROCESSING',
            },
        });

        // 8. Audit log: upload
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_UPLOADED',
                resource: 'Prescription',
                resourceId: prescription.id,
                userId: session.userId as string,
                severity: 'INFO',
            },
        });

        // 9. Trigger AI parsing (async — don't block the response)
        // We return immediately with PROCESSING status, and the AI runs in the background.
        triggerAiParsing(prescription.id, buffer, mimeType, session.userId as string).catch(
            err => console.error('[Prescription] Background AI parsing failed:', err)
        );

        return NextResponse.json({
            success: true,
            prescription: {
                id: prescription.id,
                processingStatus: 'PROCESSING',
                originalFileName: savedFileName,
                createdAt: prescription.createdAt,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('[POST /api/prescriptions]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── GET: List Prescriptions ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        // 1. Authenticate — PATIENT only
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // 2. Get patient record
        const patient = await prisma.patient.findFirst({
            where: { guardianId: session.userId as string },
            select: { id: true },
        });
        if (!patient) {
            return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
        }

        // 3. Fetch prescriptions (NEVER cross-patient — always filtered by patientId)
        const prescriptions = await prisma.prescription.findMany({
            where: { patientId: patient.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                originalFileName: true,
                fileMimeType: true,
                processingStatus: true,
                aiExtractedData: true,
                aiProcessedAt: true,
                aiFailureReason: true,
                details: true,
                prescribedBy: true,
                createdAt: true,
                updatedAt: true,
                accessGrants: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        professionalId: true,
                        grantedAt: true,
                        professional: {
                            select: { fullName: true, id: true },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ success: true, prescriptions });

    } catch (error) {
        console.error('[GET /api/prescriptions]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── Background AI Parsing ────────────────────────────────────────────────────

async function triggerAiParsing(
    prescriptionId: string,
    imageBuffer: Buffer,
    mimeType: string,
    userId: string
): Promise<void> {
    try {
        const parsed = await parsePrescriptionImage(imageBuffer, mimeType);

        const finalStatus = parsed.status === 'FAILED' ? 'FAILED' : 'PROCESSED';

        await prisma.prescription.update({
            where: { id: prescriptionId },
            data: {
                processingStatus: finalStatus,
                aiExtractedData: parsed as any,
                aiProcessedAt: new Date(),
                aiFailureReason: parsed.failureReason ?? null,
            },
        });

        // Audit log: AI processing complete
        await prisma.auditLog.create({
            data: {
                action: finalStatus === 'PROCESSED' ? 'PRESCRIPTION_AI_PROCESSED' : 'PRESCRIPTION_AI_FAILED',
                resource: 'Prescription',
                resourceId: prescriptionId,
                userId,
                severity: finalStatus === 'FAILED' ? 'WARN' : 'INFO',
                newValues: { status: finalStatus, confidence: (parsed as any).extractionConfidence },
            },
        });
    } catch (error) {
        console.error('[triggerAiParsing] Unexpected error:', error);
        // Mark as FAILED in DB so the patient sees a clear state
        await prisma.prescription.update({
            where: { id: prescriptionId },
            data: {
                processingStatus: 'FAILED',
                aiFailureReason: 'An unexpected error occurred during processing.',
                aiProcessedAt: new Date(),
            },
        }).catch(() => {}); // Swallow secondary errors
    }
}

/**
 * POST /api/prescriptions/[id]/retry  — Re-trigger AI parsing for a failed prescription
 *
 * Only PATIENT role (owner) can retry. Re-reads the file from disk and re-runs AI parsing.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { readPrescriptionFile } from '@/lib/prescriptions/storage';
import { parsePrescriptionImage } from '@/lib/prescriptions/aiParser';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const { id } = await params;

        // 1. Find the prescription and verify ownership
        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: { patient: { select: { guardianId: true } } },
        });

        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        if (prescription.patient.guardianId !== session.userId) {
            return NextResponse.json({ error: 'Not your prescription' }, { status: 403 });
        }

        if (prescription.processingStatus === 'PROCESSING') {
            return NextResponse.json({ error: 'Already processing' }, { status: 409 });
        }

        if (!prescription.originalFilePath) {
            return NextResponse.json({ error: 'Original file not found' }, { status: 404 });
        }

        // 2. Mark as PROCESSING immediately
        await prisma.prescription.update({
            where: { id },
            data: {
                processingStatus: 'PROCESSING',
                aiFailureReason: null,
            },
        });

        // 3. Read the original file from disk
        const { buffer } = readPrescriptionFile(prescription.originalFilePath);
        const mimeType = prescription.fileMimeType || 'image/jpeg';

        // 4. Trigger AI parsing in background (don't block response)
        (async () => {
            try {
                const parsed = await parsePrescriptionImage(buffer, mimeType);
                const finalStatus = parsed.status === 'FAILED' ? 'FAILED' : 'PROCESSED';

                await prisma.prescription.update({
                    where: { id },
                    data: {
                        processingStatus: finalStatus,
                        aiExtractedData: parsed as any,
                        aiProcessedAt: new Date(),
                        aiFailureReason: parsed.failureReason ?? null,
                    },
                });

                await prisma.auditLog.create({
                    data: {
                        action: finalStatus === 'PROCESSED' ? 'PRESCRIPTION_AI_PROCESSED' : 'PRESCRIPTION_AI_FAILED',
                        resource: 'Prescription',
                        resourceId: id,
                        userId: session.userId as string,
                        severity: finalStatus === 'FAILED' ? 'WARN' : 'INFO',
                        newValues: { status: finalStatus, confidence: (parsed as any).extractionConfidence, retried: true },
                    },
                });
            } catch (error) {
                console.error('[retry] AI re-parsing failed:', error);
                await prisma.prescription.update({
                    where: { id },
                    data: {
                        processingStatus: 'FAILED',
                        aiFailureReason: 'Retry failed — an unexpected error occurred.',
                        aiProcessedAt: new Date(),
                    },
                }).catch(() => {});
            }
        })();

        return NextResponse.json({ success: true, message: 'Re-processing started' });

    } catch (error) {
        console.error('[POST /api/prescriptions/[id]/retry]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

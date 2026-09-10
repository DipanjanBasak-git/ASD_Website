/**
 * GET /api/screening/[id]/image
 *
 * Streams the patient's facial screening photograph to authorized users.
 * Files are stored OUTSIDE /public — this is the ONLY access point.
 *
 * Authorization:
 * - PATIENT: must own the screening record (linked via guardianId / evaluatorId)
 * - DOCTOR / THERAPIST / COUNSELLOR: must have an active PatientAccessGrant
 *   OR an active PrescriptionAccessGrant for this patient
 * - Unauthenticated or unauthorized users are strictly denied (401/403)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { readScreeningImage } from '@/lib/screening/storage';

const CLINICAL_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Auth check
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await decryptSession(sessionCookie);
        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const { id } = await params;

        // 2. Fetch screening record
        const screening = await prisma.screening.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        id: true,
                        guardianId: true,
                        patientAccessGrants: {
                            where: {
                                professionalId: session.userId as string,
                                isActive: true,
                            },
                        },
                        prescriptions: {
                            select: {
                                accessGrants: {
                                    where: {
                                        professionalId: session.userId as string,
                                        isActive: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!screening || !screening.facialImagePath) {
            return NextResponse.json({ error: 'Screening image not found' }, { status: 404 });
        }

        // 3. Authorization check
        let authorized = false;

        if (session.role === 'PATIENT') {
            // Patient owns the record
            if (
                screening.patient.guardianId === session.userId ||
                screening.evaluatorId === session.userId
            ) {
                authorized = true;
            }
        } else if (CLINICAL_ROLES.includes(session.role as string)) {
            // Professional has active patient access grant OR prescription access grant
            const hasPatientGrant = screening.patient.patientAccessGrants.length > 0;
            const hasPrescriptionGrant = screening.patient.prescriptions.some(
                p => p.accessGrants.length > 0
            );

            if (hasPatientGrant || hasPrescriptionGrant) {
                authorized = true;
            }
        }

        if (!authorized) {
            // Audit unauthorized access attempt
            await prisma.auditLog.create({
                data: {
                    action: 'SCREENING_IMAGE_ACCESS_DENIED',
                    resource: 'Screening',
                    resourceId: screening.id,
                    userId: session.userId as string,
                    severity: 'WARN',
                    newValues: { reason: 'No active access grant found for professional' },
                },
            });

            return NextResponse.json({ error: 'Access denied: Permission required' }, { status: 403 });
        }

        // 4. Read file from disk
        const { buffer, mimeType } = await readScreeningImage(screening.facialImagePath);

        // 5. Audit view
        await prisma.auditLog.create({
            data: {
                action: 'SCREENING_IMAGE_VIEW',
                resource: 'Screening',
                resourceId: screening.id,
                userId: session.userId as string,
                severity: 'INFO',
                newValues: { role: session.role },
            },
        });

        // 6. Return image stream
        const responseBytes = new Uint8Array(buffer);
        return new NextResponse(responseBytes, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'private, no-store, max-age=0',
                'X-Content-Type-Options': 'nosniff',
            },
        });

    } catch (error) {
        console.error('[GET /api/screening/[id]/image]', error);
        return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
    }
}

/**
 * GET /api/prescriptions/professional/lookup
 *
 * Allows authenticated Doctors, Therapists, and Counsellors to look up
 * an authorized patient's clinical profile (screenings, questionnaires, facial analysis,
 * and digitized prescriptions) by Patient Unique ID (SMART-YYYY-XXXXXX).
 *
 * CRITICAL SECURITY & ACCESS CONTROL:
 * - Professional must be authenticated
 * - Professional must have one of the allowed clinical roles (DOCTOR, THERAPIST, COUNSELLOR)
 * - Professional must have an ACTIVE PatientAccessGrant OR PrescriptionAccessGrant for the patient
 * - If no active grants exist, no clinical or prescription data is returned (only denial message)
 * - The patient's guardianId and internal DB UUID are never exposed
 *
 * Query params: ?patientUniqueId=SMART-2026-XXXXXX
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';

const ALLOWED_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];

export async function GET(req: NextRequest) {
    try {
        // 1. Auth — clinical professionals only
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session || !ALLOWED_ROLES.includes(session.role as string)) {
            return NextResponse.json(
                { error: 'Access denied. Only Doctors, Therapists, and Counsellors can use this endpoint.' },
                { status: 403 }
            );
        }

        // 2. Get patient unique ID from query string
        const { searchParams } = new URL(req.url);
        const patientUniqueId = searchParams.get('patientUniqueId')?.trim();

        if (!patientUniqueId) {
            return NextResponse.json({ error: 'patientUniqueId query parameter is required' }, { status: 400 });
        }

        // 3. Find the patient (by public SMART ID only — never by internal UUID)
        const patient = await prisma.patient.findUnique({
            where: { patientUniqueId },
            select: {
                id: true,
                patientUniqueId: true,
                firstName: true,
                lastName: true,
                gender: true,
                dob: true,
                pipelineStage: true,
                patientAccessGrants: {
                    where: {
                        professionalId: session.userId as string,
                        isActive: true,
                    },
                },
                prescriptions: {
                    where: {
                        accessGrants: {
                            some: {
                                professionalId: session.userId as string,
                                isActive: true,
                            },
                        },
                    },
                    select: {
                        id: true,
                        originalFileName: true,
                        processingStatus: true,
                        aiExtractedData: true,
                        aiProcessedAt: true,
                        aiFailureReason: true,
                        details: true,
                        prescribedBy: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!patient) {
            // Do NOT reveal whether patient exists or not — same response either way
            return NextResponse.json({
                granted: false,
                message: 'No patient access has been granted for this Patient ID.',
            });
        }

        // 4. Verify Authorization
        const hasPatientGrant = patient.patientAccessGrants.length > 0;
        const hasPrescriptionGrant = patient.prescriptions.length > 0;

        if (!hasPatientGrant && !hasPrescriptionGrant) {
            // Audit: denied access attempt
            await prisma.auditLog.create({
                data: {
                    action: 'PATIENT_PROFILE_ACCESS_DENIED',
                    resource: 'Patient',
                    resourceId: patient.id,
                    userId: session.userId as string,
                    severity: 'WARN',
                    newValues: { reason: 'No active patient or prescription grants found', patientUniqueId },
                },
            });

            return NextResponse.json({
                granted: false,
                message: 'Access has not been granted by this patient.',
            });
        }

        // 5. If authorized, fetch historical screenings for this patient
        const screenings = await prisma.screening.findMany({
            where: {
                patientId: patient.id,
            },
            select: {
                id: true,
                toolName: true,
                toolVersion: true,
                scoringVersion: true,
                calculatedScore: true,
                riskLevel: true,
                reviewStatus: true,
                facialImagePath: true,
                rawResponse: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Format screenings with safe URLs for facial image
        const formattedScreenings = screenings.map(s => ({
            id: s.id,
            toolName: s.toolName,
            toolVersion: s.toolVersion,
            scoringVersion: s.scoringVersion,
            calculatedScore: s.calculatedScore,
            riskLevel: s.riskLevel,
            reviewStatus: s.reviewStatus,
            hasFacialImage: !!s.facialImagePath,
            imageUrl: s.facialImagePath ? `/api/screening/${s.id}/image` : null,
            rawResponse: s.rawResponse,
            createdAt: s.createdAt,
        }));

        // 6. Audit: professional viewed patient profile
        await prisma.auditLog.create({
            data: {
                action: 'PATIENT_PROFILE_PROFESSIONAL_VIEW',
                resource: 'Patient',
                resourceId: patient.id,
                userId: session.userId as string,
                severity: 'INFO',
                newValues: {
                    patientUniqueId,
                    screeningCount: formattedScreenings.length,
                    prescriptionCount: patient.prescriptions.length,
                    role: session.role,
                },
            },
        });

        // 7. Return complete authorized profile
        return NextResponse.json({
            granted: true,
            patient: {
                patientUniqueId: patient.patientUniqueId,
                name: `${patient.firstName} ${patient.lastName}`,
                gender: patient.gender,
                dob: patient.dob,
                pipelineStage: patient.pipelineStage,
            },
            screenings: formattedScreenings,
            prescriptions: patient.prescriptions,
        });

    } catch (error) {
        console.error('[GET /api/prescriptions/professional/lookup]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

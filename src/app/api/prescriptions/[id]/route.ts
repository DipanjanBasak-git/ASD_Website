/**
 * GET    /api/prescriptions/[id]  — Get a single prescription
 * DELETE /api/prescriptions/[id]  — Delete a prescription
 *
 * Access control:
 * - PATIENT: can access own prescriptions only
 * - DOCTOR/THERAPIST/COUNSELLOR: can access if they have an active PrescriptionAccessGrant
 * - IDOR prevention: ownership/grant verified server-side on every request
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { deletePrescriptionFile } from '@/lib/prescriptions/storage';

// ─── Helper: Authorize access to a prescription ───────────────────────────────

async function authorizeAccess(
    prescriptionId: string,
    session: any
): Promise<{
    allowed: boolean;
    prescription?: any;
    reason?: string;
}> {
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
            patient: { select: { id: true, patientUniqueId: true, guardianId: true } },
            accessGrants: {
                where: { isActive: true, professionalId: session.userId },
            },
        },
    });

    if (!prescription) {
        return { allowed: false, reason: 'Prescription not found' };
    }

    const PATIENT_ROLES = ['PATIENT'];
    const PROFESSIONAL_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];

    if (PATIENT_ROLES.includes(session.role)) {
        // Patient must own this prescription (guardianId matches)
        if (prescription.patient.guardianId !== session.userId) {
            return { allowed: false, reason: 'This prescription does not belong to you' };
        }
        return { allowed: true, prescription };
    }

    if (PROFESSIONAL_ROLES.includes(session.role)) {
        // Professional must have an active access grant
        if (!prescription.accessGrants || prescription.accessGrants.length === 0) {
            return { allowed: false, reason: 'Prescription access has not been granted by this patient' };
        }
        return { allowed: true, prescription };
    }

    return { allowed: false, reason: 'Insufficient permissions' };
}

// ─── GET: Fetch a single prescription ────────────────────────────────────────

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const { id } = await params;
        const { allowed, prescription, reason } = await authorizeAccess(id, session);

        if (!allowed) {
            return NextResponse.json({ error: reason }, { status: 403 });
        }

        // Audit log: view
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_VIEWED',
                resource: 'Prescription',
                resourceId: id,
                userId: session.userId as string,
                severity: 'INFO',
            },
        });

        // Return safe subset — never include raw file paths
        return NextResponse.json({
            success: true,
            prescription: {
                id: prescription.id,
                originalFileName: prescription.originalFileName,
                fileMimeType: prescription.fileMimeType,
                processingStatus: prescription.processingStatus,
                aiExtractedData: prescription.aiExtractedData,
                aiProcessedAt: prescription.aiProcessedAt,
                aiFailureReason: prescription.aiFailureReason,
                details: prescription.details,
                prescribedBy: prescription.prescribedBy,
                createdAt: prescription.createdAt,
                patientId: prescription.patient.patientUniqueId,
            },
        });

    } catch (error) {
        console.error('[GET /api/prescriptions/[id]]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── DELETE: Remove a prescription ───────────────────────────────────────────

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        // Only patients can delete their own prescriptions
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const { id } = await params;

        // Find and verify ownership
        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: { patient: { select: { guardianId: true } } },
        });

        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        if (prescription.patient.guardianId !== session.userId) {
            return NextResponse.json(
                { error: 'You do not have permission to delete this prescription' },
                { status: 403 }
            );
        }

        // Delete file from disk
        if (prescription.originalFilePath) {
            deletePrescriptionFile(prescription.originalFilePath);
        }

        // Delete DB record (cascades to accessGrants via Prisma schema)
        await prisma.prescription.delete({ where: { id } });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_DELETED',
                resource: 'Prescription',
                resourceId: id,
                userId: session.userId as string,
                severity: 'WARN',
            },
        });

        return NextResponse.json({ success: true, message: 'Prescription deleted' });

    } catch (error) {
        console.error('[DELETE /api/prescriptions/[id]]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * DELETE /api/prescriptions/[id]/grants/[professionalId]
 *
 * Revokes a specific professional's access to this prescription.
 * Only the patient who owns the prescription can revoke access.
 * Revocation is immediate and permanent for this grant record.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; professionalId: string }> }
) {
    try {
        // 1. Auth — PATIENT only
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Only patients can revoke prescription access' }, { status: 403 });
        }

        const { id: prescriptionId, professionalId } = await params;

        // 2. Verify patient owns this prescription
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { patient: { select: { guardianId: true } } },
        });

        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        if (prescription.patient.guardianId !== session.userId) {
            return NextResponse.json(
                { error: 'You can only manage access to your own prescriptions' },
                { status: 403 }
            );
        }

        // 3. Find the active grant
        const grant = await prisma.prescriptionAccessGrant.findUnique({
            where: {
                prescriptionId_professionalId: { prescriptionId, professionalId },
            },
        });

        if (!grant) {
            return NextResponse.json({ error: 'Access grant not found' }, { status: 404 });
        }

        if (!grant.isActive) {
            return NextResponse.json({ error: 'This access grant is already revoked' }, { status: 400 });
        }

        // 4. Revoke — set isActive to false (preserves audit trail)
        await prisma.prescriptionAccessGrant.update({
            where: { id: grant.id },
            data: {
                isActive: false,
                revokedAt: new Date(),
            },
        });

        // 5. Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_ACCESS_REVOKED',
                resource: 'PrescriptionAccessGrant',
                resourceId: grant.id,
                userId: session.userId as string,
                severity: 'WARN',
                newValues: { prescriptionId, professionalId, revokedAt: new Date().toISOString() },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Access has been revoked. The professional can no longer view this prescription.',
        });

    } catch (error) {
        console.error('[DELETE /api/prescriptions/[id]/grants/[professionalId]]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

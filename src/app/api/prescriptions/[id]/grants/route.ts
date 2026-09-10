/**
 * POST /api/prescriptions/[id]/grants
 *
 * Grants a specific professional access to this prescription.
 * Only the patient who owns the prescription can grant access.
 *
 * Body: { professionalId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { z } from 'zod';

const grantSchema = z.object({
    professionalId: z.string().min(1, 'Professional ID is required'),
});

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Auth — PATIENT only
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Only patients can manage prescription access' }, { status: 403 });
        }

        const { id: prescriptionId } = await params;

        // 2. Verify patient owns this prescription
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { patient: { select: { guardianId: true } } },
        });

        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        if (prescription.patient.guardianId !== session.userId) {
            return NextResponse.json({ error: 'You can only manage access to your own prescriptions' }, { status: 403 });
        }

        // 3. Validate body
        const body = await req.json();
        const { professionalId } = grantSchema.parse(body);

        // 4. Verify the professional exists and has a clinical role
        const professional = await prisma.user.findUnique({
            where: { id: professionalId },
            include: { role: true },
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
        }

        const ALLOWED_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];
        if (!ALLOWED_ROLES.includes(professional.role.name)) {
            return NextResponse.json(
                { error: 'Access can only be granted to Doctors, Therapists, or Counsellors' },
                { status: 400 }
            );
        }

        // 5. Create or reactivate grant (upsert)
        const grant = await prisma.prescriptionAccessGrant.upsert({
            where: {
                prescriptionId_professionalId: {
                    prescriptionId,
                    professionalId,
                },
            },
            update: {
                isActive: true,
                revokedAt: null,
                grantedAt: new Date(),
            },
            create: {
                prescriptionId,
                professionalId,
                isActive: true,
            },
        });

        // 6. Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_ACCESS_GRANTED',
                resource: 'PrescriptionAccessGrant',
                resourceId: grant.id,
                userId: session.userId as string,
                severity: 'INFO',
                newValues: { prescriptionId, professionalId, professionalName: professional.fullName },
            },
        });

        return NextResponse.json({
            success: true,
            grant: {
                id: grant.id,
                professionalId,
                professionalName: professional.fullName,
                professionalRole: professional.role.name,
                grantedAt: grant.grantedAt,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('[POST /api/prescriptions/[id]/grants]', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── GET: List active grants for a prescription ───────────────────────────────

export async function GET(
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

        const { id: prescriptionId } = await params;

        // Verify ownership
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { patient: { select: { guardianId: true } } },
        });

        if (!prescription || prescription.patient.guardianId !== session.userId) {
            return NextResponse.json({ error: 'Prescription not found or access denied' }, { status: 403 });
        }

        const grants = await prisma.prescriptionAccessGrant.findMany({
            where: { prescriptionId, isActive: true },
            include: {
                professional: {
                    select: { id: true, fullName: true, role: { select: { name: true } } },
                },
            },
            orderBy: { grantedAt: 'desc' },
        });

        return NextResponse.json({ success: true, grants });

    } catch (error) {
        console.error('[GET /api/prescriptions/[id]/grants]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

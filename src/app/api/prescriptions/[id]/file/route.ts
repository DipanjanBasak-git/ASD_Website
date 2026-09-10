/**
 * GET /api/prescriptions/[id]/file
 *
 * Streams the original prescription file to authorized users.
 * Files are stored OUTSIDE /public — this is the ONLY access point.
 *
 * Authorization:
 * - PATIENT: must own the prescription
 * - DOCTOR/THERAPIST/COUNSELLOR: must have an active PrescriptionAccessGrant
 * - No unauthenticated access ever
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';
import { readPrescriptionFile } from '@/lib/prescriptions/storage';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Auth check
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const { id } = await params;

        // 2. Fetch prescription
        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: {
                patient: { select: { guardianId: true } },
                accessGrants: {
                    where: { isActive: true, professionalId: session.userId },
                },
            },
        });

        if (!prescription || !prescription.originalFilePath) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // 3. Authorization: owner or granted professional
        const PROFESSIONAL_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];
        let authorized = false;

        if (session.role === 'PATIENT' && prescription.patient.guardianId === session.userId) {
            authorized = true;
        } else if (
            PROFESSIONAL_ROLES.includes(session.role) &&
            prescription.accessGrants.length > 0
        ) {
            authorized = true;
        }

        if (!authorized) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // 4. Read file from disk
        const { buffer } = readPrescriptionFile(prescription.originalFilePath);

        // 5. Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PRESCRIPTION_FILE_DOWNLOADED',
                resource: 'Prescription',
                resourceId: id,
                userId: session.userId as string,
                severity: 'INFO',
            },
        });

        // 6. Stream file with correct MIME type
        // Security headers: no caching of sensitive content
        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': prescription.fileMimeType || 'application/octet-stream',
                'Content-Disposition': `inline; filename="${prescription.originalFileName || 'prescription'}"`,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'X-Content-Type-Options': 'nosniff',
            },
        });

    } catch (error: any) {
        console.error('[GET /api/prescriptions/[id]/file]', error);
        if (error?.message?.includes('not found')) {
            return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

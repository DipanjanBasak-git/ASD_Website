/**
 * GET /api/prescriptions/professionals/search
 *
 * Allows patients to search for professionals to grant prescription access to.
 * Returns a limited set of info (id, name, role) — no sensitive data.
 *
 * Query: ?q=name_search
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { decryptSession } from '@/lib/auth/session';

const CLINICAL_ROLES = ['DOCTOR', 'THERAPIST', 'COUNSELLOR'];

export async function GET(req: NextRequest) {
    try {
        // Auth — any logged-in user (patient needs to grant access)
        const sessionCookie = req.cookies.get('session')?.value;
        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.trim() || '';

        if (query.length < 2) {
            return NextResponse.json({ professionals: [] });
        }

        const professionals = await prisma.user.findMany({
            where: {
                isActive: true,
                isVerified: true,
                fullName: { contains: query, mode: 'insensitive' },
                role: { name: { in: CLINICAL_ROLES } },
            },
            select: {
                id: true,
                fullName: true,
                role: { select: { name: true } },
            },
            take: 10,
            orderBy: { fullName: 'asc' },
        });

        return NextResponse.json({ professionals });

    } catch (error) {
        console.error('[GET /api/prescriptions/professionals/search]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

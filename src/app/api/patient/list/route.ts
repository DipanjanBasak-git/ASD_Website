import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { decryptSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
    try {
        const sessionCookie = req.cookies.get("session")?.value;
        if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

        // Mock Institution ID if not in session yet
        const institutionId = session.institutionId || 'inst-001';

        const patients = await prisma.patient.findMany({
            where: {
                // Filter by institution in real prod
                // institutionId: institutionId 
            },
            orderBy: { updatedAt: "desc" },
            take: 20, // Pagination limit
            include: {
                riskFlags: {
                    where: { isResolved: false }
                },
                visits: {
                    take: 1,
                    orderBy: { visitDate: 'desc' }
                }
            }
        });

        return NextResponse.json({ success: true, patients });

    } catch (error) {
        console.error("Patient List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

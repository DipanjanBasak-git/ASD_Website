import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkRole } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, patientId, visitId, notes, progress } = body;

        // RBAC
        if (!await checkRole(userId, ["THERAPIST", "ADMIN"])) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Create Therapy Record
        const record = await prisma.therapyRecord.create({
            data: {
                patientId,
                visitId,
                therapistId: userId,
                notes,
                progress
            }
        });

        // Update Visit Type if needed or log audit
        await prisma.auditLog.create({
            data: {
                action: "LOG_THERAPY",
                resource: "TherapyRecord",
                resourceId: record.id,
                userId,
                severity: "INFO"
            }
        });

        return NextResponse.json({ success: true, recordId: record.id });

    } catch (error) {
        console.error("Therapy Log Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

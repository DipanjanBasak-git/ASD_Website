import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { decryptSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
    try {
        // 1. Verify User Session & Role
        const sessionCookie = req.cookies.get("session")?.value;
        if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decryptSession(sessionCookie);
        if (!session || session.role !== "PATIENT") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const userId = session.userId as string;

        // 2. Fetch Patient Record linked to Guardian (User)
        const patient = await prisma.patient.findFirst({
            where: { guardianId: userId },
            include: {
                institution: { select: { name: true } },
                screenings: {
                    select: {
                        id: true,
                        toolName: true,
                        riskLevel: true, // Only risk level, not raw data
                        createdAt: true,
                        reviewStatus: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                prescriptions: {
                    select: {
                        id: true,
                        details: true,
                        fileUrl: true,
                        prescribedBy: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                therapies: {
                    select: {
                        id: true,
                        summary: true, // Only summary, not clinical notes
                        progress: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            } // End Valid Patient Query
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
        }

        // 3. Construct Safe Response
        const dashboardData = {
            profile: {
                id: patient.patientUniqueId,
                name: `${patient.firstName} ${patient.lastName}`,
                dob: patient.dob,
                institution: patient.institution.name
            },
            screenings: patient.screenings.map(s => ({
                date: s.createdAt,
                tool: s.toolName,
                risk: s.riskLevel,
                status: s.reviewStatus
            })),
            prescriptions: patient.prescriptions.map(p => ({
                id: p.id,
                date: p.createdAt,
                details: p.details || "Prescription",
                doctor: p.prescribedBy,
                downloadUrl: p.fileUrl ? `/api/download/${p.fileUrl}` : null
            })),
            therapy: patient.therapies.map(t => ({
                date: t.createdAt,
                summary: t.summary || "Session Completed",
                progress: t.progress
            }))
        };

        // 4. Audit Log (Async)
        await prisma.auditLog.create({
            data: {
                action: "PATIENT_DASHBOARD_VIEW",
                resource: "Patient",
                resourceId: patient.id,
                userId: userId,
                severity: "INFO"
            }
        });

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

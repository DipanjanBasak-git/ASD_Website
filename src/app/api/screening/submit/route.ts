import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { scoreMCHAT, calculateCARS2 } from "@/lib/logic/scoring";
import { hasPermission } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { patientId, evaluatorId, toolName, responses, toolVersion } = body;

        // RBAC
        if (!await hasPermission(evaluatorId, "screening.write")) {
            return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
        }

        // Calculate Score Deterministically on Backend
        let result;
        if (toolName === "M-CHAT-R/F") {
            result = scoreMCHAT(responses);
        } else if (toolName === "CARS-2") {
            result = calculateCARS2(responses); // Expects numeric ratings
        } else {
            return NextResponse.json({ error: "Unknown Tool" }, { status: 400 });
        }

        // Save Screening
        const screening = await prisma.screening.create({
            data: {
                patientId,
                evaluatorId,
                toolName,
                toolVersion: toolVersion || "1.0",
                scoringVersion: "1.0",
                rawResponse: responses,
                calculatedScore: result.score,
                riskLevel: result.riskLevel
            }
        });

        // Risk Escalation Workflow
        if (result.riskLevel === "HIGH") {
            await prisma.riskFlag.create({
                data: {
                    patientId,
                    riskLevel: "HIGH",
                    reason: `Auto-flagged by ${toolName} score: ${result.score}`
                }
            });

            // Update Pipeline Stage
            await prisma.patient.update({
                where: { id: patientId },
                data: { pipelineStage: "DIAGNOSIS" } // Move to Dr Review
            });
        }

        return NextResponse.json({
            success: true,
            score: result.score,
            risk: result.riskLevel
        });

    } catch (error) {
        console.error("Screening Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generatePatientId } from "@/lib/logic/naming";
import { checkRole } from "@/lib/auth/rbac";
import { encrypt } from "@/lib/security/encryption";
import { z } from "zod";

const registrationSchema = z.object({
    userId: z.string(), // The counsellor or admin performing registration
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string(),
    gender: z.string(),
    guardianName: z.string(),
    guardianPhone: z.string().min(10),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    institutionId: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = registrationSchema.parse(body);

        // RBAC Check
        if (!await checkRole(data.userId, ["ADMIN", "COUNSELLOR"])) {
            return NextResponse.json({ error: "Unauthorized to register patients" }, { status: 403 });
        }

        // Generate Encrypted Fields
        const encryptedPhone = encrypt(data.guardianPhone);

        // Generate Unique ID
        const uniqueId = await generatePatientId();

        // Transactional Create
        const patient = await prisma.patient.create({
            data: {
                patientUniqueId: uniqueId,
                firstName: data.firstName,
                lastName: data.lastName,
                dob: new Date(data.dob),
                gender: data.gender,
                guardianName: data.guardianName,
                guardianPhone: encryptedPhone, // Stored Encrypted
                address: data.address,
                institutionId: data.institutionId,
                pipelineStage: "REGISTRATION",
                // Create initial visit automatically
                visits: {
                    create: {
                        type: "INITIAL",
                        visitDate: new Date()
                    }
                }
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: "REGISTER_PATIENT",
                resource: "Patient",
                resourceId: patient.id,
                userId: data.userId,
                severity: "INFO",
                newValues: { patientUniqueId: uniqueId }
            }
        });

        return NextResponse.json({
            success: true,
            patientId: patient.id,
            uniqueId: patient.patientUniqueId
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

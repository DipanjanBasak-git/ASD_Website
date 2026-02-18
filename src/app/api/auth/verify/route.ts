import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyOTP } from "@/lib/auth/otp";
import { encryptSession } from "@/lib/auth/session";
import { z } from "zod";

const verifySchema = z.object({
    contact: z.string(),
    otp: z.string().length(6)
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { contact, otp } = verifySchema.parse(body);

        const isValid = await verifyOTP(contact, otp);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: { OR: [{ email: contact }, { phone: contact }] },
            include: { role: true, institution: true }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Create Session
        const session = await encryptSession({
            userId: user.id,
            role: user.role.name,
            institutionId: user.institutionId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        // Determine Redirect URL based on Role
        let redirectUrl = "/dashboard";
        switch (user.role.name) {
            case "ADMIN": redirectUrl = "/admin"; break;
            case "DOCTOR": redirectUrl = "/doctor/dashboard"; break;
            case "THERAPIST": redirectUrl = "/therapist/dashboard"; break;
            case "COUNSELLOR": redirectUrl = "/counsellor/dashboard"; break;
            case "GUARDIAN": redirectUrl = "/portal"; break;
        }

        // Set Cookie
        const response = NextResponse.json({ success: true, redirectUrl });
        response.cookies.set("session", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        });

        // Log Login (Audit)
        await prisma.auditLog.create({
            data: {
                action: "LOGIN",
                resource: "Auth",
                userId: user.id,
                ipAddress: req.headers.get("x-forwarded-for") || "unknown",
                severity: "INFO"
            }
        });

        return response;

    } catch (error) {
        console.error("Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

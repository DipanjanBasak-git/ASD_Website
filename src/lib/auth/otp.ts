import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { otpVerificationEmail, passwordResetEmail } from "@/lib/email/templates";
import bcrypt from "bcryptjs";

type OTPType = 'registration' | 'password-reset';

/**
 * Generate and send OTP for registration or password reset
 * OTP is hashed before storing (never stored in plain text)
 */
export async function generateOTP(email: string, type: OTPType = 'registration'): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Hash OTP before storing (security requirement)
    const otpHash = await bcrypt.hash(otp, 10);

    // Update user with hashed OTP
    await prisma.user.update({
        where: { email },
        data: {
            otpCode: otpHash,
            otpExpiresAt: expiresAt,
            otpAttempts: 0, // Reset attempts on new OTP
            otpLockedUntil: null // Clear any existing lock
        }
    });

    // Send email with appropriate template
    try {
        const template = type === 'registration'
            ? otpVerificationEmail(otp)
            : passwordResetEmail(otp);

        await sendEmail({
            to: email,
            subject: type === 'registration'
                ? "Verify your email - SMART-ASD Platform"
                : "Reset your password - SMART-ASD Platform",
            html: template
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: type === 'registration' ? 'OTP_REQUEST_REGISTRATION' : 'OTP_REQUEST_PASSWORD_RESET',
                resource: 'User',
                resourceId: email,
                severity: 'INFO'
            }
        });

        console.log(`✅ OTP sent to ${email} for ${type}`);
    } catch (error) {
        console.error(`❌ Failed to send OTP email to ${email}:`, error);
        throw new Error('Failed to send verification email. Please try again.');
    }

    return otp; // Return for dev mode logging only
}

/**
 * Verify OTP with security hardening:
 * - Compares hashed OTP
 * - Tracks failed attempts
 * - Locks account after 5 failed attempts
 * - Enforces 5-minute expiry
 */
export async function verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone: email }] }
    });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
        await logFailedAttempt(email, 'OTP_NOT_FOUND');
        return { success: false, message: 'Invalid or expired verification code.' };
    }

    // Check if account is locked
    if (user.otpLockedUntil && new Date() < user.otpLockedUntil) {
        const remainingMinutes = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 60000);
        return {
            success: false,
            message: `Too many failed attempts. Account locked for ${remainingMinutes} more minute(s).`
        };
    }

    // Check expiry
    if (new Date() > user.otpExpiresAt) {
        await prisma.user.update({
            where: { id: user.id },
            data: { otpCode: null, otpExpiresAt: null, otpAttempts: 0 }
        });
        await logFailedAttempt(email, 'OTP_EXPIRED');
        return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    // Verify OTP (compare hashed)
    const isValid = await bcrypt.compare(otp, user.otpCode);

    if (!isValid) {
        const newAttempts = user.otpAttempts + 1;

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
            const lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpAttempts: newAttempts,
                    otpLockedUntil: lockUntil,
                    otpCode: null,
                    otpExpiresAt: null
                }
            });

            await prisma.auditLog.create({
                data: {
                    action: 'OTP_ACCOUNT_LOCKED',
                    resource: 'User',
                    resourceId: user.id,
                    severity: 'WARN'
                }
            });

            return {
                success: false,
                message: 'Too many failed attempts. Account locked for 10 minutes.'
            };
        }

        // Increment attempts
        await prisma.user.update({
            where: { id: user.id },
            data: { otpAttempts: newAttempts }
        });

        await logFailedAttempt(email, 'OTP_INVALID');
        return {
            success: false,
            message: `Invalid code. ${5 - newAttempts} attempt(s) remaining.`
        };
    }

    // Success: Clear OTP and mark as verified
    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpCode: null,
            otpExpiresAt: null,
            otpAttempts: 0,
            otpLockedUntil: null,
            isVerified: true
        }
    });

    await prisma.auditLog.create({
        data: {
            action: 'OTP_VERIFY_SUCCESS',
            resource: 'User',
            resourceId: user.id,
            severity: 'INFO'
        }
    });

    return { success: true, message: 'Verification successful!' };
}

/**
 * Helper: Log failed OTP attempts
 */
async function logFailedAttempt(email: string, reason: string) {
    await prisma.auditLog.create({
        data: {
            action: 'OTP_VERIFY_FAILED',
            resource: 'User',
            resourceId: email,
            severity: 'WARN',
            oldValues: { reason }
        }
    }).catch(() => { }); // Don't fail if audit log fails
}

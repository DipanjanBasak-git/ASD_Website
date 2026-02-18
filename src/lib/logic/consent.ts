import prisma from "@/lib/db";
import { createHash } from "crypto";

export async function verifyDigitalSignature(
    content: string,
    providedHash: string,
    ipAddress: string
): Promise<boolean> {
    // 1. Re-create the hash from the content + timestamp (simulated for now)
    // In a real system, we'd use a public/private key pair or a specific signing secret

    // For this regulatory requirement, we ensure the content matches the hash
    const computedHash = createHash('sha256').update(content).digest('hex');

    return computedHash === providedHash;
}

export async function registerConsent(
    patientId: string,
    consentVersion: string,
    content: string,
    signatureHash: string,
    ipAddress: string
) {
    // Verify hash integrity
    const computedHash = createHash('sha256').update(content).digest('hex');

    if (computedHash !== signatureHash) {
        throw new Error("Digital Signature Mismatch - Integrity Check Failed");
    }

    return await prisma.consent.create({
        data: {
            patientId,
            consentVersion,
            contentHash: computedHash,
            signatureHash,
            ipAddress,
            grantedAt: new Date(),
        }
    });
}

import prisma from "@/lib/db";

export async function generatePatientId(): Promise<string> {
    const year = new Date().getFullYear();

    // Find the last patient ID created this year
    // Format: SMART-YYYY-XXXXXX
    const prefix = `SMART-${year}-`;

    const lastPatient = await prisma.patient.findFirst({
        where: {
            patientUniqueId: {
                startsWith: prefix
            }
        },
        orderBy: {
            patientUniqueId: 'desc'
        },
        select: {
            patientUniqueId: true
        }
    });

    let nextSequence = 1;
    if (lastPatient && lastPatient.patientUniqueId) {
        const parts = lastPatient.patientUniqueId.split('-');
        if (parts.length === 3) {
            const lastSeq = parseInt(parts[2], 10);
            if (!isNaN(lastSeq)) {
                nextSequence = lastSeq + 1;
            }
        }
    }

    const sequenceStr = nextSequence.toString().padStart(6, '0');
    return `${prefix}${sequenceStr}`;
}

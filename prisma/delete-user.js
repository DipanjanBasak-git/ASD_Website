const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUser() {
    const EMAIL = 'debosmitasamanta@gmail.com';
    const PHONE = '7008545156';

    console.log(`🔍 Looking for user with email: ${EMAIL} or phone: ${PHONE}`);

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: EMAIL },
                { phone: PHONE }
            ]
        }
    });

    if (!user) {
        console.log('❌ No user found with that email or phone. Nothing to delete.');
        return;
    }

    console.log(`✅ Found user: ${user.fullName} (ID: ${user.id})`);

    // Find patient records linked to this user as guardian
    const patients = await prisma.patient.findMany({
        where: { guardianId: user.id }
    });

    for (const patient of patients) {
        const patientId = patient.id;
        console.log(`   Patient record found: ${patient.patientUniqueId}`);

        await prisma.therapyRecord.deleteMany({ where: { patientId } });
        await prisma.prescription.deleteMany({ where: { patientId } });
        await prisma.riskFlag.deleteMany({ where: { patientId } });
        await prisma.consent.deleteMany({ where: { patientId } });
        await prisma.screening.deleteMany({ where: { patientId } });
        await prisma.visit.deleteMany({ where: { patientId } });
        await prisma.patient.delete({ where: { id: patientId } });
        console.log(`   ✓ Patient ${patient.patientUniqueId} and all related records deleted`);
    }

    await prisma.auditLog.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log(`\n✅ Done! User "${user.fullName}" has been completely removed.`);
    console.log('   You can now re-register with the same email/phone and get a new Patient ID.');
}

deleteUser()
    .catch(e => { console.error('Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());

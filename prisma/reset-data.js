const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
    console.log('🧹 Clearing all patient & user data...');

    // Delete in FK-safe order
    await prisma.therapyRecord.deleteMany();
    console.log('  ✓ TherapyRecords cleared');

    await prisma.prescription.deleteMany();
    console.log('  ✓ Prescriptions cleared');

    await prisma.riskFlag.deleteMany();
    console.log('  ✓ RiskFlags cleared');

    await prisma.consent.deleteMany();
    console.log('  ✓ Consents cleared');

    await prisma.clinicalMedia.deleteMany();
    console.log('  ✓ ClinicalMedia cleared');

    await prisma.screening.deleteMany();
    console.log('  ✓ Screenings cleared');

    await prisma.visit.deleteMany();
    console.log('  ✓ Visits cleared');

    await prisma.patient.deleteMany();
    console.log('  ✓ Patients cleared');

    await prisma.auditLog.deleteMany();
    console.log('  ✓ AuditLogs cleared');

    // Delete only PATIENT-role users (keep admin/doctor/therapist/counsellor)
    await prisma.user.deleteMany({
        where: { role: { name: 'PATIENT' } }
    });
    console.log('  ✓ Patient user accounts cleared');

    console.log('\n✅ Done! You can now re-register with any email.');
    console.log('   Staff logins (admin, doctor, therapist, counsellor) are untouched.');
}

clean()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

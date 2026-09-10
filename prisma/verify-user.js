const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyUser() {
    const EMAIL = 'www.dipanjanbasak@gmail.com';

    const user = await prisma.user.update({
        where: { email: EMAIL },
        data: {
            isVerified: true,
            otpCode: null,
            otpExpiresAt: null,
            otpAttempts: 0
        },
        select: { fullName: true, email: true, isVerified: true }
    });

    console.log(`✅ User verified!`);
    console.log(`   Name:       ${user.fullName}`);
    console.log(`   Email:      ${user.email}`);
    console.log(`   Verified:   ${user.isVerified}`);
    console.log(`\n   You can now log in with email + password directly.`);
}

verifyUser()
    .catch(e => { console.error('Error:', e.message); process.exit(1); })
    .finally(() => prisma.$disconnect());

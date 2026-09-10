const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOtp() {
    const user = await prisma.user.findFirst({
        where: { email: 'debosmitasamanta@gmail.com' },
        select: { fullName: true, otpCode: true, otpExpiresAt: true, isVerified: true }
    });
    if (!user) {
        console.log('No user found.');
    } else {
        console.log('User:', user.fullName);
        console.log('OTP Code:', user.otpCode);
        console.log('OTP Expires:', user.otpExpiresAt);
        console.log('Is Verified:', user.isVerified);
    }
}
getOtp().finally(() => prisma.$disconnect());

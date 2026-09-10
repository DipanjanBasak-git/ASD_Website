const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    const users = await p.user.findMany({
        where: { role: { name: { in: ['DOCTOR', 'THERAPIST', 'COUNSELLOR'] } } },
        select: { email: true, fullName: true, role: { select: { name: true } }, isVerified: true }
    });
    console.log('Professional accounts:');
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => p.$disconnect());

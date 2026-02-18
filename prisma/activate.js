const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.update({
            where: { email: 'www.dipanjanbasak@gmail.com' },
            data: { isActive: true }
        });
        console.log(`User ${user.email} activated successfully!`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

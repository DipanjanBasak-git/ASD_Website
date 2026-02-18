const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testRegistration() {
    try {
        // Check if User table exists and can be queried
        const userCount = await prisma.user.count();
        console.log(`✓ User table exists. Current count: ${userCount}`);

        // Check if Role table exists
        const roleCount = await prisma.role.count();
        console.log(`✓ Role table exists. Current count: ${roleCount}`);

        // List all roles
        const roles = await prisma.role.findMany();
        console.log('\nAvailable roles:');
        roles.forEach(r => console.log(`  - ${r.name} (ID: ${r.id})`));

        // List all users
        const users = await prisma.user.findMany({
            select: { id: true, email: true, fullName: true, role: { select: { name: true } } }
        });
        console.log('\nCurrent users:');
        users.forEach(u => console.log(`  - ${u.email} (${u.fullName}) - Role: ${u.role.name}`));

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Code:', error.code);
    } finally {
        await prisma.$disconnect();
    }
}

testRegistration();

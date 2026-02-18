const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function testCreateUser() {
    try {
        // Get PATIENT role
        const patientRole = await prisma.role.findUnique({
            where: { name: 'PATIENT' }
        });

        if (!patientRole) {
            console.error('❌ PATIENT role not found!');
            return;
        }

        console.log(`✓ Found PATIENT role: ${patientRole.id}`);

        // Hash password
        const passwordHash = await bcrypt.hash('Test123!', 10);

        // Try to create a test user
        const newUser = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                phone: '9999999998',
                fullName: 'Test User',
                passwordHash: passwordHash,
                roleId: patientRole.id,
                isVerified: false,
                verificationMethod: 'email',
                isActive: true
            }
        });

        console.log('✅ Successfully created test user:');
        console.log(`   ID: ${newUser.id}`);
        console.log(`   Email: ${newUser.email}`);
        console.log(`   Name: ${newUser.fullName}`);

        // Clean up - delete the test user
        await prisma.user.delete({
            where: { id: newUser.id }
        });
        console.log('✓ Test user deleted');

    } catch (error) {
        console.error('❌ Error creating user:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        if (error.meta) {
            console.error('Meta:', JSON.stringify(error.meta, null, 2));
        }
    } finally {
        await prisma.$disconnect();
    }
}

testCreateUser();

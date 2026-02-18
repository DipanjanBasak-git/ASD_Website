const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
console.log("Seed script started...");
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function main() {
    console.log('Seeding database...');

    // 1. Create Roles First
    const roles = ['ADMIN', 'DOCTOR', 'THERAPIST', 'COUNSELLOR', 'PATIENT'];
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, description: `${roleName} role` }
        });
    }
    console.log('Roles seeded.');

    // 2. Create Institution
    await prisma.institution.upsert({
        where: { code: 'SRC-001' },
        update: {},
        create: {
            name: 'SMART-ASD Research Centre',
            code: 'SRC-001',
            district: 'Kolkata',
            state: 'West Bengal'
        }
    });
    console.log('Institution seeded.');

    // 3. Get Role IDs
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const doctorRole = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });
    const therapistRole = await prisma.role.findUnique({ where: { name: 'THERAPIST' } });
    const counsellorRole = await prisma.role.findUnique({ where: { name: 'COUNSELLOR' } });

    // 4. Create Users (ALL VERIFIED)
    const adminPassword = await hashPassword('Admin@123');
    const staffPassword = await hashPassword('Admin123!');

    const users = [
        {
            email: 'admin@smartasd.local',
            roleId: adminRole.id,
            fullName: 'System Administrator',
            phone: '9999999999',
            password: adminPassword
        },
        {
            email: 'doctor@smart-asd.org',
            roleId: doctorRole.id,
            fullName: 'Dr. House',
            phone: '8888888888',
            password: staffPassword
        },
        {
            email: 'therapist@smart-asd.org',
            roleId: therapistRole.id,
            fullName: 'Emma Stone',
            phone: '7777777777',
            password: staffPassword
        },
        {
            email: 'counsellor@smart-asd.org',
            roleId: counsellorRole.id,
            fullName: 'Sarah Connor',
            phone: '9876543210',
            password: staffPassword
        }
    ];

    const institution = await prisma.institution.findUnique({ where: { code: 'SRC-001' } });

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                passwordHash: u.password,
                isVerified: true
            },
            create: {
                email: u.email,
                phone: u.phone,
                fullName: u.fullName,
                roleId: u.roleId,
                passwordHash: u.password,
                institutionId: institution.id,
                isActive: true,
                isVerified: true,
                verificationMethod: 'email'
            },
        });
        console.log(`User ${u.fullName} seeded.`);
    }

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: admin@smartasd.local');
    console.log('  Password: Admin@123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

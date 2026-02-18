import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function main() {
    const password = await hashPassword('Admin123!');

    // 1. Admin
    await prisma.user.upsert({
        where: { contactEmail: 'admin@smart-asd.org' },
        update: {},
        create: {
            firstName: 'System',
            lastName: 'Admin',
            role: 'ADMIN',
            contactEmail: 'admin@smart-asd.org',
            contactPhone: '9999999999',
            passwordHash: password,
            institutionId: 'inst-001',
            isActive: true,
        },
    });

    // 2. Counsellor (For Registration)
    await prisma.user.upsert({
        where: { contactEmail: 'counsellor@smart-asd.org' },
        update: {},
        create: {
            firstName: 'Sarah',
            lastName: 'Connor',
            role: 'COUNSELLOR',
            contactEmail: 'counsellor@smart-asd.org',
            contactPhone: '9876543210',
            passwordHash: password,
            institutionId: 'inst-001',
            isActive: true,
        },
    });

    // 3. Doctor (For Review)
    await prisma.user.upsert({
        where: { contactEmail: 'doctor@smart-asd.org' },
        update: {},
        create: {
            firstName: 'Dr.',
            lastName: 'House',
            role: 'DOCTOR',
            contactEmail: 'doctor@smart-asd.org',
            contactPhone: '8888888888',
            passwordHash: password,
            institutionId: 'inst-001',
            isActive: true,
        },
    });

    // 4. Therapist (For Notes)
    await prisma.user.upsert({
        where: { contactEmail: 'therapist@smart-asd.org' },
        update: {},
        create: {
            firstName: 'Emma',
            lastName: 'Stone',
            role: 'THERAPIST',
            contactEmail: 'therapist@smart-asd.org',
            contactPhone: '7777777777',
            passwordHash: password,
            institutionId: 'inst-001',
            isActive: true,
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

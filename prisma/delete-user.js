const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'www.dipanjanbasak@gmail.com';

        // Find user
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            console.log("User not found.");
            return;
        }

        // Delete related patient records first (due to foreign key constraints if cascade not set)
        // Check if user is a guardian
        await prisma.patient.deleteMany({
            where: { guardianId: user.id }
        });

        // Delete user
        await prisma.user.delete({
            where: { id: user.id }
        });

        console.log(`User ${email} and related data deleted successfully.`);
    } catch (e) {
        console.error("Error deleting user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

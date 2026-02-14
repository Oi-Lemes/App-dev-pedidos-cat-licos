import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning Purchases / Resetting Plans...');

    const result = await prisma.user.updateMany({
        data: {
            plan: 'basic',
            hasLiveAccess: false,
            hasNinaAccess: false,
            hasWalletAccess: false,
            downloadHistory: []
        }
    });

    console.log(`✅ Reset ${result.count} users to Basic Plan.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

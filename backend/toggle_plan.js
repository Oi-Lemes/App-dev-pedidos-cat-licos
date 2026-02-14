const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PHONE = '11999999999';
const NEW_PLAN = process.argv[2] || 'basic'; // 'basic' or 'premium'

async function main() {
    console.log(`Setting user ${PHONE} to plan: ${NEW_PLAN}`);

    const updateData = {
        plan: NEW_PLAN,
        hasLiveAccess: NEW_PLAN === 'premium',
        hasNinaAccess: NEW_PLAN === 'premium',
        hasWalletAccess: NEW_PLAN === 'premium',
    };

    const user = await prisma.user.updateMany({
        where: { phone: PHONE },
        data: updateData,
    });

    console.log('Update result:', user);
    console.log(`\nUser is now ${NEW_PLAN.toUpperCase()}. Check the dashboard.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

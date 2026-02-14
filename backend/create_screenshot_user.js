import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phone = '11999999999';
    console.log(`Creating/Updating user with phone ${phone}...`);

    const user = await prisma.user.upsert({
        where: { phone: phone },
        update: {
            plan: 'premium',
            status: 'active',
            hasLiveAccess: true,
            hasNinaAccess: true,
            hasWalletAccess: true,
        },
        create: {
            phone: phone,
            email: 'screenshot@test.com',
            name: 'Usuário de Screenshot',
            plan: 'premium',
            status: 'active',
            hasLiveAccess: true,
            hasNinaAccess: true,
            hasWalletAccess: true,
        },
    });

    console.log('User created/updated:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

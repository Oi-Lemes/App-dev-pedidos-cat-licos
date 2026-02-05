
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const mod1 = await prisma.modulo.findFirst({
        where: { ordem: 1 },
        select: { id: true, nome: true, imagem: true }
    });
    console.log('--- DB CHECK ---');
    console.log(mod1);
    await prisma.$disconnect();
}

main().catch(console.error);

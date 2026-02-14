import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const modules = await prisma.modulo.findMany({
        orderBy: { id: 'asc' }
    });
    console.log('--- Current Modules in DB ---');
    modules.forEach(m => {
        console.log(`[${m.id}] ${m.nome}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const idsToDelete = [63, 67, 90, 99, 100, 101, 102];

    console.log(`Deleting modules with IDs: ${idsToDelete.join(', ')}`);

    const result = await prisma.modulo.deleteMany({
        where: {
            id: { in: idsToDelete }
        }
    });

    console.log(`Deleted ${result.count} modules.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

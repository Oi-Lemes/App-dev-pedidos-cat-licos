
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Verificando banco de dados de produção...");

    const count = await prisma.modulo.count();
    console.log(`📊 Total de Módulos: ${count}`);

    const modulos = await prisma.modulo.findMany({
        orderBy: { ordem: 'asc' }
    });

    console.log("📝 Lista de Módulos:");
    modulos.forEach(m => {
        console.log(`[${m.id}] ${m.nome} (Ordem: ${m.ordem})`);
    });

    const musicMod = modulos.find(m => m.nome.toLowerCase().includes('música') || m.nome.toLowerCase().includes('musica'));
    if (musicMod) {
        console.log("✅ Módulo de Músicas ENCONTRADO!");

        // Check aulas count
        const aulasCount = await prisma.aula.count({
            where: { moduloId: musicMod.id }
        });
        console.log(`🎵 Músicas cadastradas neste módulo: ${aulasCount}`);
    } else {
        console.log("❌ Módulo de Músicas NÃO ENCONTRADO.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

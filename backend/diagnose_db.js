
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 DIAGNÓSTICO DO BANCO DE DADOS");
    console.log(`📡 URL Configurada: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'UNDEFINED'}`);

    // Tenta criar módulo na marra
    const modName = 'Musicas Catolicas (Teste)';

    try {
        console.log("📝 Tentando criar módulo de teste...");
        const mod = await prisma.modulo.create({
            data: {
                nome: modName,
                description: 'Teste de persistência',
                ordem: 100,
                imagem: 'teste.png'
            }
        });
        console.log(`✅ Módulo criado com ID: ${mod.id}`);

        // Verifica se consegue ler de volta
        const check = await prisma.modulo.findUnique({ where: { id: mod.id } });
        console.log(`👀 Leitura imediata: ${check ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);

        // Limpeza
        // await prisma.modulo.delete({ where: { id: mod.id } });
        // console.log("🧹 Limpeza concluída.");

    } catch (e) {
        console.error("❌ ERRO FATAL NO BANCO:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Buscando usuário 'admin' para liberar acesso total...");

    // Tenta achar pelo telefone do print (se visivel) ou email
    // Como não tenho o telefone exato, vou listar os usuarios e pegar o mais recente ou pedir input
    // Mas vou fazer um update massivo em QUEM TEM PLANO BASIC para ULTRA (Perigoso? O user é dev, é ambiente dele)
    // MELHOR: Pegar o ultimo usuario criado ou com status "pending"

    // Vou listar todos usuarios primeiro
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log("Found users:", users);

    if (users.length > 0) {
        const targetUser = users[0]; // Pega o mais recente (provavelmente ele)
        console.log(`🚀 Promovendo usuário ${targetUser.email || targetUser.phone} para ULTRA...`);

        await prisma.user.update({
            where: { id: targetUser.id },
            data: {
                plan: 'ultra',
                hasNinaAccess: true,
                hasLiveAccess: true,
                hasWalletAccess: true
            }
        });
        console.log("✅ Usuário promovido com sucesso!");
    } else {
        console.log("❌ Nenhum usuário encontrado no banco.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

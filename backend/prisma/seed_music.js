
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajuste o caminho base para onde estão as pastas de música
const MUSIC_BASE_DIR = path.join(__dirname, '../uploads/musicas');

async function main() {
    console.log('🎸 INICIANDO SEED DE MÚSICAS CATÓLICAS...');

    // Verifica se a pasta existe
    if (!fs.existsSync(MUSIC_BASE_DIR)) {
        console.error(`❌ Diretório não encontrado: ${MUSIC_BASE_DIR}`);
        return;
    }

    // Lê as pastas (Artistas)
    const entries = fs.readdirSync(MUSIC_BASE_DIR, { withFileTypes: true });
    const artistFolders = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    console.log(`Encontrados ${artistFolders.length} artistas/pastas.`);

    // --- LÓGICA DE LIMPEZA E CRIAÇÃO DO MÓDULO ÚNICO ---

    // 1. Limpar Módulos Antigos (Formato "🎵 Nome")
    // Para não apagar o novo módulo único se rodar 2x, deletamos por padrão antigo ou ID específico se necessário.
    // Aqui vamos deletar tudo que começa com "🎵 " EXCETO o nosso novo módulo se ele já existir com outro nome.
    // Mas para garantir, vamos deletar TUDO de música e refazer.
    console.log('🧹 Limpando módulos de música antigos...');
    const oldModules = await prisma.modulo.findMany({
        where: { nome: { startsWith: '🎵 ' } }
    });
    for (const om of oldModules) {
        // Deleta aulas cascata? O schema diz onDelete: Cascade, então ok.
        await prisma.modulo.delete({ where: { id: om.id } });
    }

    // 2. Criar Módulo Único "Músicas Católicas"
    // Usamos um emoji diferente ou nome fixo para diferenciar no Frontend
    const SINGLE_MODULE_NAME = '🎹 Músicas Católicas (Acervo)';

    let bigModule = await prisma.modulo.findFirst({ where: { nome: SINGLE_MODULE_NAME } });

    if (bigModule) {
        await prisma.modulo.update({
            where: { id: bigModule.id },
            data: {
                ordem: 99,
                imagem: '/img/background_catholic.png' // Imagem genérica para o módulo pai
            }
        });
    } else {
        bigModule = await prisma.modulo.create({
            data: {
                nome: SINGLE_MODULE_NAME,
                description: 'Super coleção de músicas separadas por artista.',
                ordem: 99,
                imagem: '/img/background_catholic.png'
            }
        });
    }
    console.log(`✅ Super Módulo Criado: ${bigModule.nome}`);

    // Limpar aulas desse módulo para não duplicar músicas ao re-rodar
    await prisma.aula.deleteMany({ where: { moduloId: bigModule.id } });

    // Contador global para ordem das músicas
    let globalOrder = 1;

    for (let i = 0; i < artistFolders.length; i++) {
        const artistName = artistFolders[i];
        const artistPath = path.join(MUSIC_BASE_DIR, artistName);

        console.log(`\n--- Processando Artista: ${artistName} ---`);

        // Tentar achar a capa do ARTISTA para usar nas AULAS (Músicas)
        // Assim o frontend pode agrupar e mostrar a foto do cantor
        let artistImage = '/img/background_catholic.png';
        const artistFiles = fs.readdirSync(artistPath);
        const coverFile = artistFiles.find(f => f.toLowerCase().match(/^cover\.|^folder\.|^fanart\.|^album\.|^art\./) && (f.endsWith('.jpg') || f.endsWith('.png')));

        if (coverFile) {
            // Caminho web para a imagem
            artistImage = `/uploads/musicas/${artistName}/${coverFile}?v=${Date.now()}`;
        }

        // Escanear Músicas
        const songs = [];

        function scanDir(dir) {
            const list = fs.readdirSync(dir, { withFileTypes: true });
            list.forEach(item => {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    scanDir(fullPath);
                } else if (item.isFile() && (item.name.endsWith('.mp3') || item.name.endsWith('.wav') || item.name.endsWith('.m4a'))) {
                    const uploadsDir = path.join(__dirname, '../uploads');
                    const relative = path.relative(uploadsDir, fullPath).replace(/\\/g, '/');
                    const url = `/uploads/${relative}`;

                    let cleanName = item.name.replace(/\.[^/.]+$/, "");
                    cleanName = cleanName.replace(/^\d+\s*[-_.]?\s*/, "");

                    songs.push({
                        name: cleanName,
                        url: url
                    });
                }
            });
        }

        scanDir(artistPath);
        console.log(`   + ${songs.length} músicas.`);

        // Criar Aulas (Músicas) vinculadas ao SUPER MÓDULO
        // Importante: 'descricao' = Nome do Artista (usado para agrupar)
        // 'imagem' = Foto do Artista
        for (const song of songs) {
            await prisma.aula.create({
                data: {
                    nome: song.name,
                    descricao: artistName, // <--- CHAVE DO AGRUPAMENTO
                    content: `**${song.name}**\n\n*Artista: ${artistName}*`,
                    videoUrl: song.url,
                    imagem: artistImage,   // <--- FOTO DO CANTOR
                    isImage: false,
                    ordem: globalOrder++,
                    moduloId: bigModule.id // Tudo no mesmo módulo
                }
            });
        }
    }

    console.log('\n✅ SEED DE MÚSICAS CONCLUÍDO!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

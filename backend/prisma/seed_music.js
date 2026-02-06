
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração R2
const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const MUSIC_BASE_DIR = path.join(__dirname, '../uploads/musicas');

// Função para listar TUDO do R2 (Paginação)
async function listAllR2Keys(prefix) {
    let keys = [];
    let continuationToken = undefined;

    do {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
            Prefix: prefix,
            ContinuationToken: continuationToken
        });
        const response = await r2.send(command);
        if (response.Contents) {
            keys.push(...response.Contents);
        }
        continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return keys;
}

async function main() {
    console.log('🎸 INICIANDO SEED DE MÚSICAS CATÓLICAS...');

    let artistData = {}; // { 'NomeArtista': [ { name: 'musica', url: '...' } ] }
    let source = 'LOCAL';

    // 1. TENTA LER LOCALMENTE
    if (fs.existsSync(MUSIC_BASE_DIR)) {
        console.log("📂 Diretório local encontrado. Usando arquivos locais...");
        const entries = fs.readdirSync(MUSIC_BASE_DIR, { withFileTypes: true });
        const artistFolders = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

        for (const artistName of artistFolders) {
            artistData[artistName] = [];
            const artistPath = path.join(MUSIC_BASE_DIR, artistName);

            function scanDir(dir) {
                const list = fs.readdirSync(dir, { withFileTypes: true });
                list.forEach(item => {
                    const fullPath = path.join(dir, item.name);
                    if (item.isDirectory()) {
                        scanDir(fullPath);
                    } else if (item.isFile() && (item.name.endsWith('.mp3') || item.name.endsWith('.wav') || item.name.endsWith('.m4a'))) {
                        const relative = path.relative(path.join(__dirname, '../uploads'), fullPath).replace(/\\/g, '/');
                        let cleanName = item.name.replace(/\.[^/.]+$/, "").replace(/^\d+\s*[-_.]?\s*/, "");

                        let url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${relative}` : `/uploads/${relative}`;
                        url = url.replace(/ /g, '%20');

                        artistData[artistName].push({ name: cleanName, url });
                    }
                });
            }
            scanDir(artistPath);
        }
    }
    // 2. SE NÃO TIVER LOCAL, VAI NO R2
    else {
        source = 'CLOUD';
        console.log(`☁️ Diretório local NÃO encontrado. Buscando no R2 (${R2_BUCKET_NAME})...`);

        try {
            const allObjects = await listAllR2Keys('musicas/');
            console.log(`📦 Objetos encontrados no R2: ${allObjects.length}`);

            // Pré-processamento: Mapear capas por Artista
            // { 'NomeArtista': 'https://...' }
            let artistCovers = {};

            allObjects.forEach(obj => {
                const key = obj.Key;
                const parts = key.split('/');
                if (parts.length < 3) return;
                const artistName = parts[1];
                const fileName = parts[parts.length - 1].toLowerCase();

                // Se for imagem de capa (cover.jpg, folder.jpg, etc)
                if (fileName.match(/^cover\.|^folder\.|^fanart\.|^album\.|^art\./) && (fileName.endsWith('.jpg') || fileName.endsWith('.png'))) {
                    let url = `${R2_PUBLIC_URL}/${key}`;
                    url = url.replace(/ /g, '%20');
                    artistCovers[artistName] = url;
                }
            });

            allObjects.forEach(obj => {
                const key = obj.Key; // ex: musicas/Padre Fabio/musica.mp3
                if (!key.endsWith('.mp3') && !key.endsWith('.wav') && !key.endsWith('.m4a')) return;

                const parts = key.split('/');
                if (parts.length < 3) return; // musicas/Artista/Musica

                const artistName = parts[1]; // Padre Fabio
                const fileName = parts[parts.length - 1];
                let cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/^\d+\s*[-_.]?\s*/, "");

                if (!artistData[artistName]) artistData[artistName] = [];

                let url = `${R2_PUBLIC_URL}/${key}`;
                url = url.replace(/ /g, '%20');

                // Anexamos a capa descoberta (se houver) a cada música, 
                // para depois usarmos no loop de criação.
                const coverUrl = artistCovers[artistName] || '/img/background_catholic.png';

                artistData[artistName].push({ name: cleanName, url, cover: coverUrl });
            });

        } catch (e) {
            console.error("❌ Erro ao listar do R2:", e);
            return;
        }
    }

    const artistsFound = Object.keys(artistData);
    console.log(`🎤 Artistas identificados (${source}): ${artistsFound.length}`);

    // --- CRIAÇÃO NO BANCO ---

    // Nome do Módulo Seguro
    const SINGLE_MODULE_NAME = 'Musicas Catolicas (Acervo Completissimo)';

    let bigModule = await prisma.modulo.findFirst({ where: { nome: SINGLE_MODULE_NAME } });

    if (!bigModule) {
        bigModule = await prisma.modulo.create({
            data: {
                nome: SINGLE_MODULE_NAME,
                description: 'Super coleção de músicas separadas por artista.',
                ordem: 99,
                imagem: 'https://pub-77eb37976e33436098256561219b6717.r2.dev/background_catholic.png' // URL Fixa ou local
            }
        });
    }
    console.log(`✅ Módulo Garantido: ${bigModule.nome} (ID: ${bigModule.id})`);

    // Limpar musicas antigas DESTE MÓDULO APENAS para evitar duplicatas
    await prisma.aula.deleteMany({ where: { moduloId: bigModule.id } });

    let globalOrder = 1;

    for (const artistName of artistsFound) {
        const songs = artistData[artistName];
        if (songs.length === 0) continue;

        console.log(`   + ${artistName}: ${songs.length} músicas.`);

        // Imagem do artista (Prioridade: Capa encontrada > Genérica)
        // Como todas as músicas do mesmo artista têm a mesma capa no nosso objeto (se achada), basta pegar da primeira.
        let artistImage = songs[0].cover || '/img/background_catholic.png';

        for (const song of songs) {
            await prisma.aula.create({
                data: {
                    nome: song.name,
                    descricao: artistName,
                    content: `**${song.name}**\n\n*Artista: ${artistName}*`,
                    videoUrl: song.url,
                    imagem: artistImage,
                    isImage: false,
                    ordem: globalOrder++,
                    moduloId: bigModule.id
                }
            });
        }
    }

    console.log(`\n✅ SEED DE MÚSICAS CONCLUÍDO (${source})!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

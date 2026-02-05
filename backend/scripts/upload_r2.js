
import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURAÇÃO ---
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Verifica credenciais
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error('❌ ERRO: Faltam variáveis de ambiente do R2 no .env!');
    console.error('Certifique-se de ter: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
    process.exit(1);
}

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

const LOCAL_MUSIC_DIR = path.join(__dirname, '../uploads/musicas');

// Função recursiva para listar arquivos
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            // Filtra apenas arquivos de áudio e imagens (capas)
            if (file.match(/\.(mp3|wav|m4a|jpg|jpeg|png)$/i)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

async function main() {
    console.log('🚀 Iniciando Upload para Cloudflare R2...');
    console.log(`📁 Lendo arquivos de: ${LOCAL_MUSIC_DIR}`);

    if (!fs.existsSync(LOCAL_MUSIC_DIR)) {
        console.error('❌ Pasta de músicas não encontrada!');
        return;
    }

    const allFiles = getAllFiles(LOCAL_MUSIC_DIR);
    console.log(`🎵 Total de arquivos encontrados: ${allFiles.length}`);

    let count = 0;
    const total = allFiles.length;

    // Processa um por um (ou poderia usar Promise.all com limite de concorrência)
    for (const filePath of allFiles) {
        count++;
        // Cria a chave (caminho) no Bucket relativa à pasta 'uploads/musicas'
        // Ex: Ziza Fernandes/Album X/musica.mp3
        const relativePath = path.relative(LOCAL_MUSIC_DIR, filePath).replace(/\\/g, '/');
        const bucketKey = `musicas/${relativePath}`; // Prefixo 'musicas/' no bucket

        console.log(`[${count}/${total}] ⬆️ Subindo: ${relativePath}`);

        try {
            const fileStream = fs.createReadStream(filePath);

            // Usa Upload do lib-storage para gerenciar multipart upload automaticamente
            const parallelUploads3 = new Upload({
                client: s3Client,
                params: {
                    Bucket: R2_BUCKET_NAME,
                    Key: bucketKey,
                    Body: fileStream,
                    ContentType: getContentType(filePath),
                },
            });

            await parallelUploads3.done();
            // console.log(`✅ Sucesso: ${relativePath}`);
        } catch (e) {
            console.error(`❌ Falha ao subir ${relativePath}:`, e.message);
        }
    }

    console.log('🎉 Upload Concluído! Todos os arquivos estão no R2.');
}

function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.mp3': return 'audio/mpeg';
        case '.wav': return 'audio/wav';
        case '.m4a': return 'audio/mp4';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        default: return 'application/octet-stream';
    }
}

main();

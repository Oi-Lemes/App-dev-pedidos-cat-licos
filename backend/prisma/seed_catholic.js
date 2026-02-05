
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// ==========================================
// BIBLIOTECA DE ORAÇÕES E SALMOS (SANTOS ESPECÍFICOS E TEXTO COMPLETO)
// ==========================================
const PRAYERS = {
  // --- GUIAS PRÁTICOS (TUTORIAIS) ---
  guia_prosperidade: {
    nome: 'GUIA: Como Rezar por Prosperidade',
    descricao: 'Tutorial Prático',
    imagem: '/img/guia_prosperidade.png',
    content: `**PASSO A PASSO PARA POTENCIALIZAR A ORAÇÃO**\n\n**📅 Frequência:** 9 dias seguidos (Novena).\n**⏰ Melhor Horário:** Entre 6h e 9h da manhã (ao iniciar o dia).\n**🥪 Jejum Sugerido:** Abster-se de compras supérfluas durante a novena.\n\n**Como Rezar:**\n1. Encontre um lugar silencioso, sente-se ou ajoelhe-se.\n2. Faça o Sinal da Cruz.\n3. Agradeça em voz alta por 3 coisas que você já tem (o teto, o alimento, a vida).\n4. Reze as orações abaixo com fé inabalável, visualizando a providência chegando.\n\n_"Deus não prospera a preguiça, mas abençoa o esforço."_`
  },
  guia_emprego: {
    nome: 'GUIA: Para Conseguir Emprego',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO PARA ABRIR PORTAS**\n\n**📅 Frequência:** 7 dias seguidos.\n**⏰ Melhor Horário:** Antes de sair para entregar currículos ou trabalhar.\n**🥪 Jejum Sugerido:** Jejum de reclamação (fique 7 dias sem falar mal de nada ou ninguém).\n\n**Como Rezar:**\n1. Segure sua carteira de trabalho ou currículo nas mãos.\n2. Apresente-os a Deus dizendo: "Senhor, santifica este instrumento de trabalho".\n3. Reze a oração de São José Operário.\n4. Mantenha a confiança de que a porta certa se abrirá.`
  },
  guia_dividas: {
    nome: 'GUIA: Para Sair das Dívidas',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA LIBERTAÇÃO FINANCEIRA**\n\n**📅 Frequência:** 21 dias (Três semanas).\n**⏰ Melhor Horário:** À noite, antes de dormir (para entregar a ansiedade).\n**🥪 Jejum Sugerido:** Corte um alimento que você gosta muito (ex: doce, café) como sacrifício.\n\n**Como Rezar:**\n1. Escreva suas dívidas num papel e coloque dentro da Bíblia (no Salmo 23).\n2. Reze o Salmo 23 e a oração de Santa Edwiges.\n3. Diga: "Senhor, eu não sou escravo do dinheiro. Eu sou teu filho(a)."\n4. Durma em paz, confiando que Deus dará a estratégia para pagar.`
  },
  guia_fertilidade: {
    nome: 'GUIA: Para Engravidar',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA FERTILIDADE**\n\n**📅 Frequência:** Novena (9 dias) - Pode repetir todo mês.\n**⏰ Melhor Horário:** À noite, o casal unido (se possível).\n**🥪 Jejum Sugerido:** Abstinência de algo prazeroso em favor da vida que virá.\n\n**Como Rezar:**\n1. O casal deve unir as mãos ou colocar as mãos no ventre da esposa.\n2. Reze a oração de São Geraldo.\n3. Peçam: "Senhor, se for da tua vontade, envia-nos um anjo".\n4. Confiem no tempo de Deus.`
  },
  guia_gravidez: {
    nome: 'GUIA: Proteção na Gestação',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA PROTEÇÃO**\n\n**📅 Frequência:** Diariamente durante a gestação.\n**⏰ Melhor Horário:** Pela manhã ou ao sentir o bebê mexer.\n**🥪 Oferta:** Ofereça os desconfortos (enjoos, dores) pela santificação do bebê.\n\n**Como Rezar:**\n1. Faça o sinal da cruz sobre a barriga.\n2. Reze a oração ao Anjo da Guarda do bebê.\n3. Consagre a criança a Nossa Senhora.`
  },
  guia_casamento_enc: {
    nome: 'GUIA: Encontrar um Amor',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DO ENCONTRO**\n\n**📅 Frequência:** 13 dias (Trezena de Santo Antônio).\n**⏰ Melhor Horário:** À noite.\n**🥪 Jejum Sugerido:** Praticar a caridade (dar esmola ou ajudar alguém) durante os 13 dias.\n\n**Como Rezar:**\n1. Peça perdão pelos erros de relacionamentos passados.\n2. Peça a Deus alguém que O ame mais do que ama você.\n3. Reze com o coração aberto, sem impor condições.`
  },
  guia_casamento_rest: {
    nome: 'GUIA: Restaurar o Casamento',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA RESTAURAÇÃO**\n\n**📅 Frequência:** 30 dias ininterruptos.\n**⏰ Melhor Horário:** Madrugada ou quando o cônjuge dorme (intercessão).\n**🥪 Jejum Sugerido:** Jejum de palavras duras. Não critique seu cônjuge por 30 dias.\n\n**Como Rezar:**\n1. Ajoelhe-se e imagine Jesus entre você e seu esposo(a).\n2. Diga: "Eu perdôo [nome] e peço que ele(a) me perdoe".\n3. Reze o rosário ou terço pelas feridas do casal.`
  },
  guia_inveja: {
    nome: 'GUIA: Contra Inveja',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA BLINDAGEM**\n\n**📅 Frequência:** 7 dias (ou sempre que sentir o ambiente pesado).\n**⏰ Melhor Horário:** Ao acordar, antes de colocar o pé no chão.\n**🥪 Jejum Sugerido:** Silêncio. Evite contar seus planos e vitórias para os outros.\n\n**Como Rezar:**\n1. Faça o sinal da cruz.\n2. Reze a Oração de São Jorge visualizando uma armadura de luz.\n3. Diga: "Nenhum mal me atingirá, pois pertenço a Jesus".`
  },
  guia_recomecar: {
    nome: 'GUIA: Para Recomeçar',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DO NOVO CICLO**\n\n**📅 Frequência:** 3 dias (Tríduo).\n**⏰ Melhor Horário:** Ao amanhecer (símbolo de vida nova).\n**🥪 Sugestão:** Se possível, faça uma boa Confissão sacramental na igreja.\n\n**Como Rezar:**\n1. Entregue o passado a Deus: "Senhor, o que passou, passou".\n2. Reze o Salmo 51 (Miserere).\n3. Peça a graça de olhar apenas para frente.`
  },
  guia_causas: {
    nome: 'GUIA: Causas Impossíveis',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DO MILAGRE**\n\n**📅 Frequência:** Novena (9 dias) de Santa Rita ou Santo Expedito.\n**⏰ Melhor Horário:** 15h (Hora da Misericórdia).\n**🥪 Jejum Sugerido:** Pão e água em um dos dias da novena (se a saúde permitir).\n\n**Como Rezar:**\n1. Tenha em mente o pedido exato. Seja específico.\n2. Reze o Terço da Misericórdia.\n3. Prometa propagar a devoção ao Santo se alcançar a graça.`
  },
  guia_cura_emo: {
    nome: 'GUIA: Cura Emocional',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA PAZ INTERIOR**\n\n**📅 Frequência:** 14 dias.\n**⏰ Melhor Horário:** À noite, desligue o celular 1h antes.\n**🥪 Jejum Sugerido:** Jejum de notícias ruins e redes sociais.\n\n**Como Rezar:**\n1. Respire fundo e acalme o corpo.\n2. Imagine Jesus tocando na sua memória dolorosa.\n3. Reze a oração de Santa Dymphna.\n4. Entregue a ansiedade uma a uma nas mãos de Deus.`
  },
  guia_cura_fisica: {
    nome: 'GUIA: Cura Física',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA SAÚDE**\n\n**📅 Frequência:** Novena ou enquanto durar a enfermidade.\n**⏰ Melhor Horário:** Nos momentos de dor ou ao tomar medicação.\n**🥪 Oferta:** Una seu sofrimento à Paixão de Cristo.\n\n**Como Rezar:**\n1. Coloque a mão sobre o local da enfermidade.\n2. Diga: "Pelas tuas chagas, Senhor, eu fui curado (Is 53)".\n3. Peça a intercessão de São Camilo.`
  },
  guia_medo: {
    nome: 'GUIA: Vencer o Medo',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA CORAGEM**\n\n**📅 Frequência:** 7 noites seguidas.\n**⏰ Melhor Horário:** Antes de dormir.\n**🥪 Ação:** Tenha um crucifixo ou imagem de Jesus no quarto.\n\n**Como Rezar:**\n1. Segure o crucifixo.\n2. Reze o Salmo 91 em voz alta, declarando a proteção.\n3. Diga 3 vezes: "Jesus, eu confio em Vós".`
  },
  guia_decisoes: {
    nome: 'GUIA: Tomar Decisões',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA SABEDORIA**\n\n**📅 Frequência:** 3 dias antes da decisão.\n**⏰ Melhor Horário:** Pela manhã, com a mente descansada.\n**🥪 Jejum Sugerido:** Jejum leve pela manhã (só líquidos até 9h).\n\n**Como Rezar:**\n1. Peça: "Espírito Santo, decide por mim".\n2. Reze "Vinde Espírito Santo".\n3. Leia um trecho da Bíblia e veja se algo toca seu coração.`
  },
  guia_filhos: {
    nome: 'GUIA: Pelos Filhos',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DE MÃE/PAI**\n\n**📅 Frequência:** Diariamente - Oração perpétua.\n**⏰ Melhor Horário:** Quando eles estão dormindo ou saindo de casa.\n**🥪 Sacrifício:** Ofereça pequenas renúncias do dia pela conversão deles.\n\n**Como Rezar:**\n1. Reze o Terço pelas intenções dos seus filhos.\n2. Consagre-os a Nossa Senhora todos os dias.\n3. Nunca amaldiçoe ou fale mal deles; apenas abençoe.`
  },
  guia_lar: {
    nome: 'GUIA: Blindar o Lar',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA CASA ABENÇOADA**\n\n**📅 Frequência:** Semanal (ex: todo Domingo).\n**⏰ Melhor Horário:** Durante a limpeza ou organização da casa.\n**🥪 Ação:** Use água benta para aspergir os cômodos.\n\n**Como Rezar:**\n1. Percorra os cômodos rezando "São Bento, protegei este lar".\n2. Coloque um crucifixo na sala principal/entrada.\n3. Reze o Salmo 127 com a família reunida.`
  },
  guia_espiritual: {
    nome: 'GUIA: Crescer na Fé',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA SANTIDADE**\n\n**📅 Frequência:** 21 dias para criar o hábito.\n**⏰ Melhor Horário:** Madrugada ou primeira hora da manhã.\n**🥪 Prática:** Leitura espiritual diária (10 min).\n\n**Como Rezar:**\n1. Invoque o Espírito Santo.\n2. Faça a Lectio Divina (Leitura Orante).\n3. Termine com um propósito prático para o dia.`
  },
  guia_perseveranca: {
    nome: 'GUIA: Não Desistir',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA FORTALEZA**\n\n**📅 Frequência:** Nos momentos de crise.\n**⏰ Melhor Horário:** A qualquer hora.\n**🥪 Jejum:** Jejum da impaciência. Respire antes de reagir.\n\n**Como Rezar:**\n1. Reze: "Deus, dai-me força".\n2. Reze o Salmo 40 ("Esperei com paciência").\n3. Lembre-se que a provação é passageira, a glória é eterna.`
  },
  guia_alegria: {
    nome: 'GUIA: Viver com Alegria',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DO LOUVOR**\n\n**📅 Frequência:** 9 dias.\n**⏰ Melhor Horário:** Durante o banho ou trajeto (cante!).\n**🥪 Ação:** Sorria para 3 pessoas desconhecidas hoje.\n\n**Como Rezar:**\n1. Coloque uma música católica animada.\n2. Louve a Deus em voz alta pelas coisas simples.\n3. Reze: "Senhor, livrai-me da tristeza e do mau humor".`
  },
  guia_entrega: {
    nome: 'GUIA: Entrega Total',
    descricao: 'Tutorial Prático',
    content: `**PASSO A PASSO DA CONSAGRAÇÃO**\n\n**📅 Frequência:** 33 dias (preparação para Consagração) ou vida toda.\n**⏰ Melhor Horário:** Noite.\n**🥪 Jejum:** Renúncia da própria vontade. Aceitar o que vier.\n\n**Como Rezar:**\n1. Reze a oração de Santo Inácio ("Tomai Senhor e recebei").\n2. Diga: "Totus Tuus Mariae" (Sou todo teu, Maria).\n3. Viva o dia crendo que Deus cuida de cada detalhe.`
  },

  // --- BÁSICAS ---
  pai_nosso: {
    nome: 'Pai-Nosso',
    descricao: 'A Oração do Senhor',
    imagem: '/img/fundo.png',
    content: `**Pai Nosso**\n\nPai nosso que estais nos céus, santificado seja o Vosso nome. Venha a nós o Vosso Reino. Seja feita a Vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje. Perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido. E não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
  },
  ave_maria: {
    nome: 'Ave-Maria',
    descricao: 'Saudação Angélica',
    imagem: '/img/fundo.png',
    content: `**Ave Maria**\n\nAve Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.`
  },
  gloria: {
    nome: 'Glória ao Pai',
    descricao: 'Doxologia',
    imagem: '/img/gloria.png',
    content: `**Glória ao Pai**\n\nGlória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
  },
  credo: {
    nome: 'Credo dos Apóstolos',
    descricao: 'Profissão de Fé',
    imagem: '/img/fundo.png',
    content: `**Creio (Símbolo dos Apóstolos)**\n\nCreio em Deus Pai Todo-Poderoso, Criador do céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`
  },
  magnificat: {
    nome: 'Magnificat (Maria)',
    descricao: 'Lc 1, 46-55',
    imagem: '/img/fundo.png',
    content: `**Magnificat**\n\nA minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva. Doravante todas as gerações me chamarão bem-aventurada, porque o Todo-poderoso fez grandes coisas em meu favor. O seu nome é santo, e sua misericórdia se estende, de geração em geração, a todos os que o temem. Manifestou o poder do seu braço, dispersou os soberbos. Derrubou os poderosos de seus tronos e exaltou os humildes. Aos famintos encheu de bens, e aos ricos despediu de mãos vazias. Socorreu Israel, seu servo, lembrando-se de sua misericórdia, conforme prometera aos nossos pais, em favor de Abraão e de sua descendência, para sempre.`
  },

  // --- SANTOS E TEMAS ESPECÍFICOS ---
  santo_agostinho_providencia: {
    nome: 'Santo Agostinho - Providência',
    descricao: 'Súplica por sustento',
    imagem: '/img/santo_agostinho_providencia.png',
    content: `**Oração à Divina Providência (Inspirada em S. Agostinho)**\n\nÓ Divina Providência, eu me entrego inteiramente aos vossos desígnios. Vós, que vestis os lírios do campo e alimentais as aves do céu, olhai para as minhas necessidades e para as da minha família. Concedei-me, Senhor, a graça de confiar plenamente que nunca me faltará o necessário para uma vida digna. Providência Divina, providenciai!`
  },
  sao_jose_patrono: {
    nome: 'São José - Patrono',
    descricao: 'Protetor da Igreja',
    imagem: '/img/sao_jose_patrono.png',
    content: `**A vós, São José**\n\nA vós, São José, recorremos em nossa tribulação e, depois de ter implorado o auxílio de vossa santíssima Esposa, cheios de confiança solicitamos também o vosso patrocínio. Por esse laço sagrado de caridade que vos uniu à Virgem Imaculada Mãe de Deus, e pelo amor paternal que tivestes ao Menino Jesus, ardentemente suplicamos que lanceis um olhar benigno sobre a herança que Jesus Cristo conquistou com o seu sangue, e nos socorrais em nossas necessidades com o vosso auxílio e poder. Amém.`
  },
  sao_jose_operario: {
    nome: 'São José Operário',
    descricao: 'Para o trabalho',
    imagem: '/img/sao_jose_operario.png',
    content: `**Oração a São José Operário**\n\nGlorioso São José, modelo de todos os que se dedicam ao trabalho, obtende-me a graça de trabalhar com espírito de penitência para expiação de meus numerosos pecados; de trabalhar com consciência, pondo o culto do dever acima de minhas inclinações; de trabalhar com recolhimento e alegria, olhando como uma honra empregar e desenvolver pelo trabalho os dons recebidos de Deus.`
  },
  santa_edwiges: {
    nome: 'Santa Edwiges',
    descricao: 'Protetora dos endividados',
    imagem: '/img/santa_edwiges.png',
    content: `**Oração a Santa Edwiges**\n\nÓ Santa Edwiges, vós que na terra fostes o amparo dos pobres, a ajuda dos desvalidos e o socorro dos endividados, rogai por mim que preciso de vossa ajuda neste momento difícil. Vós que amastes a Cruz de Jesus, ajudai-me a carregar a minha cruz das dívidas e da falta de recursos. Alcançai-me de Deus a sabedoria para administrar meus bens e a graça de honrar meus compromissos. Santa Edwiges, rogai por nós!`
  },
  sao_pio_confianca: {
    nome: 'São Pio - Confiança',
    descricao: 'Fique em Paz',
    imagem: '/img/sao_pio_confianca.png',
    content: `**Fique em Paz (São Pio de Pietrelcina)**\n\nFique em paz, pois a misericórdia de Deus é infinitamente maior que a tua miséria. Não te deixes perturbar por nada, mas confia sempre na bondade divina. O passado à misericórdia de Deus, o presente à fidelidade de Deus e o futuro à providência de Deus.`
  },
  sao_caetano: {
    nome: 'São Caetano',
    descricao: 'Pai da Providência',
    content: `**Oração a São Caetano**\n\nGlorioso São Caetano, Pai da Providência, não permitais que falte o pão em nossa casa, nem o trabalho para o nosso sustento. Vós que confiastes plenamente na bondade de Deus, ensinai-nos a buscar em primeiro lugar o Reino dos Céus e a sua justiça, na certeza de que tudo o mais nos será dado por acréscimo.`
  },
  sao_jose_carteira: {
    nome: 'São José - Carteira de Trabalho',
    descricao: 'Bênção dos documentos',
    content: `**Oração sobre os documentos**\n\nSenhor Deus, pela intercessão de São José Operário, abençoai esta carteira de trabalho (ou currículo/documentos) que apresento diante de vós. Que ela seja instrumento para eu conseguir um emprego digno, onde eu possa servir com honestidade e levar o sustento para minha família. Abri as portas que estão fechadas e tocai o coração dos empregadores.`
  },
  novena_espirito: {
    nome: 'Novena do Espírito Santo',
    descricao: 'Veni Creator',
    content: `**Veni Creator Spiritus**\n\nVinde, Espírito Criador, visitai as almas dos vossos fiéis e enchei de graça celestial os corações que criastes. Sois chamado o Paráclito, o dom de Deus Altíssimo, fonte viva, fogo, caridade e unção espiritual. Concedei-nos os vossos sete dons e dai-nos a vossa graça.`
  },
  vinde_espirito: {
    nome: 'Espírito Santo',
    descricao: 'Vinde Espírito Santo',
    content: `**Vinde Espírito Santo**\n\nVinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do Vosso Amor. Enviai o Vosso Espírito e tudo será criado, e renovareis a face da terra.\n\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor Nosso. Amém.`
  },
  nsra_desterro: {
    nome: 'N. Sra. do Desterro',
    descricao: 'Fugir das dívidas',
    content: `**Oração a N. Sra. do Desterro**\n\nÓ Bem-aventurada Virgem Maria, mãe de Nosso Senhor Jesus Cristo, Rainha do Céu e da Terra, advogada dos pecadores, auxiliadora dos cristãos, desterradora das indigências, das calamidades, dos inimigos corporais e espirituais. Desterrai de mim as dívidas, a escassez e a aflição.`
  },
  sao_miguel_libertacao: {
    nome: 'São Miguel - Libertação',
    descricao: 'Quebra de amarras',
    content: `**Oração de Libertação com São Miguel**\n\nSão Miguel Arcanjo, defendei-nos neste combate. Cobri-nos com vosso escudo contra os embustes e ciladas do demônio. Em nome de Jesus, eu renuncio a todo espírito de miséria e ganância. Clamo a proteção do Céu sobre minhas finanças e minha família.`
  },
  santo_inacio_entrega: {
    nome: 'Santo Inácio - Entrega',
    descricao: 'Suscipe',
    content: `**Tomai, Senhor, e Recebei (Santo Inácio)**\n\nTomai, Senhor, e recebei toda a minha liberdade, a minha memória, o meu entendimento e toda a minha vontade, tudo o que tenho e possuo. Vós me destes; a vós, Senhor, o restituo. Tudo é vosso; disponde de tudo, segundo a vossa vontade. Dai-me somente o vosso amor e a vossa graça; isso me basta.`
  },
  santa_margarida_confianca: {
    nome: 'Santa Margarida - Confiança',
    descricao: 'Sagrado Coração',
    content: `**Ato de Confiança (Santa Margarida Maria)**\n\nÓ Coração de Amor, eu ponho toda a minha confiança em vós, pois tudo temo de minha fraqueza, mas tudo espero de vossa bondade. Sede o único objeto do meu amor, o protetor de minha vida, a segurança da minha salvação, o remédio de minha fragilidade e inconstância, a reparação de todas as faltas de minha vida e o meu asilo seguro na hora da minha morte.`
  },
  sao_geraldo: {
    nome: 'São Geraldo Majella',
    descricao: 'Protetor das Grávidas',
    content: `**Oração a São Geraldo**\n\nÓ São Geraldo, padroeiro das mães e das gestantes, olhai para mim. Vós que sempre servistes a Deus e ao próximo com amor, intercedei junto ao Senhor para que me conceda a graça da maternidade. Protegei a vida que desejo que cresça em meu ventre de todo perigo.`
  },
  sao_domingos_savio: {
    nome: 'São Domingos Sávio',
    descricao: 'Santo dos berços',
    content: `**Oração a São Domingos Sávio**\n\nQuerido São Domingos Sávio, que morrestes tão jovem mas com tanta santidade, sede o protetor das crianças desde o ventre materno. Colocai vosso "escapulário" de proteção sobre as mães que desejam engravidar e protegei os bebês em gestação.`
  },
  santa_ana_suplica: {
    nome: 'Santa Ana - Súplica',
    descricao: 'Mãe de Samuel',
    content: `**Súplica por um Filho (Inspirada em Ana)**\n\nSenhor Deus dos Exércitos, assim como escutastes a aflição de vossa serva Ana, olhai também para mim. Meu coração deseja ardentemente um filho para Vos amar e servir. Se vos dignardes me conceder esta graça, eu consagrarei esta criança a Vós por todos os dias de sua vida. Amém.`
  },
  santa_ana_joaquim: {
    nome: 'S. Ana e S. Joaquim',
    descricao: 'Avós de Jesus',
    content: `**Oração aos Avós de Jesus**\n\nÓ gloriosos Santos Ana e Joaquim, que tivestes a alegria de gerar a Mãe de Deus, intercedei por nós que desejamos o dom da paternidade e maternidade. Alcançai-nos de Deus a graça de conceber uma vida nova para Sua glória.`
  },
  nsra_bom_parto: {
    nome: 'N. Sra. do Bom Parto',
    descricao: 'Proteção na gestação',
    content: `**Oração a N. Sra do Bom Parto**\n\nÓ Maria Santíssima, vós que por obra do Espírito Santo gerastes o Salvador, olhai para mim nesta gestação. Alcançai-me a graça de um parto feliz e de um filho saudável.`
  },
  novena_santana: {
    nome: 'Novena a Santa Ana',
    descricao: 'Intercessão',
    content: `**Oração da Novena**\n\nÓ gloriosa Santa Ana, cheia de bondade para com os que vos invocam e de compaixão com os que sofrem. Carregada com o peso das minhas preocupações, lanço-me aos vossos pés e suplico humildemente que tomeis o meu pedido sob vossa proteção.`
  },
  consagracao_auxiliadora: {
    nome: 'N. Sra. Auxiliadora - Consagração',
    descricao: 'Entrega dos filhos',
    content: `**Consagração a Nossa Senhora**\n\nÓ Senhora minha, ó minha Mãe, eu me ofereço todo a vós e, em prova da minha devoção para convosco, vos consagro neste dia meus olhos, meus ouvidos, minha boca, meu coração e inteiramente todo o meu ser. E porque assim sou vosso, ó incomparável Mãe, guardai-me e defendei-me como coisa e propriedade vossa.`
  },
  santa_isabel_visitacao: {
    nome: 'Santa Isabel - Visitação',
    descricao: 'Alegria da vida',
    content: `**Oração inspirada na Visitação**\n\nSanta Isabel, que ficastes cheia do Espírito Santo ao receber a visita da Mãe de Deus e sentistes vosso filho estremecer de alegria no ventre, alcançai-nos a graça de acolher Maria em nossa casa e de celebrar o dom da vida em nossa família.`
  },
  consagracao_ventre: {
    nome: 'Consagração do Ventre',
    descricao: 'À Virgem Maria',
    content: `**Consagração do Ventre a Maria**\n\nÓ Maria, Aurora da Vida, consagro a vós o meu ventre, santuário da vida. Que ele seja um lugar de paz, saúde e bênção para o filho que Deus me confiar. Afastai todo mal e perigo.`
  },
  sagrada_familia: {
    nome: 'Sagrada Família',
    descricao: 'Oração do Lar',
    content: `**Oração da Sagrada Família**\n\nJesus, Maria e José, em vós contemplamos o esplendor do verdadeiro amor. Sagrada Família de Nazaré, tornai também as nossas famílias lugares de comunhão e cenáculos de oração. Jesus, Maria e José, a nossa família vossa é!`
  },
  tobias_sara: {
    nome: 'Tobias e Sara',
    descricao: 'Oração dos Esposos',
    content: `**Oração dos Esposos (Inspirada em Tobias)**\n\nBendito sejais, Deus de nossos pais! Vós criastes Adão e lhe destas Eva como auxílio. Senhor, Vós sabeis que não é por desejo egoísta que estou neste casamento, mas com reta intenção de formar uma família santa. Tende misericórdia de nós, Senhor, e fazei que cheguemos juntos e felizes à velhice. Amém.`
  },
  santa_cecilia: {
    nome: 'Santa Cecília',
    descricao: 'Pureza de coração',
    content: `**Oração a Santa Cecília**\n\nÓ gloriosa Santa Cecília, que soubestes guardar vosso coração puro para Deus, ajudai-me a encontrar um amor verdadeiro e santo, que me aproxime do Senhor e não me afaste Nele.`
  },
  santo_antonio: {
    nome: 'Santo Antônio',
    descricao: 'Intercessor',
    content: `**Oração a Santo Antônio**\n\nMeu grande amigo Santo Antônio, tu que és o protetor dos namorados, olha para mim, para a minha vida, para os meus anseios. Defendei-me dos perigos, afastai de mim os fracassos, as desilusões, os desencantos. Fazei que eu seja realista, confiante, digno(a) e alegre.`
  },
  sao_rafael: {
    nome: 'São Rafael Arcanjo',
    descricao: 'Guia dos encontros',
    content: `**São Rafael Arcanjo**\n\nSão Rafael, Arcanjo do Amor e da Cura, flecha de Amor de Deus, feri o nosso coração com um amor ardente e puro. Guiai-nos no encontro com a pessoa que Deus preparou para nós.`
  },
  sao_paulo_corintios: {
    nome: 'São Paulo - Hino ao Amor',
    descricao: '1 Coríntios 13',
    content: `**Hino ao Amor (Oração)**\n\nSenhor, ensinai-me a ter o verdadeiro Amor. Que o meu amor seja paciente e bondoso. Que eu não sinta inveja, não me orgulhe e não maltrate ninguém. Ajudai-me a tudo sofrer, tudo crer, tudo esperar e tudo suportar. Pois sei que profecias e línguas passarão, mas o Vosso Amor em mim jamais acabará. Amém.`
  },
  nsra_desatadora: {
    nome: 'N. Sra. Desatadora dos Nós',
    descricao: 'Nós Matrimoniais',
    content: `**Nossa Senhora Desatadora dos Nós**\n\nMãe do Belo Amor, olhai para o "nó" que sufoca meu casamento. Vós, que pelas vossas mãos desatastes os problemas que pareciam insolúveis, desatai agora os ressentimentos, as brigas e a frieza que ameaçam minha família. Eu confio em vós.`
  },
  jesus_perdao: {
    nome: 'Jesus - Perdão Conjugal',
    descricao: 'Curando feridas',
    content: `**Oração de Perdão**\n\nSenhor Jesus, eu hoje decido perdoar meu esposo(a) por todas as mágoas, palavras duras e atitudes que me feriram. Liberto-o(a) do meu julgamento e amargura, e peço a graça de recomeçarmos hoje, renovados pelo Vosso amor.`
  },
  oracao_esposos: {
    nome: 'Oração dos Esposos (Ritual)',
    descricao: 'União e fidelidade',
    content: `**Oração dos Esposos**\n\nSenhor, fazei de nosso lar um lugar de vosso amor. Que não haja injúria, porque vós nos dais a compreensão. Que não haja amargura, porque vós nos abençoais. Que não haja egoísmo, porque vós nos alentais. Que não haja rancor, porque vós nos dais o perdão. Que não haja abandono, porque vós estais conosco.`
  },
  sao_francisco: {
    nome: 'São Francisco de Assis',
    descricao: 'Instrumento de Paz',
    content: `**Oração de São Francisco**\n\nSenhor, fazei de mim um instrumento de vossa paz. Onde houver ódio, que eu leve o amor; Onde houver ofensa, que eu leve o perdão; Onde houver discórdia, que eu leve a união; Onde houver dúvida, que eu leve a fé; Onde houver erro, que eu leve a verdade; Onde houver desespero, que eu leve a esperança.`
  },
  terco_familia: {
    nome: 'Sagrada Família - Terço',
    descricao: 'Paz no lar',
    content: `**Terço pela Família**\n\nOferecemos este terço em honra da Sagrada Família, pedindo a paz, a união e a santificação do nosso lar.`
  },
  sao_jorge: {
    nome: 'São Jorge',
    descricao: 'Proteção Guerreira',
    content: `**Oração a São Jorge**\n\nEu andarei vestido e armado com as armas de São Jorge para que meus inimigos, tendo pés não me alcancem, tendo mãos não me peguem, tendo olhos não me vejam, e nem em pensamentos eles possam me fazer mal. Armas de fogo o meu corpo não alcançarão, facas e lanças se quebrem sem o meu corpo tocar, cordas e correntes se arrebentem sem o meu corpo amarrar.`
  },
  sangue_cristo: {
    nome: 'Jesus - Sangue Precioso',
    descricao: 'Proteção poderosa',
    content: `**Oração do Sangue de Cristo**\n\nSenhor Jesus, eu cubro a mim mesmo, minha família, minha casa e nosso trabalho com o Vosso Preciosíssimo Sangue. Que este sangue redentor seja uma barreira intransponível contra toda inveja, maldade e cilada do inimigo.`
  },
  sao_miguel: {
    nome: 'São Miguel Arcanjo',
    descricao: 'Defendei-nos',
    content: `**São Miguel Arcanjo**\n\nSão Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a satanás e aos outros espíritos malignos. Amém.`
  },
  sao_paulo_efesios: {
    nome: 'São Paulo - Armadura',
    descricao: 'Efésios 6',
    content: `**Oração da Armadura de Deus**\n\nEu me revisto hoje da Armadura de Deus para resistir às ciladas do inimigo. cinjo meus rins com a Verdade e visto a couraça da Justiça. Calço meus pés com a prontidão do Evangelho da paz. Embraço o escudo da Fé para apagar os dardos inflamados do Maligno. Tomo o capacete da Salvação e a espada do Espírito, que é a Palavra de Deus. Amém.`
  },
  sao_bento: {
    nome: 'São Bento',
    descricao: 'A Cruz Sagrada',
    content: `**Oração de São Bento (Medalha)**\n\nA Cruz Sagrada seja a minha luz, não seja o dragão o meu guia. Retira-te, satanás! Nunca me aconselhes coisas vãs. É mau o que tu me ofereces, bebe tu mesmo os teus venenos!`
  },
  anjo_guarda: {
    nome: 'Santo Anjo do Senhor',
    descricao: 'Protetor fiel',
    content: `**Santo Anjo do Senhor**\n\nSanto Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém.`
  },
  santo_agostinho: {
    nome: 'Santo Agostinho',
    descricao: 'Tarde te amei',
    content: `**Tarde te Amei**\n\nTarde te amei, ó Beleza tão antiga e tão nova, tarde te amei! Eis que estavas dentro, e eu fora... E era fora que eu te procurava. Estavas comigo e eu não estava contigo. Seguravam-me longe de ti as coisas que não existiriam se não existissem em ti. Chamaste, clamaste e rompeste a minha surdez. Brilhaste, resplandeceste e afugentaste a minha cegueira. Exalaste perfume e respirei, e suspiro por ti. Provei-te, e tenho fome e sede. Tocaste-me, e ardi por tua paz.`
  },
  filho_prodigo: {
    nome: 'Jesus - O Filho Pródigo',
    descricao: 'Reflexão de retorno',
    content: `**Oração do Retorno (O Filho Pródigo)**\n\nPai, pequei contra o Céu e contra Ti. Não sou mais digno de ser chamado teu filho, mas rogo-te: aceita-me de volta em Tua casa, nem que seja como o menor dos teus servos. Estou arrependido de ter desperdiçado minha vida longe de Ti. Acolhe-me em Teu abraço misericordioso novamente. Amém.`
  },
  sao_pedro_clemente: {
    nome: 'São Clemente - Contrição',
    descricao: 'Ato de Contrição',
    content: `**Ato de Contrição**\n\nMeu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois tão bom e amável. Prometo, com a vossa graça, nunca mais pecar. Meu Jesus, misericórdia!`
  },
  terco_misericordia: {
    nome: 'Santa Faustina - Terço',
    descricao: 'Divina Misericórdia',
    content: `**Terço da Divina Misericórdia**\n\n(No início) Pai Nosso, Ave Maria, Credo.\n\n(Nas contas grandes) Eterno Pai, eu Vos ofereço o Corpo e Sangue, Alma e Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro.\n\n(Nas contas pequenas) Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.\n\n(Ao final, 3x) Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro.`
  },
  santo_expedito: {
    nome: 'Santo Expedito',
    descricao: 'Causas Urgentes',
    content: `**Oração a Santo Expedito**\n\nMeu Santo Expedito das causas justas e urgentes, intercedei por mim junto a Nosso Senhor Jesus Cristo, socorrei-me nesta hora de aflição e desespero. Vós que sois o Santo dos Aflitos, Vós que sois o Santo das Causas Urgentes, protegei-me, ajudai-me, dai-me força, coragem e serenidade. Atendei ao meu pedido (fazer o pedido).`
  },
  santa_filomena: {
    nome: 'Santa Filomena',
    descricao: 'Taumaturga',
    content: `**Oração a Santa Filomena**\n\nÓ gloriosa Virgem e Mártir Santa Filomena, que, pelo vosso poder junto a Deus, sois chamada "Taumaturga do Século XIX", a vós recorro com confiança. Pedi a Jesus por mim a graça que tanto necessito. Olhai para mim em vossa glória, Santa Filomena, e consolai o meu coração.`
  },
  santa_rita: {
    nome: 'Santa Rita de Cássia',
    descricao: 'Causas Impossíveis',
    content: `**Oração a Santa Rita**\n\nÓ poderosa e gloriosa Santa Rita, chamada Santa das causas impossíveis, advogada dos casos desesperados, auxiliadora da última hora, refúgio e abrigo da dor... Rogai por nós! A vós eu recorro com confiança e amor.`
  },
  sao_judas_tadeu: {
    nome: 'São Judas Tadeu',
    descricao: 'Desesperados',
    content: `**Oração a São Judas Tadeu**\n\nSão Judas Tadeu, apóstolo escolhido por Cristo, eu vos saúdo e louvo pela fidelidade e amor com que cumpristes vossa missão. Vinde em meu socorro nesta grande necessidade. Eu prometo nunca me esquecer desta grande graça e sempre honrar-vos como meu patrono especial.`
  },
  santa_rita_novena: {
    nome: 'Santa Rita - Novena',
    descricao: 'Súplica',
    content: `**Súplica a Santa Rita**\n\nÓ Santa Rita, não me deixeis no meu desespero. Vós que sois amada por Deus, falai por mim. Ajudai a minha pobre fé e alcançai-me a graça que vos peço.`
  },
  santa_dymphna: {
    nome: 'Santa Dymphna',
    descricao: 'Ansiedade e Mente',
    content: `**Oração a Santa Dymphna**\n\nÓ Santa Dymphna, padroeira dos que sofrem de transtornos mentais, nervosos e emocionais. Intercedei por mim que me sinto angustiado, ansioso e deprimido. Alcançai-me a paz de espírito e a serenidade dos pensamentos. Eu confio em vossa proteção.`
  },
  nsra_dores: {
    nome: 'N. Sra. das Dores',
    descricao: 'Consolo na aflição',
    content: `**Oração a N. Sra. das Dores**\n\nÓ Mãe das Dores, pela angústia que sofrestes ao pé da Cruz, consolai o meu coração aflito. Vós que compreendeis toda dor humana, enxugai as minhas lágrimas e dai-me a força de unir o meu sofrimento ao de Vosso Filho Jesus.`
  },
  santa_faustina_jaculatoria: {
    nome: 'Santa Faustina - Jaculatória',
    descricao: 'Jesus eu confio',
    content: `**Jesus, eu confio em Vós**\n\nÓ Sangue e Água que jorrastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós!`
  },
  sao_carlos_abandono: {
    nome: 'São Carlos de Foucauld',
    descricao: 'Oração do Abandono',
    content: `**Oração do Abandono**\n\nMeu Pai, eu me abandono a Ti. Faz de mim o que Te aprouver. O que quer que faças de mim, eu Te agradeço. Estou pronto para tudo, aceito tudo. Contanto que a Tua vontade se faça em mim e em todas as tuas criaturas, não desejo mais nada, meu Deus.`
  },
  sao_camilo: {
    nome: 'São Camilo de Lellis',
    descricao: 'Patrono dos enfermos',
    content: `**Oração a São Camilo**\n\nÓ São Camilo, que dedicastes vossa vida a servir Jesus na pessoa dos enfermos, olhai com compaixão para mim que sofro com esta enfermidade. Alcançai-me a cura e a paciência.`
  },
  sao_peregrino: {
    nome: 'São Peregrino',
    descricao: 'Males graves',
    content: `**Oração a São Peregrino**\n\nÓ São Peregrino, a quem chamam "O Taumaturgo", intercedei por nós que sofremos de (câncer ou doença grave). Vós que recebestes a cura milagrosa de Jesus Crucificado, pedi a Ele que estenda Sua mão sobre nós e nos cure.`
  },
  isaias_servo: {
    nome: 'Profeta Isaías - Cura',
    descricao: 'Isaías 53',
    content: `**Oração de Cura (Servo Sofredor)**\n\nSenhor Jesus, Vós tomastes sobre Vós as nossas enfermidades e as nossas dores levastes sobre Vós. Fostes ferido por nossas transgressões para que, por Vossas chagas, nós fôssemos sarados. Eu clamo agora o poder do Vosso sangue redentor sobre esta doença. Curai-me, Senhor! Amém.`
  },
  nsra_saude: {
    nome: 'N. Sra. da Saúde',
    descricao: 'Intercessão',
    content: `**Oração a N. Sra. da Saúde**\n\nVirgem Puríssima, que sois a Saúde dos Enfermos, o Refúgio dos Pecadores, a Consoladora dos Aflitos e a Despenseira de todas as graças, na minha fraqueza e no meu desânimo apelo para os tesouros da vossa divina misericórdia.`
  },
  santa_teresa_avila: {
    nome: 'Santa Teresa D\'Ávila',
    descricao: 'Nada te turbe',
    content: `**Nada te turbe**\n\nNada te perturbe, nada te espante, tudo passa. Deus não muda. A paciência tudo alcança. Quem a Deus tem, nada lhe falta. Só Deus basta.`
  },
  isaias_nao_temas: {
    nome: 'Profeta Isaías - Coragem',
    descricao: 'Isaías 41',
    content: `**Oração Contra o Medo (Isaías 41)**\n\nSenhor, Vós dissestes: "Não temas, porque eu sou contigo". Por isso eu rezo: Afastai de mim todo o pavor e angústia. Eu creio que sois o meu Deus vitorioso. Fortalecei-me, ajudai-me e sustentai-me com a vossa destra fiel. Eu não temerei mal algum, pois o Senhor está ao meu lado.`
  },
  sao_tomas: {
    nome: 'São Tomás de Aquino',
    descricao: 'Oração do Estudante',
    content: `**Oração de São Tomás**\n\nCriador Inefável... Iluminai o meu entendimento, dissipai as trevas do pecado e da ignorância. Dai-me agudeza para entender, capacidade para reter, método e facilidade para aprender, sutileza para interpretar e graça copiosa para falar.`
  },
  salomao_sabedoria: {
    nome: 'Rei Salomão - Sabedoria',
    descricao: 'Livro da Sabedoria',
    content: `**Oração Pedindo Sabedoria (Salomão)**\n\nDeus de meus pais e Senhor de misericórdia, dai-me a Sabedoria que partilha do vosso trono. Não me rejeiteis, pois sou vosso servo e filho de vossa serva. Enviai-a dos céus santos para que ela esteja comigo e trabalhe comigo, e eu saiba o que é agradável diante de Vós. Amém.`
  },
  salmo_119: {
    nome: 'Salmo 119',
    descricao: 'Lâmpada para os pés',
    content: `**Salmo 119 (118)**\n\n105. Vossa palavra é uma lâmpada para os meus pés, e uma luz para o meu caminho. Eu jurei, e o cumprirei, que hei de guardar os teus justos juízos.`
  },
  santa_monica: {
    nome: 'Santa Mônica',
    descricao: 'Matriarca da Oração',
    content: `**Oração de Santa Mônica**\n\nExemplar mãe de Santo Agostinho, vós que perseverastes na oração pela conversão de vosso filho, ajudai-me a não desanimar. Intercedei pelos meus filhos para que encontrem o caminho de Deus.`
  },
  jeremias_lamentacoes: {
    nome: 'Profeta Jeremias',
    descricao: 'Clamor pelos filhos',
    content: `**Clamor de uma Mãe (Inspirada em Jeremias)**\n\nSenhor, eu me levanto no princípio da vigília e derramo meu coração como água diante de Vossa face. Levanto minhas mãos a Vós pela vida de meus filhos. Protegei-os, Senhor, de todo mal e perigo. Não permitais que se percam, mas guardai-os em Vossos caminhos.`
  },
  santa_marta: {
    nome: 'Santa Marta',
    descricao: 'Acolhimento',
    content: `**Oração a Santa Marta**\n\nSanta Marta, que acolhestes Jesus em vossa casa e servistes com dedicação, abençoai o nosso lar. Que ele seja um lugar de acolhida, paz e serviço a Deus.`
  },
  nsra_loreto: {
    nome: 'N. Sra. de Loreto',
    descricao: 'Padroeira dos lares',
    content: `**Oração à N. Sra. de Loreto**\n\nÓ Maria, Rainha do Lar, que em Nazaré vivestes a santidade da vida cotidiana, abençoai a nossa casa. Que em nosso lar reine a paz e o amor da Sagrada Família.`
  },
  sao_bento_casa: {
    nome: 'São Bento - Lar',
    descricao: 'Visita Senhor',
    content: `**Visita, Senhor, esta casa**\n\nVisita, Senhor, esta casa e afasta dela todas as ciladas do inimigo. Que nela habitem os teus santos anjos para nos guardar na paz, e que a tua bênção esteja sempre conosco.`
  },
  santa_teresinha: {
    nome: 'Santa Teresinha',
    descricao: 'Pequena Via',
    content: `**Oração da Pequena Via**\n\nSanta Teresinha, vós dissestes: "Quero passar o meu céu fazendo o bem na terra". Ajudai-me a trilhar a vossa Pequena Via de confiança e amor. Ensinai-me a fazer as pequenas coisas do dia a dia com grande amor, oferecendo tudo a Jesus pela salvação das almas. Que eu seja o Amor no coração da minha casa e da Igreja.`
  },
  sao_joao_cruz: {
    nome: 'São João da Cruz',
    descricao: 'Místico',
    content: `**Oração da Chama de Amor**\n\nÓ Espírito Santo, Chama de Amor Viva, purificai a minha alma de tudo o que não é de Deus. Queimai as minhas imperfeições e uni-me inteiramente ao Vosso amor, para que eu não viva mais para mim mesmo, mas para Aquele que morreu e ressuscitou por mim.`
  },
  sao_jeronimo_lectio: {
    nome: 'São Jerônimo',
    descricao: 'Lectio Divina',
    content: `**Oração antes de ler a Bíblia**\n\nSenhor, abri o meu entendimento para que eu compreenda as Vossas Escrituras. Que a Vossa Palavra não seja apenas texto, mas encontro convosco. Falai, Senhor, que vosso servo escuta. Que eu possa ler, meditar, rezar e contemplar a Vossa vontade em minha vida. Amém.`
  },
  sao_paulo_combate: {
    nome: 'São Paulo - O Combate',
    descricao: '2 Timóteo 4',
    content: `**Oração do Bom Combate**\n\nSenhor, dai-me forças para combater o bom combate até o fim. Que eu possa completar minha carreira e guardar a fé, mesmo diante das dificuldades. Eu confio que a coroa da justiça me está guardada e que o Senhor, justo juiz, ma dará naquele dia. Amém.`
  },
  jo_paciencia: {
    nome: 'Jó - Paciência',
    descricao: 'Fé na provação',
    content: `**Oração de Aceitação (Jó)**\n\nSenhor, nu saí do ventre de minha mãe e nu tornarei para lá. Tudo o que tenho veio de Vós. O Senhor deu, o Senhor tomou: bendito seja o nome do Senhor. Aceito esta provação com paciência, confiando que Vossa mão poderosa me sustentará e, no tempo certo, me restaurará.`
  },
  sao_filipe: {
    nome: 'São Filipe Néri',
    descricao: 'Santo da Alegria',
    content: `**Oração de São Filipe Néri**\n\nSenhor, não tireis as vossas mãos da minha cabeça, senão Filipe vos trairá! Ó meu Jesus, eu quero amar-vos! Dai-me a graça da verdadeira alegria, aquela que nasce da paz de consciência.`
  },
  profeta_daniel: {
    nome: 'Profeta Daniel',
    descricao: 'Cânticos',
    content: `**Cântico de Louvor (Profeta Daniel)**\n\nBendito sejais, Senhor, Deus de nossos pais, digno de louvor e de eterna glória! Obras do Senhor, bendizei o Senhor! Anjos do Senhor, bendizei o Senhor! Céus, bendizei o Senhor! Eu também me uno a toda a criação para Vos louvar e exaltar para sempre, pois grande é a Vossa misericórdia.`
  },
  te_deum: {
    nome: 'Santo Ambrósio',
    descricao: 'Te Deum',
    content: `**Te Deum (A Vós, ó Deus)**\n\nA vós, ó Deus, louvamos; a vós, Senhor, confessamos! A vós, ó Pai eterno, a terra inteira venera!`
  },
  jesus_getsemani: {
    nome: 'Jesus - Getsêmani',
    descricao: 'Fiat',
    content: `**Oração de Entrega (Getsêmani)**\n\nPai, se queres, afasta de mim este cálice de sofrimento. Contudo, Senhor, não se faça a minha vontade, mas a Tua. Eu me submeto aos teus planos, mesmo que eu não os compreenda agora. Dá-me força para beber do cálice que tens para mim.`
  },
  terco_mariano: {
    nome: 'São Domingos - Terço',
    descricao: 'Santo Rosário',
    content: `**O Santo Rosário**\n\nSenhor Jesus, ao meditarmos os mistérios da Vossa vida, morte e ressurreição através do Santo Rosário, pedimos a graça de imitar o que eles contêm e alcançar o que eles prometem. Virgem Santíssima, protegei a nossa família e conduzi-nos sempre ao Vosso Filho. Amém.`
  },
  multiplicacao: {
    nome: 'Jesus - Milagre da Multiplicação',
    descricao: 'Confiança na fartura',
    imagem: '/img/multiplicacao.png',
    content: `**Oração inspirada no Milagre dos Pães**\n\nSenhor Jesus, que multiplicastes cinco pães e dois peixes para alimentar a multidão faminta, olhai para a minha necessidade. Abençoai o pouco que tenho para que nunca falte o necessário em minha mesa e para que eu possa também partilhar com quem precisa. Eu confio na vossa generosidade infinita.`
  },
  // --- SALMOS ---
  salmo_23: {
    nome: 'Salmo 23',
    descricao: 'O Bom Pastor',
    imagem: '/img/salmo_23.png',
    content: `**Salmo 23 (22)**\n\n1. O Senhor é o meu pastor, nada me faltará.\n2. Em verdes prados ele me faz repousar. Conduz-me junto às águas refrescantes,\n3. Restaura as forças de minha alma. Pelos caminhos retos ele me leva, por amor do seu nome.\n4. Ainda que eu atravesse o vale escuro, nada temerei, pois estais comigo. Vosso bordão e vosso báculo são o meu amparo.\n5. Preparais para mim a mesa à vista de meus inimigos. Derramais o óleo em minha cabeça e meu cálice transborda.\n6. A felicidade e a graça vão acompanhar-me todos os dias da minha vida e vou habitar na casa do Senhor por longos dias.`
  },
  salmo_144: {
    nome: 'Salmo 144',
    descricao: 'Prosperidade',
    imagem: '/img/salmo_144.png',
    content: `**Salmo 144 (143)**\n\n1. Bendito seja o Senhor, meu rochedo, que adestra minhas mãos para o combate, e meus dedos para a guerra.\n2. Meu protetor e meu rei, meu baluarte e libertador, meu escudo e meu refúgio, que os povos me sujeita.\n3. Senhor, que é o homem para dele cuidardes, o ser humano para que vos ocupeis com ele?\n12. Que nossos filhos sejam como plantas crescidas na sua juventude; nossas filhas, como colunas angulares, esculpidas como as de um palácio.\n13. Nossos celeiros estejam cheios, transbordando de toda espécie de provisões; nossos rebanhos se multipliquem aos milhares pelos nossos campos.\n15. Feliz o povo a quem assim sucede! Feliz o povo cujo Deus é o Senhor!`
  },
  salmo_34: {
    nome: 'Salmo 34',
    descricao: 'Bendirei',
    imagem: '/img/salmo_34.png',
    content: `**Salmo 34 (33)**\n\n2. Bendirei o Senhor em todo o tempo, seu louvor estará sempre na minha boca.\n3. Minha alma se gloria no Senhor; que os humildes me ouçam e se alegrem.\n5. Busquei o Senhor e ele me respondeu, e de todos os meus temores me livrou.\n6. Olhai para ele e sereis iluminados, e os vossos rostos não ficarão envergonhados.\n8. O anjo do Senhor acampa em redor dos que o temem, e os salva.\n9. Provai e vede como o Senhor é bom; feliz o homem que nele se refugia.`
  },
  salmo_128: {
    nome: 'Salmo 128',
    descricao: 'Trabalho',
    content: `**Salmo 128 (127)**\n\n1. Feliz és tu que temes o Senhor e trilhas os seus caminhos.\n2. Do trabalho de tuas mãos hás de viver, serás feliz, tudo irá bem!\n3. A tua esposa será como a videira fecunda no interior da tua casa; teus filhos, como rebentos de oliveira ao redor da tua mesa.\n4. Assim será abençoado o homem que teme o Senhor.\n5. De Sião te abençoe o Senhor! Vejas a prosperidade de Jerusalém todos os dias da tua vida.\n6. Vejas os filhos de teus filhos. Paz sobre Israel!`
  },
  salmo_91: {
    nome: 'Salmo 91',
    descricao: 'Refúgio',
    content: `**Salmo 91 (90)**\n\n1. Tu que habitas sob a proteção do Altíssimo, que moras à sombra do Onipotente,\n2. dize ao Senhor: "Sois meu refúgio e minha cidadela, meu Deus, em que eu confio".\n3. É ele quem te livrará do laço do caçador, e da peste perniciosa.\n4. Ele te cobrirá com suas plumas, sob suas asas acharás refúgio. Sua fidelidade te será um escudo de proteção.\n7. Cairão mil ao teu lado e dez mil à tua direita; tu não serás atingido.\n11. Porque aos seus anjos ele mandou que te guardem em todos os teus caminhos.\n12. Eles te sustentarão em suas mãos, para que não tropeces em alguma pedra.`
  },
  salmo_37: {
    nome: 'Salmo 37',
    descricao: 'Confiança',
    content: `**Salmo 37 (36)**\n\n1. Não te irrites por causa dos maus, nem invejes os que praticam a iniquidade.\n3. Confia no Senhor e faze o bem; habitarás na terra e viverás tranquilo.\n4. Põe tuas delícias no Senhor, e ele satisfará os desejos do teu coração.\n5. Entrega o teu caminho ao Senhor, confia nele, e ele agirá.\n7. Descansa no Senhor e espera nele; não te irrites com aquele que prospera em seu caminho.\n11. Os mansos herdarão a terra, e se deleitarão na abundância de paz.`
  },
  salmo_112: {
    nome: 'Salmo 112',
    descricao: 'Justo',
    content: `**Salmo 112 (111)**\n\n1. Feliz o homem que teme o Senhor e põe o seu prazer em observar os seus mandamentos.\n2. Sua descendência será poderosa na terra; a posteridade dos homens retos será abençoada.\n3. Na sua casa haverá prosperidade e riqueza, e a sua justiça permanecerá para sempre.\n4. Para os retos ele se levanta nas trevas como luz; é clemente, misericordioso e justo.\n7. Não temerá más notícias; seu coração está firme, confiante no Senhor.`
  },
  salmo_113: {
    nome: 'Salmo 113',
    descricao: 'Louvai',
    content: `**Salmo 113 (112)**\n\n1. Louvai, servos do Senhor, louvai o nome do Senhor.\n2. Bendito seja o nome do Senhor, desde agora e para sempre.\n3. Do nascer do sol ao seu ocaso, louvado seja o nome do Senhor.\n7. Ele levanta do pó o indigente e tira do lixo o pobre,\n9. Ele faz a estéril habitar em casa, mãe alegre de filhos.`
  },
  salmo_127: {
    nome: 'Salmo 127',
    descricao: 'Casa',
    content: `**Salmo 127 (126)**\n\n1. Se o Senhor não edificar a casa, em vão trabalham os construtores. Se o Senhor não guardar a cidade, em vão vigia a sentinela.\n2. Inútil levantar-vos antes da aurora, e retardar o vosso descanso, vós que comeis o pão do suor; a seus amados ele o dá enquanto dormem.\n3. Eis a herança do Senhor: os filhos; sua recompensa, o fruto do ventre.`
  },
  salmo_139: {
    nome: 'Salmo 139',
    descricao: 'Deus me vê',
    content: `**Salmo 139 (138)**\n\n1. Senhor, vós me perscrutais e me conheceis. Sabeis quando me sento e quando me levanto.\n13. Pois vós formastes o meu interior, vós me tecestes no seio de minha mãe.\n14. Eu vos louvo porque me fizestes de modo assombroso. Maravilhosas são as vossas obras.\n23. Sondai-me, ó Deus, e conhecei o meu coração; provai-me e conhecei os meus pensamentos.`
  },
  // --- O SANTO TERÇO ---
  // --- O SANTO TERÇO ---
  'conteudo_terco_completo': {
    nome: 'Como Rezar o Santo Terço',
    descricao: 'Guia Completo e Mistérios',
    imagem: '/img/modulo_terco.png',
    content: `![Santo Terço](/img/modulo_terco.png)\n\n**O Santo Terço**\n\n**Como Rezar:**\n1. Inicie com o Sinal da Cruz.\n2. Reze o Credo, um Pai Nosso e três Ave Marias.\n3. Medite o Mistério correspondente ao dia.\n4. Reze um Pai Nosso e dez Ave Marias para cada mistério, terminando com o Glória.\n5. Ao final dos cinco mistérios, reze a Salve Rainha.\n\n**Mistérios Gozosos (Segunda e Sábado)**\n1. A Anunciação do Anjo a Maria: O Arcanjo Gabriel anuncia que Maria será a Mãe do Salvador.\n2. A Visitação de Maria a Isabel: Maria visita sua prima Isabel, levando Jesus em seu ventre.\n3. O Nascimento de Jesus: Jesus nasce pobre em Belém para nos enriquecer com sua divindade.\n4. A Apresentação no Templo: Maria e José oferecem Jesus ao Pai eterno.\n5. A Perda e o Encontro de Jesus: Jesus é encontrado entre os doutores da Lei.\n\n**Mistérios Luminosos (Quinta-feira)**\n1. O Batismo no Jordão: Jesus é batizado por João e o céu se abre.\n2. As Bodas de Caná: Jesus transforma água em vinho a pedido de Maria.\n3. O Anúncio do Reino de Deus: Jesus prega o amor e o perdão.\n4. A Transfiguração: Jesus revela sua glória aos apóstolos no Tabor.\n5. A Instituição da Eucaristia: Jesus se nos dá em Corpo e Sangue na Última Ceia.\n\n**Mistérios Dolorosos (Terça e Sexta)**\n1. A Agonia no Horto: Jesus sua sangue prevendo seus sofrimentos.\n2. A Flagelação: Jesus é açoitado cruelmente atado à coluna.\n3. A Coroação de Espinhos: Jesus é coroado rei de escárnio.\n4. O Carregamento da Cruz: Jesus carrega o madeiro até o Calvário.\n5. A Crucificação e Morte: Jesus morre na cruz por amor a nós.\n\n**Mistérios Gloriosos (Quarta e Domingo)**\n1. A Ressurreição: Jesus vence a morte e sai vitorioso do sepulcro.\n2. A Ascensão: Jesus sobe aos céus à direita do Pai.\n3. A Vinda do Espírito Santo: O Espírito de Amor desce sobre os apóstolos.\n4. A Assunção de Maria: Maria é levada aos céus em corpo e alma.\n5. A Coroação de Maria: Maria é coroada Rainha do Céu e da Terra.\n\n**Salve Rainha**\nSalve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria.`
  },
  'misterios_gozosos': {
    nome: 'Mistérios Gozosos (Seg/Sáb)',
    descricao: 'Alegria',
    content: `**Mistérios Gozosos (Segunda e Sábado)**\n1. A Anunciação do Anjo a Maria.\n2. A Visitação de Maria a Isabel.\n3. O Nascimento de Jesus.\n4. A Apresentação no Templo.\n5. A Perda e o Encontro de Jesus no Templo.`
  },
  'misterios_luminosos': {
    nome: 'Mistérios Luminosos (Qui)',
    descricao: 'Luz',
    content: `**Mistérios Luminosos (Quinta-feira)**\n1. O Batismo no Jordão.\n2. As Bodas de Caná.\n3. O Anúncio do Reino de Deus.\n4. A Transfiguração.\n5. A Instituição da Eucaristia.`
  },
  'misterios_dolorosos': {
    nome: 'Mistérios Dolorosos (Ter/Sex)',
    descricao: 'Dor',
    content: `**Mistérios Dolorosos (Terça e Sexta)**\n1. A Agonia no Horto das Oliveiras.\n2. A Flagelação de Jesus.\n3. A Coroação de Espinhos.\n4. O Carregamento da Cruz.\n5. A Crucificação e Morte.`
  },
  'misterios_gloriosos': {
    nome: 'Mistérios Gloriosos (Qua/Dom)',
    descricao: 'Glória',
    content: `**Mistérios Gloriosos (Quarta e Domingo)**\n1. A Ressurreição de Jesus.\n2. A Ascensão aos Céus.\n3. A Vinda do Espírito Santo.\n4. A Assunção de Maria.\n5. A Coroação de Maria como Rainha.`
  },
  'salve_rainha': {
    nome: 'Salve Rainha',
    descricao: 'Oração Final',
    content: `**Salve Rainha**\n\nSalve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria.`
  },

  salmo_121: {
    nome: 'Salmo 121',
    descricao: 'Socorro',
    content: `**Salmo 121 (120)**\n\n1. Levanto meus olhos para os montes: de onde me virá o auxílio?\n2. O meu auxílio vem do Senhor, que fez o céu e a terra.\n3. Não deixará teu pé vacilar; aquele que te guarda não dorme.\n5. O Senhor é o teu guarda, o Senhor é a tua sombra à tua direita.\n8. O Senhor guardará a tua saída e a tua entrada, desde agora e para sempre.`
  },
  salmo_85: {
    nome: 'Salmo 85',
    descricao: 'Paz',
    content: `**Salmo 85 (84)**\n\n2. Senhor, fostes propício à vossa terra, trouxestes de volta os cativos de Jacó.\n8. Mostrai-nos, Senhor, a vossa misericórdia, e dai-nos a vossa salvação.\n11. A misericórdia e a verdade se encontraram, a justiça e a paz se beijaram.\n13. O Senhor dará o que é bom, e a nossa terra dará o seu fruto.`
  },
  salmo_147: {
    nome: 'Salmo 147',
    descricao: 'Cura',
    content: `**Salmo 147 (146)**\n\n1. Louvai o Senhor, porque é bom cantar louvores ao nosso Deus; porque é agradável o louvor.\n3. Ele cura os corações atribulados e enfaixa as suas feridas.\n4. Conta o número das estrelas, chama-as a todas pelos seus nomes.\n11. O Senhor se agrada dos que o temem, dos que esperam na sua misericórdia.`
  },
  salmo_27: {
    nome: 'Salmo 27',
    descricao: 'Luz',
    content: `**Salmo 27 (26)**\n\n1. O Senhor é minha luz e salvação; de quem terei medo? O Senhor é a proteção da minha vida; perante quem eu tremerei?\n3. Ainda que um exército se acampe contra mim, meu coração não temerá; ainda que a guerra estoure contra mim, mesmo assim estarei confiante.\n4. Uma só coisa peço ao Senhor, e a buscarei: habitar na casa do Senhor todos os dias da minha vida.\n8. Meu coração diz a vosso respeito: "Buscai a minha face!" A vossa face, Senhor, eu busco.\n14. Espera no Senhor e sê forte! Fortifique-se o teu coração e espera no Senhor!`
  },
  salmo_32: {
    nome: 'Salmo 32',
    descricao: 'Perdão',
    content: `**Salmo 32 (31)**\n\n1. Feliz aquele cuja iniquidade foi perdoada, cujo pecado foi coberto.\n2. Feliz o homem a quem o Senhor não imputa culpa, e em cujo espírito não há engano.\n3. Enquanto me calei, meus ossos se consumiam, e eu gemia todo o dia.\n5. Confessei-vos o meu pecado e não escondi a minha culpa. Disse: "Confessarei ao Senhor a minha iniquidade", e vós perdoastes a pena do meu pecado.\n7. Vós sois o meu refúgio, vós me preservais da angústia, e me cercais de cânticos de livramento.`
  },
  salmo_51: {
    nome: 'Salmo 51',
    descricao: 'Miserere',
    content: `**Salmo 51 (50)**\n\n3. Tende piedade de mim, ó Deus, segundo a vossa misericórdia. Na imensidão de vossa bondade, apagai a minha mancha.\n4. Lavai-me totalmente da minha iniquidade e purificai-me do meu pecado.\n12. Criai em mim um coração puro, ó Deus, e renovai no meu interior um espírito reto.\n14. Devolvei-me a alegria de vossa salvação e sustentai-me com um espírito generoso.\n19. Meu sacrifício, ó Deus, é um espírito contrito; um coração contrito e humilhado, ó Deus, que não desprezareis.`
  },
  salmo_46: {
    nome: 'Salmo 46',
    descricao: 'Fortaleza',
    content: `**Salmo 46 (45)**\n\n2. Deus é nosso refúgio e fortaleza, socorro sempre encontrado nos perigos.\n3. Por isso, não temeremos, ainda que a terra trema e os montes se desmoronem no meio do mar.\n5. Os braços de um rio alegram a cidade de Deus, o santuário do Altíssimo.\n11. Aquietai-vos e sabei que eu sou Deus, exaltado entre as nações, exaltado na terra.\n12. O Senhor dos exércitos está conosco, o Deus de Jacó é a nossa cidadela.`
  },
  salmo_70: {
    nome: 'Salmo 70',
    descricao: 'Socorro',
    content: `**Salmo 70 (69)**\n\n2. Ó Deus, vinde em meu auxílio. Senhor, apressai-vos em me socorrer!\n3. Fiquem envergonhados e confusos os que querem tirar-me a vida. Voltem atrás e sejam cobertos de vergonha os que se comprazem com o meu mal.\n5. Exultem e alegrem-se em vós todos os que vos buscam; e digam sem cessar: "Glória a Deus!" os que amam a vossa salvação.\n6. Eu, porém, sou pobre e necessitado; ó Deus, vinde logo em meu auxílio. Vós sois o meu amparo e libertador; Senhor, não tardeis!`
  },
  salmo_73: {
    nome: 'Salmo 73',
    descricao: 'Rocha',
    content: `**Salmo 73 (72)**\n\n23. Todavia, estou sempre convosco, vós me segurais pela mão direita.\n24. Vós me guiais com o vosso conselho e por fim me recebereis na glória.\n25. A quem tenho eu no céu senão a vós? E na terra nada mais desejo além de vós.\n26. Ainda que minha carne e meu coração desfaleçam, Deus é a rocha do meu coração e a minha herança para sempre.`
  },
  salmo_41: {
    nome: 'Salmo 41',
    descricao: 'Enfermo',
    content: `**Salmo 41 (40)**\n\n2. Feliz quem cuida do fraco e do indigente; no dia da desgraça o Senhor o libertará.\n3. O Senhor o guardará e lhe conservará a vida, e o fará feliz na terra, e não o entregará à vontade de seus inimigos.\n4. O Senhor o assistirá no leito de dores; vós lhe restituireis a saúde na sua doença.\n5. Eu disse: Senhor, tende piedade de mim. Curai a minha alma, pois pequei contra vós.`
  },
  salmo_103: {
    nome: 'Salmo 103',
    descricao: 'Louvor',
    content: `**Salmo 103 (102)**\n\n1. Bendize, ó minha alma, ao Senhor, e tudo o que existe em mim bendiga o seu santo nome.\n2. Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.\n3. É ele quem perdoa todas as tuas culpas, quem cura todas as tuas doenças.\n4. É ele quem salva tua vida do fosso, e te coroa de bondade e misericórdia.\n8. O Senhor é clemente e compassivo, paciente e cheio de bondade.`
  },
  salmo_56: {
    nome: 'Salmo 56',
    descricao: 'Confiar',
    content: `**Salmo 56 (55)**\n\n2. Tem misericórdia de mim, ó Deus, porque o homem me persegue; o dia todo guerreando me oprime.\n4. Em qualquer tempo em que eu temer, confiarei em ti.\n5. Em Deus, cuja palavra eu louvo, em Deus ponho a minha confiança e não temerei. Que me poderá fazer a carne?\n9. Tu contas as minhas vagabundações; põe as minhas lágrimas no teu odre. Não estão elas no teu livro?\n14. Pois tu livraste a minha alma da morte, como também os meus pés de tropeçarem, para que eu ande diante de Deus na luz dos viventes.`
  },
  salmo_25: {
    nome: 'Salmo 25',
    descricao: 'Caminhos',
    content: `**Salmo 25 (24)**\n\n1. A vós, Senhor, elevo a minha alma. Meu Deus, em vós confio; não seja eu envergonhado, nem exultem sobre mim os meus inimigos.\n4. Mostrai-me, Senhor, os vossos caminhos, e ensinai-me as vossas veredas.\n5. Guiai-me na vossa verdade e ensinai-me, pois vós sois o Deus da minha salvação; em vós espero todo o dia.\n10. Todas as veredas do Senhor são misericórdia e verdade para aqueles que guardam a sua aliança e os seus testemunhos.`
  },
  salmo_15: {
    nome: 'Salmo 15',
    descricao: 'Santuário',
    content: `**Salmo 15 (14)**\n\n1. Senhor, quem habitará no vosso santuário? Quem poderá morar na vossa santa montanha?\n2. Aquele que caminha sem mancha e pratica a justiça; que pensa a verdade no seu coração e não calunia com a sua língua.\n3. Que não faz mal ao seu próximo, nem lança opróbrio contra o seu vizinho.\n5. Aquele que assim procede jamais será abalado.`
  },
  salmo_42: {
    nome: 'Salmo 42',
    descricao: 'Sede',
    content: `**Salmo 42 (41)**\n\n2. Assim como a corça suspira pelas águas correntes, suspira a minha alma por vós, ó Deus.\n3. A minha alma tem sede de Deus, do Deus vivo; quando irei contemplar a face de Deus?\n4. Minhas lágrimas têm sido o meu alimento de dia e de noite, enquanto me dizem todos os dias: "Onde está o teu Deus?"\n6. Por que estás abatida, ó minha alma, e por que te perturbas dentro de mim? Espera em Deus, pois ainda o louvarei, a ele, meu auxílio e meu Deus.`
  },
  salmo_63: {
    nome: 'Salmo 63',
    descricao: 'Buscar',
    content: `**Salmo 63 (62)**\n\n2. Ó Deus, vós sois o meu Deus, com ardor vos procuro; a minha alma tem sede de vós, minha carne vos deseja com ansiedade, como terra seca, sedenta e sem água.\n4. Porque vossa graça é melhor que a vida; os meus lábios vos louvarão.\n5. Assim eu vos bendirei enquanto viver; em vosso nome levantarei as minhas mãos.\n8. Porque vós sois o meu auxílio, e à sombra das vossas asas eu canto de alegria.`
  },
  salmo_40: {
    nome: 'Salmo 40',
    descricao: 'Esperar',
    content: `**Salmo 40 (39)**\n\n2. Esperei com paciência no Senhor, e ele se inclinou para mim, e ouviu o meu clamor.\n3. Tirou-me de um lago horrível, de um charco de lodo, pôs os meus pés sobre uma rocha, firmou os meus passos.\n4. E pôs um novo cântico na minha boca, um hino ao nosso Deus. Muitos o verão, e temerão, e confiarão no Senhor.\n9. Tenho prazer em fazer a vossa vontade, ó meu Deus, e a vossa lei está no meio do meu coração.`
  },
  salmo_31: {
    nome: 'Salmo 31',
    descricao: 'Refúgio',
    content: `**Salmo 31 (30)**\n\n2. Em vós, Senhor, me refugio; nunca seja eu confundido; livrai-me pela vossa justiça.\n3. Inclinai para mim os vossos ouvidos, apressai-vos em me livrar. Sede para mim uma rocha de refúgio, uma casa de defesa para me salvar.\n6. Nas vossas mãos encomendo o meu espírito; vós me redimistes, Senhor Deus da verdade.\n15. Eu, porém, confio em vós, Senhor; eu digo: "Vós sois o meu Deus".`
  },
  salmo_98: {
    nome: 'Salmo 98',
    descricao: 'Cantai',
    content: `**Salmo 98 (97)**\n\n1. Cantai ao Senhor um cântico novo, porque ele fez maravilhas; a sua destra e o seu braço santo lhe alcançaram a vitória.\n2. O Senhor fez notória a sua salvação, manifestou a sua justiça perante os olhos das nações.\n4. Exultai no Senhor, toda a terra; exclamai, e alegrai-vos de prazer, e cantai louvores.\n9. Diante do Senhor, que vem julgar a terra; com justiça julgará o mundo, e o povo com equidade.`
  },
  salmo_100: {
    nome: 'Salmo 100',
    descricao: 'Aclamai',
    content: `**Salmo 100 (99)**\n\n1. Aclamai ao Senhor, terra inteira! Servi ao Senhor com alegria, ide a ele cantando jubilosos!\n3. Sabei que o Senhor é Deus: ele nos fez, e a ele pertencemos; somos o seu povo e as ovelhas do seu rebanho.\n4. Entrai por suas portas com ações de graças, e em seus átrios com hinos de louvor; dai-lhe graças e bendizei o seu nome.\n5. Porque o Senhor é bom, e eterna é a sua misericórdia; a sua fidelidade estende-se de geração em geração.`
  },
  salmo_118: {
    nome: 'Salmo 118',
    descricao: 'Misericórdia',
    content: `**Salmo 118 (117)**\n\n1. Dai graças ao Senhor porque ele é bom, porque eterna é a sua misericórdia.\n5. Na minha angústia clamei ao Senhor; e o Senhor me ouviu e me pôs em um lugar largo.\n6. O Senhor está comigo; não temerei o que me pode fazer o homem.\n24. Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.`
  },
  salmo_143: {
    nome: 'Salmo 143',
    descricao: 'Ouvir',
    content: `**Salmo 143 (142)**\n\n1. Senhor, escutai a minha prece, dai ouvidos à minha súplica, pela vossa fidelidade; respondei-me pela vossa justiça.\n8. Fazei-me ouvir a vossa graça pela manhã, pois em vós confio; mostrai-me o caminho por onde devo andar, porque a vós elevo a minha alma.\n10. Ensinai-me a fazer a vossa vontade, pois vós sois o meu Deus; guie-me o vosso bom Espírito por terra plana.`
  }
};

// ==========================================
// ESTRUTURA DOS MÓDULOS (REFERÊNCIAS ATUALIZADAS)
// ==========================================
const MODULES_STRUCTURE = [
  {
    nome: '1. Prosperidade financeira e providência',
    description: 'Confiança na provisão divina.',
    imagem: '/img/santo_agostinho_providencia.png',
    items: ['guia_prosperidade', 'santo_agostinho_providencia', 'sao_jose_patrono', 'santa_edwiges', 'salmo_23', 'salmo_144', 'multiplicacao', 'salmo_34', 'sao_jose_operario', 'sao_pio_confianca', 'gloria']
  },
  {
    nome: '2. Conseguir um emprego ou abrir caminhos',
    description: 'Súplica por trabalho digno.',
    imagem: '/img/sao_jose_operario.png',
    items: ['guia_emprego', 'sao_jose_operario', 'sao_caetano', 'salmo_128', 'sao_jose_carteira', 'salmo_91', 'vinde_espirito', 'novena_espirito', 'credo', 'salmo_37', 'terco_mariano']
  },
  {
    nome: '3. Pagar dívidas e organizar a vida financeira',
    description: 'Sabedoria e libertação.',
    imagem: '/img/santa_edwiges.png',
    items: ['guia_dividas', 'nsra_desterro', 'sao_miguel_libertacao', 'salmo_112', 'salmo_23', 'santo_inacio_entrega', 'sao_jose_patrono', 'santa_margarida_confianca', 'salmo_37', 'gloria', 'terco_mariano']
  },
  {
    nome: '4. Conseguir filhos / fertilidade',
    description: 'O dom da vida.',
    imagem: '/img/background_catholic.png',
    items: ['guia_fertilidade', 'sao_geraldo', 'sao_domingos_savio', 'santa_ana_suplica', 'santa_ana_joaquim', 'nsra_bom_parto', 'salmo_113', 'salmo_127', 'novena_santana', 'consagracao_auxiliadora', 'terco_mariano']
  },
  {
    nome: '5. Gravidez protegida',
    description: 'Amparo gestacional.',
    imagem: '/img/background_catholic.png',
    items: ['guia_gravidez', 'santa_isabel_visitacao', 'consagracao_ventre', 'nsra_bom_parto', 'salmo_139', 'anjo_guarda', 'salmo_121', 'sagrada_familia', 'ave_maria', 'magnificat', 'gloria']
  },
  {
    nome: '6. Casamento e encontrar um bom parceiro(a)',
    description: 'Vocação matrimonial.',
    imagem: '/img/sao_jose_patrono.png',
    items: ['guia_casamento_enc', 'tobias_sara', 'santa_cecilia', 'santo_antonio', 'sao_rafael', 'sao_paulo_corintios', 'consagracao_auxiliadora', 'salmo_37', 'terco_mariano', 'sao_pio_confianca', 'pai_nosso']
  },
  {
    nome: '7. Restaurar um casamento',
    description: 'Reconciliação e paz.',
    imagem: '/img/background_catholic.png',
    items: ['guia_casamento_rest', 'nsra_desatadora', 'jesus_perdao', 'oracao_esposos', 'sagrada_familia', 'sao_francisco', 'terco_familia', 'salmo_128', 'salmo_85', 'salmo_147', 'gloria']
  },
  {
    nome: '8. Proteção contra inveja e maldade',
    description: 'Defesa espiritual.',
    imagem: '/img/background_catholic.png',
    items: ['guia_inveja', 'sao_jorge', 'sangue_cristo', 'sao_miguel', 'sao_paulo_efesios', 'salmo_27', 'sao_bento', 'salmo_91', 'anjo_guarda', 'credo', 'terco_mariano']
  },
  {
    nome: '9. Quebrar ciclos ruins / recomeçar',
    description: 'Vida nova em Cristo.',
    imagem: '/img/background_catholic.png',
    items: ['guia_recomecar', 'santo_agostinho', 'filho_prodigo', 'salmo_32', 'salmo_51', 'sao_pedro_clemente', 'terco_misericordia', 'santo_inacio_entrega', 'magnificat', 'credo', 'gloria']
  },
  {
    nome: '10. Milagres e causas difíceis',
    description: 'Intercessão poderosa.',
    imagem: '/img/santa_edwiges.png',
    items: ['guia_causas', 'santo_expedito', 'santa_filomena', 'salmo_70', 'santa_rita', 'sao_judas_tadeu', 'santa_rita_novena', 'terco_misericordia', 'salmo_46', 'credo', 'terco_mariano']
  },
  {
    nome: '11. Cura emocional profunda',
    description: 'Paz interior.',
    imagem: '/img/background_catholic.png',
    items: ['guia_cura_emo', 'santa_dymphna', 'nsra_dores', 'salmo_34', 'salmo_147', 'santa_faustina_jaculatoria', 'sao_carlos_abandono', 'salmo_73', 'terco_mariano', 'magnificat', 'ave_maria']
  },
  {
    nome: '12. Cura física e consolo',
    description: 'Saúde do corpo.',
    imagem: '/img/background_catholic.png',
    items: ['guia_cura_fisica', 'sao_camilo', 'sao_peregrino', 'isaias_servo', 'nsra_saude', 'salmo_41', 'salmo_103', 'sao_rafael', 'terco_misericordia', 'terco_mariano', 'gloria']
  },
  {
    nome: '13. Libertação do medo',
    description: 'Coragem e fé.',
    imagem: '/img/background_catholic.png',
    items: ['guia_medo', 'santa_teresa_avila', 'isaias_nao_temas', 'salmo_23', 'salmo_27', 'salmo_56', 'sao_miguel', 'anjo_guarda', 'credo', 'terco_mariano', 'sao_pio_confianca']
  },
  {
    nome: '14. Discernir decisões importantes',
    description: 'Sabedoria do Espírito.',
    imagem: '/img/background_catholic.png',
    items: ['guia_decisoes', 'sao_tomas', 'salomao_sabedoria', 'salmo_119', 'vinde_espirito', 'sao_jeronimo_lectio', 'salmo_25', 'magnificat', 'credo', 'terco_mariano', 'gloria']
  },
  {
    nome: '15. Proteção dos filhos',
    description: 'Bênção sobre a família.',
    imagem: '/img/background_catholic.png',
    items: ['guia_filhos', 'santa_monica', 'jeremias_lamentacoes', 'anjo_guarda', 'consagracao_auxiliadora', 'salmo_127', 'salmo_121', 'sagrada_familia', 'salmo_91', 'terco_mariano', 'gloria']
  },
  {
    nome: '16. Blindar o lar',
    description: 'Paz doméstica.',
    imagem: '/img/sao_jose_patrono.png',
    items: ['guia_lar', 'santa_marta', 'nsra_loreto', 'salmo_15', 'sao_bento_casa', 'sao_jose_patrono', 'salmo_127', 'salmo_91', 'anjo_guarda', 'magnificat', 'terco_mariano']
  },
  {
    nome: '17. Crescimento espiritual acelerado',
    description: 'Fervor na fé.',
    imagem: '/img/background_catholic.png',
    items: ['guia_espiritual', 'santa_teresinha', 'sao_joao_cruz', 'salmo_42', 'sao_jeronimo_lectio', 'vinde_espirito', 'salmo_63', 'credo', 'terco_mariano', 'magnificat', 'gloria']
  },
  {
    nome: '18. Perseverança em tempos difíceis',
    description: 'Firmeza e esperança.',
    imagem: '/img/sao_pio_confianca.png',
    items: ['guia_perseveranca', 'sao_paulo_combate', 'jo_paciencia', 'salmo_40', 'salmo_46', 'salmo_31', 'sao_pio_confianca', 'magnificat', 'terco_mariano', 'ave_maria', 'gloria']
  },
  {
    nome: '19. Alegria e gratidão',
    description: 'Louvor a Deus.',
    imagem: '/img/gloria.png',
    items: ['guia_alegria', 'sao_filipe', 'salmo_98', 'profeta_daniel', 'te_deum', 'salmo_100', 'salmo_118', 'magnificat', 'sao_francisco', 'terco_mariano', 'gloria']
  },
  {
    nome: '20. Entregar totalmente a vida a Deus',
    description: 'Santidade total.',
    imagem: '/img/background_catholic.png',
    items: ['guia_entrega', 'santo_inacio_entrega', 'santa_margarida_confianca', 'sao_carlos_abandono', 'jesus_getsemani', 'consagracao_auxiliadora', 'salmo_143', 'magnificat', 'credo', 'terco_mariano', 'pai_nosso']
  },
  {
    nome: '🎁 O Santo Terço (Bônus)',
    description: 'Guia Completo de Oração.',
    imagem: '/img/terco_2222.png',
    items: ['conteudo_terco_completo']
  }
];

// ==========================================
// FUNÇÃO MAIN
// ==========================================
async function main() {
  console.log('Iniciando o seed REMODELADO (v8 - FULL TEXT SALMOS) ...');

  console.log('--- DEBUG START ---');
  const countBefore = await prisma.modulo.count();
  console.log(`Módulos antes do delete: ${countBefore}`);

  console.log('Limpando aulas e módulos antigos...');
  await prisma.progresso.deleteMany({});
  await prisma.aula.deleteMany({});
  await prisma.modulo.deleteMany({});

  for (let i = 0; i < MODULES_STRUCTURE.length; i++) {
    const modData = MODULES_STRUCTURE[i];

    // 1. Detectar se existe um Guia (item começando com 'guia_')
    const guideKey = modData.items.find(k => k.startsWith('guia_'));
    const guideData = guideKey ? PRAYERS[guideKey] : null;

    // 2. Montar a descrição (Descrição original) e o Guia (novo campo)
    // O Guia vai para o campo 'guide' que criamos no schema, não interfere na description (capa).
    const guideContent = guideData ? guideData.content : null;

    // 3. Filtrar os itens para remover o guia da lista de aulas (abas)
    const lessonItems = modData.items.filter(k => !k.startsWith('guia_'));

    // Cria o Módulo
    console.log(`Criando Módulo ${i + 1}: ${modData.nome} | Imagem: ${modData.imagem}`);

    const modulo = await prisma.modulo.create({
      data: {
        nome: modData.nome,
        description: modData.description, // Volta ao original (curto)
        guide: guideContent,              // Novo campo oculto do card
        ordem: i + 1,
        imagem: (i < 20) ? `/img/modules/mod_${i + 1}.png?v=${Date.now()}` : `${modData.imagem}?v=${Date.now()}`,
      },
    });

    console.log(`Módulo criado: ${modulo.nome}`);

    // Cria as Aulas (Orações)
    const items = lessonItems;

    for (let j = 0; j < items.length; j++) {
      const key = items[j];
      let prayerData = PRAYERS[key];

      if (!prayerData) {
        console.warn(`⚠️ ERRO: Oração '${key}' não definida. Criando fallback automático.`);
        prayerData = {
          nome: key.replace(/_/g, ' ').toUpperCase(),
          descricao: 'Oração',
          content: `**${key}**\n\n(Texto em atualização)`
        };
      }

      await prisma.aula.create({
        data: {
          nome: prayerData.nome,
          descricao: prayerData.descricao,
          content: prayerData.content,
          videoUrl: '/img/background.png',
          imagem: (i === 0) ? (prayerData.imagem || modData.imagem) : modData.imagem, // Mod 1: específico. Outros: Usa a capa do PRÓPRIO módulo.
          isImage: true,
          ordem: j + 1,
          moduloId: modulo.id,
        },
      });
    }
  }


  // ==========================================
  // 4. MÓDULO DE MÚSICA (BÔNUS) - INTEGRAÇÃO DIRETA
  // ==========================================
  console.log('🎸 Processando Módulo de Músicas...');
  const MUSIC_BASE_DIR = path.join(__dirname, '../uploads/musicas');

  // NO RENDER (PRODUÇÃO), A PASTA NÃO EXISTE (POIS ESTÁ NO GITIGNORE)
  // ENTÃO PULAMOS ESSA ETAPA, POIS O BANCO JÁ DEVE ESTAR POPULADO COM AS URLs DO R2.
  if (fs.existsSync(MUSIC_BASE_DIR)) {
    const entries = fs.readdirSync(MUSIC_BASE_DIR, { withFileTypes: true });
    const artistFolders = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    // Criar ou Atualizar Módulo de Música
    const SINGLE_MODULE_NAME = '🎁 Músicas Católicas (Acervo) (Bônus)';
    let musicModule = await prisma.modulo.findFirst({ where: { nome: SINGLE_MODULE_NAME } });

    if (musicModule) {
      await prisma.modulo.update({
        where: { id: musicModule.id },
        data: { ordem: 99, imagem: `/img/modulo_musica.png?v=${Date.now()}` }
      });
    } else {
      musicModule = await prisma.modulo.create({
        data: {
          nome: SINGLE_MODULE_NAME,
          description: 'Super coleção de músicas separadas por artista.',
          ordem: 99,
          imagem: `/img/modulo_musica.png?v=${Date.now()}` // Nova capa personalizada
        }
      });
    }

    // Limpar aulas antigas desse módulo para evitar duplicatas
    await prisma.aula.deleteMany({ where: { moduloId: musicModule.id } });

    let musicOrder = 1;

    for (const artistName of artistFolders) {
      const artistPath = path.join(MUSIC_BASE_DIR, artistName);

      // Buscar Capa do Artista
      let artistImage = '/img/background_catholic.png';
      const artistFiles = fs.readdirSync(artistPath);
      const coverFile = artistFiles.find(f => f.toLowerCase().match(/^cover\.|^folder\.|^fanart\.|^album\.|^art\./) && (f.endsWith('.jpg') || f.endsWith('.png')));

      if (coverFile) {
        artistImage = `/uploads/musicas/${artistName}/${coverFile}?v=${Date.now()}`;
      }

      // Listar Músicas Recursivamente
      const songs = [];
      const scanDir = (dir) => {
        const list = fs.readdirSync(dir, { withFileTypes: true });
        list.forEach(item => {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            scanDir(fullPath);
          } else if (item.isFile() && (item.name.endsWith('.mp3') || item.name.endsWith('.wav') || item.name.endsWith('.m4a'))) {
            const uploadsDir = path.join(__dirname, '../uploads');
            const relative = path.relative(uploadsDir, fullPath).replace(/\\/g, '/');

            // LÓGICA R2 vs LOCAL
            let url = '';
            const R2_URL = process.env.R2_PUBLIC_URL; // Ex: https://pub-xxxx.r2.dev

            if (R2_URL) {
              // R2: bucket/musicas/Artista/Album/musica.mp3
              // relative já é "musicas/Artista/Album/musica.mp3" (se musicas tiver dentro de uploads)
              // No seed_music.js que usamos, 'dir' já é 'uploads/musicas'.
              // relative: "Ziza Fernandes/Album/file.mp3"
              // Bucket path: "musicas/Ziza Fernandes/Album/file.mp3"
              const cleanRelative = relative.startsWith('musicas/') ? relative : `musicas/${relative}`;
              // Remover barras duplicadas se houver
              const finalPath = cleanRelative.replace('//', '/');
              url = `${R2_URL}/${finalPath}`;
            } else {
              // Local
              url = `/uploads/${relative}`;
            }

            // Fallback encode para garantir
            url = url.replace(/ /g, '%20');

            songs.push({ name: item.name.replace(/\.[^/.]+$/, "").replace(/^\d+\s*[-_.]?\s*/, ""), url: url });
          }
        });
      };
      scanDir(artistPath);

      // Criar Aulas
      for (const song of songs) {
        await prisma.aula.create({
          data: {
            nome: song.name,
            descricao: artistName,
            content: `**${song.name}**\n\n*Artista: ${artistName}*`,
            videoUrl: song.url,
            imagem: artistImage,
            isImage: false,
            ordem: musicOrder++,
            moduloId: musicModule.id
          }
        });
      }
    }
    console.log(`✅ Módulo de Música Criado com ${musicOrder - 1} faixas.`);
  } else {
    console.log('⚠️ Pasta de músicas não encontrada, pulando módulo de música.');
  }

  console.log('✅ SEED COMPLETO! O banco de dados está 100% atualizado com o Itinerário Quaresmal.');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar os seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

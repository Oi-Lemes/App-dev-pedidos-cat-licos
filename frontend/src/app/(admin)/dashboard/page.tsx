// Caminho: frontend/src/app/(admin)/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { PixModal } from '@/components/PixModal'; // Importado corretamente
import { motion } from 'framer-motion';
import { IS_DEV_BYPASS } from '@/config/dev-bypass';

// --- COMPONENTE DE EFEITO DE ESCRITA (SVG CONTOUR + FILL) ---
const TypewriterTitle = ({ text, fontSize = '250px', viewBox = '0 0 1500 400', y = '70%', className = "p-4 mb-4" }: { text: string, fontSize?: string, viewBox?: string, y?: string, className?: string }) => {
  return (
    <div className={`relative flex justify-center items-center overflow-visible ${className}`}>
      <motion.svg
        viewBox={viewBox}
        className="w-full h-auto min-w-[300px] max-w-7xl"
        initial="hidden"
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        <motion.text
          x="50%"
          y={y} // Centralização vertical calibrada para Pinyon Script
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="#D4AF37" // Ouro Metálico (Mais sóbrio e elegante)
          strokeWidth="2" // Traço um pouco mais fino para a fonte script
          strokeDasharray="6000"
          fill="#D4AF37" // Preenchimento Ouro Metálico
          variants={{
            hidden: {
              strokeDashoffset: 6000,
              fillOpacity: 0,
              strokeOpacity: 0
            },
            visible: {
              strokeDashoffset: 0,
              strokeOpacity: 1,
              fillOpacity: 1,
              transition: {
                strokeDashoffset: { duration: 6.0, ease: "easeInOut" },
                strokeOpacity: { duration: 0.5 },
                fillOpacity: { duration: 2.0, delay: 5.5, ease: "easeIn" }
              }
            }
          }}
          style={{
            fontFamily: 'var(--font-pinyon-script)', // Alterado para Pinyon Script (Mais elegante/Cristão)
            fontSize: fontSize, // Fonte parametrizável
            filter: 'drop-shadow(0px 0px 12px rgba(0,0,0,0.9))' // Sombra intensa
          }}
          className="font-script tracking-wide"
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
};

// 1. Definir a interface PixData esperada pelo novo modal
interface PixData {
  pix_qr_code: string;
  amount_paid: number;
  expiration_date: string;
  hash: string;
}

// 2. Mapeamento dos Hashes de Produto (do seu server.js) e Preços
// Usei os preços baseados nos seus planos, ajuste se necessário.
// 2. Mapeamento dos Hashes de Produto (do seu server.js) e Preços
// frontend/src/app/(admin)/dashboard/page.tsx

// ... (imports) ...

// 2. Mapeamento dos Hashes de Produto ATUALIZADO
const PRODUCTS = {
  basic: {
    hash: '6sHmRXUM5C6uk4EL6GdI', // Oferta 10 - Básico
    amount: 2700,
    title: 'Plano Básico'
  },
  promo: {
    hash: 'n4Zq0zRqPvBqJkb2uSOm', // Oferta 17 - Premium (Desconto)
    amount: 2700,
    title: 'Plano Premium (Promo)'
  },
  premium: {
    hash: 'hAopaitnltSp5f909Vup', // Oferta 27 - Premium (Cheio)
    amount: 9700,
    title: 'Plano Premium'
  },
  ultra: {
    hash: 'tjxp0', // (Mantido)
    amount: 19700,
    title: 'Plano Ultra'
  },
  live: {
    hash: 'prod_cb02db3516be7ede',
    amount: 6700,
    title: 'Dra Maria Silva'
  },
  nina: {
    hash: 'prod_0d6f903b6855c714',
    amount: 2704,
    title: 'Acesso ao Chatbot Nina'
  },
  certificate: {
    hash: 'prod_0bc162e2175f527f',
    amount: 1490,
    title: 'Certificado'
  },
  wallet: {
    hash: 'prod_375f8ceb7a4cffcc',
    amount: 3639,
    title: 'Taxa de Emissão Digital'
  }
};

// ... (resto do componente DashboardPage) ...

// --- Componente ProgressCircle (Mantido) ---
const ProgressCircle = ({ percentage }: { percentage: number }) => {
  // ... (código do ProgressCircle inalterado) ...
  const radius = 30;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="absolute top-4 right-4 z-10">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          fill="rgba(0, 0, 0, 0.7)"
        />
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={(() => {
            const hue = Math.min((percentage / 100) * 120, 120); // 0 (Red) -> 120 (Green)
            return `hsl(${hue}, 80%, 45%)`;
          })()} // green-400 substituído pelo gradiente dinâmico
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-300"
          strokeLinecap="round" // Adicionado para melhor aparência
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-purple-500 font-bold text-xs">
        {percentage}%
      </span>
    </div>
  );
};


export default function DashboardPage() {
  const { user, loading: userLoading, refetchUser } = useUser();

  const [modulos, setModulos] = useState<any[]>([]);
  const [progressoModulos, setProgressoModulos] = useState<{ [key: number]: number }>({});
  const [aulasConcluidasIds, setAulasConcluidasIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3. Estados atualizados para o novo modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null); // Usando a nova interface
  const [isLoadingPix, setIsLoadingPix] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [productKeyToBuy, setProductKeyToBuy] = useState<keyof typeof PRODUCTS | null>(null); // Guarda a *chave* do produto

  // Lógica de Filtro de Pesquisa (Estado)
  const [searchTerm, setSearchTerm] = useState('');


  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      setLoading(true);
      setErrorMessage(null);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      console.log('🔍 DEBUG: Backend URL being used:', backendUrl); // LOG PARA DEBUG

      const [modulosRes, progressoModulosRes, progressoIdsRes] = await Promise.all([
        fetch(`${backendUrl}/modulos`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' }),
        fetch(`${backendUrl}/progresso-modulos`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' }),
        fetch(`${backendUrl}/progresso`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' })
      ]);
      if (!modulosRes.ok || !progressoModulosRes.ok || !progressoIdsRes.ok) throw new Error('Falha ao carregar dados.');
      const modulosData = await modulosRes.json();
      const progressoModulosData = await progressoModulosRes.json();
      const progressoIdsData = await progressoIdsRes.json();
      setModulos(modulosData);
      setProgressoModulos(progressoModulosData);
      setAulasConcluidasIds(progressoIdsData);
    } catch (error: any) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setErrorMessage(error.message || "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'aula_concluida' || event.key === 'quiz_state') { // Escuta mudanças no Quiz também
        fetchData();
        refetchUser();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchData, refetchUser]);

  // --- NOVO: LER PROGRESSO DO QUIZ DO LOCALSTORAGE ---

  useEffect(() => {
    const checkQuizProgress = () => {
      const savedState = localStorage.getItem('quiz_state');
      if (savedState) {
        try {
          const { currentIndex, gameFinished, score } = JSON.parse(savedState);

          // LÓGICA CORRIGIDA: Só é 100% se terminou E passou (score >= 9) OU se já tem score de aprovação solto.
          const passed = (typeof score === 'number' && score >= 9); // 60% de 15 é 9

          setProgressoModulos(prev => {
            const currentVal = prev[102] || 0;

            if (passed) {
              // Se passou, tem que ser 100%
              if (currentVal === 100) return prev; // Nada a mudar
              return { ...prev, 102: 100 };
            }

            if (gameFinished && !passed) {
              // Se terminou e NÃO passou, calcula a nota proporcional
              const finalPercent = Math.round(((score || 0) / 15) * 100);
              // Não rebaixa se já for 100 (ex: passou antes e resetou?)
              if (currentVal >= 100) return prev;
              if (currentVal === finalPercent) return prev;
              return { ...prev, 102: finalPercent };
            }

            // Se ainda está jogando (não finished), mostra progresso parcial
            if (typeof currentIndex === 'number') {
              const quizPercent = Math.round(((currentIndex + 1) / 15) * 100);
              if (currentVal >= 100) return prev; // Não mexe se já completou
              if (currentVal === quizPercent) return prev;
              return { ...prev, 102: quizPercent };
            }

            return prev;
          });

        } catch (e) { console.error(e); }
      }
    };

    checkQuizProgress(); // Roda ao montar
    const interval = setInterval(checkQuizProgress, 1000); // Polling para atualização real-time
    return () => clearInterval(interval);
  }, []);

  // 4. Função atualizada: REDIRECIONAR PARA GGCHECKOUT (Oferta 27)
  const handleOpenPixModal = async (productKey: keyof typeof PRODUCTS) => {
    // Lógica simplificada solicitada pelo usuário:
    // "Quando clico em algum módulo trancado... ela automaticamente vai para o checkout de 27"

    let targetHash = PRODUCTS.premium.hash; // Default: Paga o 27 (Premium)

    if (productKey === 'basic') {
      targetHash = PRODUCTS.basic.hash; // Oferta 10
    }
    // Se for 'premium', 'nina', 'live' ou qualquer outro trancado -> Premium (27)

    // Construção do Link GGCheckout
    // Formato CORRETO (v5): https://ggcheckout.com.br/checkout/v5/{HASH}
    const checkoutUrl = `https://ggcheckout.com.br/checkout/v5/${targetHash}`;

    console.log(`Redirecionando para: ${checkoutUrl}`);
    window.location.href = checkoutUrl;
  };

  // 5. Nova função de callback para o modal
  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    refetchUser(); // Atualiza os dados do usuário
    alert('Pagamento confirmado! O seu acesso foi libertado.');
    setProductKeyToBuy(null); // Limpa o estado
  };

  // 6. Efeito para verificar se o pagamento foi bem-sucedido (após fechar o modal)
  //   Este efeito agora apenas verifica se o user state mudou E se o modal fechou
  useEffect(() => {
    if (!user || isModalOpen || !productKeyToBuy) return; // Só verifica se o modal fechou E tinha um produto a ser comprado

    // Verifica se o acesso para o produto que estava a ser comprado foi libertado
    let productWasPurchased = false;
    switch (productKeyToBuy) {
      case 'premium': productWasPurchased = user.plan === 'premium' || user.plan === 'ultra'; break;
      case 'ultra': productWasPurchased = user.plan === 'ultra'; break;
      case 'live': productWasPurchased = user.hasLiveAccess; break;
      case 'nina': productWasPurchased = user.hasNinaAccess; break;
      case 'certificate': // O certificado E a carteira dão hasWalletAccess
      case 'wallet': productWasPurchased = user.hasWalletAccess; break;
    }

    if (productWasPurchased) {
      // Não precisa mais de alert aqui, o handlePaymentSuccess já fez isso
      setProductKeyToBuy(null); // Limpa o estado
    }
  }, [user, isModalOpen, productKeyToBuy]); // Depende do user, modal e produto

  // Resto do código de renderização...
  if (loading || userLoading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }
  if (errorMessage) {
    return (<div className="flex flex-col items-center justify-center h-full text-center text-red-400"><h2 className="text-2xl font-bold mb-4">Erro ao Carregar</h2><p>{errorMessage}</p><button onClick={fetchData} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tentar Novamente</button></div>);
  }

  // ORDENAÇÃO ROBUSTA: Garantir que os módulos principais estejam em ordem
  // Módulos do banco já vêm ordenados ou podemos ordenar pelo ID/Ordem

  const modulosPrincipais = Array.isArray(modulos)
    ? modulos.sort((a, b) => (a.ordem || a.id) - (b.ordem || b.id))
    : [];

  const totalAulasPrincipais = modulosPrincipais.reduce((acc, m) => acc + (m.aulas?.length || 0), 0);
  const aulasPrincipais = modulosPrincipais.flatMap((m: any) => m.aulas || []);
  const totalConcluidasPrincipais = aulasPrincipais.filter((a: any) => aulasConcluidasIds.includes(a.id)).length;
  const cursoConcluido = totalAulasPrincipais > 0 && totalConcluidasPrincipais >= totalAulasPrincipais;

  // Lógica de Filtro de Pesquisa
  // State movido para o topo

  const modulosFinais = modulosPrincipais.filter(modulo => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nomeModuloMatch = modulo.nome.toLowerCase().includes(term);
    const aulasMatch = modulo.aulas?.some((aula: any) => aula.nome.toLowerCase().includes(term));
    return nomeModuloMatch || aulasMatch;
  });


  return (
    <section className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-5xl mx-auto mb-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">

        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img_fundo_cruz.gif"
            alt="Fundo 365 Dias com Maria"
            fill
            className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
            priority
            unoptimized // Importante para GIFs
          />
          {/* Overlays para Contraste e Blend Natural */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-900/90"></div>
        </div>

        {/* Conteúdo (Z-Index Elevado) */}
        <div className="relative z-10 flex flex-col items-center py-10 md:py-14 px-4">

          {/* Títulos */}
          <div className="flex flex-col items-center justify-center -space-y-4 md:-space-y-12 mb-8 w-full max-w-[95vw] overflow-hidden">
            <div className="w-[90%] md:w-[60%]">
              <TypewriterTitle text="Bem vindo ao" fontSize="100px" viewBox="0 0 1500 300" y="80%" className="p-0 m-0 drop-shadow-2xl" />
            </div>
            <div className="w-full min-w-[300px]">
              <TypewriterTitle text="Manual Católico da Graça" fontSize="100px" viewBox="0 0 1500 400" y="70%" className="p-0 m-0 drop-shadow-2xl" />
            </div>
            {/* Subtítulo Adicionado */}
            <div className="mt-2 md:mt-8 px-4 text-center">
              <p className="font-serif italic text-lg md:text-3xl text-amber-200/90 tracking-wider drop-shadow-md">
                "Um caminho de fé e amor"
              </p>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="relative w-full max-w-xl mx-auto mt-4 group">
            <input
              type="text"
              placeholder="Busque por aulas ou temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-16 py-4 bg-gray-900/80 backdrop-blur-md border-2 border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all shadow-xl text-lg"
            />
            {/* Botão de Lupa (Decorativo ou Funcional) */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="p-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/20 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {modulosFinais.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-xl">Nenhum módulo encontrado para "{searchTerm}"</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modulosFinais.map((modulo) => {
            // Encontrar o índice no array JÁ ORDENADO de principais
            const indexPrincipal = modulosPrincipais.findIndex(mp => mp.id === modulo.id);
            const userPlan = user?.plan || 'basic';

            // Lógica de Bloqueio Linear: DESATIVADA - TODOS LIBERADOS
            // const progressoAnterior = indexPrincipal > 0 ? (progressoModulos[modulosPrincipais[indexPrincipal - 1].id] ?? 0) : 100;
            // let isLockedByProgress = indexPrincipal > 0 && progressoAnterior < 100;
            const isLockedByProgress = false; // FORÇADO: TODOS LIBERADOS

            // Estado de Conclusão do Próprio Módulo
            const progressPercentage = progressoModulos[modulo.id] ?? 0;
            const isCompleted = progressPercentage >= 100;

            // Lógica de Paywall: ATIVADA POR PLANO
            let isPaywalled = false;
            let lockMessage = "";
            let purchaseProductKey: keyof typeof PRODUCTS | null = null;

            // REGRA: Básico (1-10) | Premium (Tudo)
            // Extrair número do módulo do NOME (ex: "1. Prosperidade" -> 1)
            const moduloNumber = parseInt(modulo.nome.split('.')[0]);
            const isNumberedModule = !isNaN(moduloNumber);

            if (userPlan === 'basic') {
              // Se tiver número e for > 10, ou se NÃO tiver número (ex: Bônus), bloqueia.
              if ((isNumberedModule && moduloNumber > 10) || !isNumberedModule) {
                isPaywalled = true;
                lockMessage = "Disponível no Plano Premium";
                purchaseProductKey = 'premium';
              }
            }

            let destinationUrl = `/modulo/${modulo.id}`;
            // If module has exactly one lesson, link directly to it (skip list page)
            if (modulo.aulas && modulo.aulas.length === 1) {
              destinationUrl = `/modulo/${modulo.id}/aula/${modulo.aulas[0].id}`;
            }
            // Lógica de Imagem (Backend vs Placeholder)
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            let imageUrl = '/img/background_catholic.png'; // Fallback Padrão Católico

            if (modulo.imagem) {
              if (modulo.imagem.startsWith('/uploads')) {
                imageUrl = `${backendUrl}${modulo.imagem}`;
              } else if (modulo.imagem.startsWith('http')) {
                imageUrl = modulo.imagem;
              } else {
                imageUrl = modulo.imagem; // Caminho local (/img/...)
              }
            } else if ((modulo as any).capa) {
              imageUrl = (modulo as any).capa;
            }

            // Overrides Específicos
            // if (modulo.id === 102) imageUrl = '/img/modulo_quiz.png'; // REMOVIDO: Quiz não existe mais
            if (modulo.nome.toLowerCase().includes('certificado')) imageUrl = '/img/md7.jpg';
            if (modulo.nome.toLowerCase().includes('live')) imageUrl = '/img/dra_maria.jpg';
            // if (modulo.nome.toLowerCase().includes('carteira')) imageUrl = '/img/ABRATH.png'; // REMOVIDO: Carteira não existe mais

            // Santo Terço (Rosary)
            if (modulo.nome.toLowerCase().includes('terço')) {
              imageUrl = '/img/terco_2222.png'; // Hand holding rosary (User Preference)
            }

            // Música / Bônus (Music)
            if (modulo.nome.toLowerCase().includes('música') || (modulo.nome.toLowerCase().includes('bônus') && !modulo.nome.toLowerCase().includes('terço'))) {
              imageUrl = '/img/modulo_musica.png';
            }

            // Se for paywalled, sobrescreve qualquer logica de locked
            const isLocked = isLockedByProgress && !isPaywalled;

            const finalOnClick = (e: React.MouseEvent) => {
              if (isPaywalled && purchaseProductKey) {
                e.preventDefault();
                handleOpenPixModal(purchaseProductKey);
              } else if (isLocked) {
                e.preventDefault();
              }
            };

            // Classes Dinâmicas:
            const isSpecialModule = modulo.id >= 90;
            const shouldApplyGrayscale = isCompleted && modulo.id <= 6;

            const linkClassName = `group relative block rounded-lg overflow-hidden transition-all duration-500 transform 
            ${isPaywalled
                ? 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40 ring-4 ring-amber-500/20'
                : isLocked
                  ? 'cursor-not-allowed opacity-80'
                  : isCompleted
                    ? 'hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 opacity-90 hover:opacity-100 ring-2 ring-emerald-500/30'
                    : 'hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40' // Normal
              }`;

            return (
              <Link key={modulo.id} href={isLocked || isPaywalled ? '#' : destinationUrl} onClick={finalOnClick} className={linkClassName}>
                <div className="relative w-full h-80 border-4 border-[#C5A059] shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={modulo.nome}
                    className={`w-full h-full object-cover object-center transform scale-[1.5] group-hover:scale-[1.6] transition-transform duration-700 ease-in-out ${shouldApplyGrayscale ? 'grayscale-[0.8] group-hover:grayscale-0' : ''}`}
                    onError={(e) => { e.currentTarget.src = '/img/background_catholic.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  {/* Overlay de Textura de Quadro (Simulação de Bordado/Ouro) */}
                  <div className="absolute inset-0 border-[1px] border-amber-300/30 pointer-events-none"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider">{modulo.nome}</h3>
                  <p className={`${modulo.nome.toLowerCase().includes('certificado') ? 'text-amber-300' : 'text-gray-300'} text-sm mt-1`}>
                    {modulo.nome.toLowerCase().includes('certificado') && '🏆 '} {modulo.description}
                  </p>
                </div>
                {(!isLocked && !isPaywalled && modulo.aulas && modulo.aulas.length > 0) && <ProgressCircle percentage={progressoModulos[modulo.id] ?? 0} />}
                {(isLocked || isPaywalled) && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center ${isPaywalled ? 'bg-black/80' : 'bg-black/50'}`}>
                    <span className={`font-bold ${isPaywalled ? "text-amber-400" : "text-red-600"}`}>{isPaywalled ? "CONTEÚDO EXCLUSIVO" : "BLOQUEADO"}</span>
                    <span className={`text-xs ${!isPaywalled ? "text-red-500 font-medium" : ""}`}>{lockMessage}</span>
                    {isPaywalled && (
                      <button className="mt-2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full hover:bg-amber-400">
                        {isLoadingPix && productKeyToBuy === purchaseProductKey ? 'A gerar...' : 'Liberar Acesso'}
                      </button>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* 8. RENDERIZAÇÃO CORRETA DO MODAL */}
      {/* 8. RENDERIZAÇÃO CORRETA DO MODAL */}
      {/* Overlay de carregamento removido para usar o loading do botão/modal */}
      {isModalOpen && pixData && (
        <PixModal
          isOpen={isModalOpen}
          pixData={pixData}
          onClose={() => setIsModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess} // Passando a função de callback
        />
      )}
      {paymentError && <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50"><p>{paymentError}</p></div>}
    </section>
  );
}
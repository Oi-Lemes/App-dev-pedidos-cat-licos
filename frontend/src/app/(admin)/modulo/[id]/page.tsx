"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipos...
interface Aula {
  id: number;
  nome: string;
  imagem?: string;
  descricao?: string; // Usado para agrupar artistas
}

interface Modulo {
  id: number;
  nome: string;
  description: string;
  guide?: string;
  aulas: Aula[];
}

export default function ModuloPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [aulasConcluidas, setAulasConcluidas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State específico para Módulo de Música
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const [moduloRes, progressoRes] = await Promise.all([
          fetch(`${backendUrl}/modulos/${id}`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' }),
          fetch(`${backendUrl}/progresso`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' })
        ]);

        if (!moduloRes.ok) {
          const errorData = await moduloRes.json();
          throw new Error(errorData.message || 'Falha ao carregar o módulo.');
        }

        setModulo(await moduloRes.json());
        setAulasConcluidas(await progressoRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  // useEffect para atualizar o progresso quando uma aula é concluída
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const fetchProgresso = async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
          const progressoRes = await fetch(`${backendUrl}/progresso`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' });
          if (progressoRes.ok) {
            setAulasConcluidas(await progressoRes.json());
          }
        } catch (error) {
          console.error("Erro ao re-buscar progresso:", error);
        }
      };
      fetchProgresso();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }

  if (error || !modulo) {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-red-400">Ocorreu um Erro</h1>
        <p className="mt-2 text-white">{error || "Não foi possível carregar as informações do módulo."}</p>
        <Link href="/dashboard" className="text-blue-400 hover:underline mt-4 block">
          Voltar para o Dashboard
        </Link>
      </div>
    );
  }

  // --- LÓGICA DE MÚSICA ---
  const isMusicModule = modulo.nome.includes('Músicas Católicas') || modulo.nome.includes('Música Católica') || modulo.nome.includes('Acervo');

  // Agrupar Artistas se for módulo de música
  // Map<NomeArtista, {imagem, count}>
  const artistsMap = new Map();
  if (isMusicModule) {
    modulo.aulas.forEach(aula => {
      // Aula.descricao é o Artista
      const artistName = aula.descricao || 'Desconhecido';
      // Aula.imagem é a capa do artista
      if (!artistsMap.has(artistName)) {
        artistsMap.set(artistName, {
          name: artistName,
          imagem: aula.imagem,
          count: 0
        });
      }
      artistsMap.get(artistName).count += 1;
    });
  }
  const uniqueArtists = Array.from(artistsMap.values());

  // Definir lista a ser exibida
  let displayedAulas = modulo.aulas;
  if (isMusicModule && selectedArtist) {
    displayedAulas = modulo.aulas.filter(a => a.descricao === selectedArtist);
  }

  // Hardcode generic background for inner pages as requested by user
  const headerImage = '/img/background_catholic.png';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500/30 pb-20">

      {/* HEADER / CAPA (Mobile Optimized: h-auto + min-h) */}
      <header className="relative w-full min-h-[20rem] md:min-h-[24rem] h-auto overflow-hidden shadow-2xl flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10 pointer-events-none"></div>
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${headerImage}`}
          alt={modulo.nome}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="relative z-20 w-full p-6 md:p-12 pb-10 md:pb-16 max-w-5xl mx-auto flex flex-col justify-end">
          {/* Back Button Wrapper to prevent overlap */}
          <div className="mb-4">
            <Link href="/dashboard" className="inline-flex items-center text-amber-200/80 hover:text-amber-100 transition-colors font-medium text-sm uppercase tracking-widest backdrop-blur-sm bg-black/40 px-4 py-2 rounded-full border border-white/10 hover:bg-black/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Início
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white drop-shadow-lg tracking-tight leading-tight break-words">
            {isMusicModule && selectedArtist ? selectedArtist : modulo.nome}
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-300 font-light max-w-2xl drop-shadow-md border-l-2 border-amber-500 pl-4 leading-relaxed">
            {modulo.description}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 -mt-6 relative z-30">

        {/* --- GUIA PRÁTICO PREMIUM (DESIGN APRIMORADO) --- */}
        {modulo.guide && (
          <div className="relative mb-12 group">
            {/* Efeito Glow Dourado de Fundo */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-1000"></div>

            <div className="relative rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-amber-500/30 p-1">

              {/* Moldura Interna Decorativa */}
              <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6 md:p-8 backdrop-blur-sm">

                {/* Cabeçalho do Guia */}
                <div className="flex flex-col items-center justify-center text-center mb-8">
                  <span className="text-amber-400 text-4xl mb-2 drop-shadow-md">📖</span>
                  <h2 className="text-2xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 drop-shadow-sm">
                    Guia Prático de Oração
                  </h2>
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-4"></div>
                </div>

                {/* Conteúdo do Guia (Formatado) */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-light tracking-wide">
                    {modulo.guide.split('**').map((part, index) =>
                      // Simples parser para negrito baseado no markdown do seed
                      index % 2 === 1 ? <strong key={index} className="text-amber-300 font-semibold">{part}</strong> : part
                    )}
                  </div>
                </div>

                {/* Rodapé Decorativo (Apenas espaçamento) */}
                <div className="mb-4"></div>

              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 1: GRID DE ARTISTAS (Somente Módulo Música + Sem Seleção) --- */}
        {isMusicModule && !selectedArtist && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {uniqueArtists.map((artist) => (
              <div
                key={artist.name}
                onClick={() => setSelectedArtist(artist.name)}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 active:scale-95"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={artist.imagem?.startsWith('http') || artist.imagem?.startsWith('data:') ? artist.imagem : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${artist.imagem}`}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-white font-bold text-base md:text-lg truncate group-hover:text-amber-400 transition-colors leading-tight">{artist.name}</h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">{artist.count} músicas</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW 2: LISTA DE AULAS/MÚSICAS (Padrão OU Artista Selecionado) --- */}
        {(!isMusicModule || selectedArtist) && (
          <div className="space-y-4">

            {/* Cabeçalho extra para voltar aos artistas */}
            {isMusicModule && (
              <button
                onClick={() => setSelectedArtist(null)}
                className="mb-6 flex items-center text-amber-400 hover:text-amber-300 transition-colors gap-2 px-2 py-1 -ml-2 rounded-lg active:bg-white/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Voltar para Artistas
              </button>
            )}

            {displayedAulas.map((aula, index) => {
              const isConcluida = aulasConcluidas.includes(aula.id);
              return (
                <Link
                  key={aula.id}
                  href={`/modulo/${id}/aula/${aula.id}`}
                  className="group relative block"
                >
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 active:scale-[0.99]">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3 min-w-0 flex-1"> {/* Flex-1 + Min-w-0 evita overflow */}
                        <h3 className={`font-sans text-base leading-snug transition-colors break-words pr-2 ${isConcluida ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                          {aula.nome}
                        </h3>
                      </div>

                      <div className="flex items-center flex-shrink-0 pl-2">
                        {isConcluida ? (
                          <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : isMusicModule ? (
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-6 w-6 flex items-center justify-center text-gray-500 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
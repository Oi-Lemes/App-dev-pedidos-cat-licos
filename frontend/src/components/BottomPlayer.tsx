
"use client";

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import Image from 'next/image';

export function BottomPlayer() {
    const { currentTrack, isPlaying, togglePlay, closePlayer } = usePlayer();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            // Promise resolve logic to prevent "The play() request was interrupted"
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Playback prevented:', error));
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]); // Re-run if track changes

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        setProgress(current);
        setDuration(total || 0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-white/10 px-4 py-3 md:py-4 shadow-[0_-5px_20px_rgba(0,0,0,0.8)] backdrop-blur-lg">
            <audio
                ref={audioRef}
                src={currentTrack.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => togglePlay()} // Pause no fim -> Futuro: AutoPlay next
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                className="hidden"
            />

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Info do Artista/Track */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-md overflow-hidden bg-gray-800 flex-shrink-0 animate-spin-slow" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                        {currentTrack.imageUrl ? (
                            <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <span className="text-xs">🎵</span>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm md:text-base truncate">{currentTrack.title}</h4>
                        <p className="text-gray-400 text-xs md:text-sm truncate">{currentTrack.artist || 'Artista Desconhecido'}</p>
                    </div>
                </div>

                {/* Controls (Centro) */}
                <div className="flex flex-col items-center justify-end flex-1">
                    {/* Botões Play/Pause */}
                    <div className="flex items-center gap-4 mb-1">
                        {/* Prev (Placeholder) */}
                        <button className="text-gray-400 hover:text-white transition hidden md:block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
                        >
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </button>

                        {/* Next (Placeholder) */}
                        <button className="text-gray-400 hover:text-white transition hidden md:block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
                        </button>
                    </div>

                    {/* Progress Bar (Mobile: Oculto ou simplificado se muito pequeno, mas bom ter) */}
                    <div className="w-full flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-mono">
                        <span>{formatTime(progress)}</span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-amber-500"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Close / Volume (Right) */}
                <div className="flex items-center justify-end flex-1 gap-4">
                    {/* Close Button */}
                    <button onClick={closePlayer} className="p-2 text-gray-400 hover:text-red-400 transition" title="Fechar Player">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

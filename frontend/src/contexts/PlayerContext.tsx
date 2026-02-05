
"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export interface Track {
    id: string | number;
    title: string;
    artist?: string;
    url: string;
    imageUrl?: string;
    moduleId?: string | number; // Para saber de onde veio
}

interface PlayerContextData {
    isPlaying: boolean;
    currentTrack: Track | null;
    togglePlay: () => void;
    playTrack: (track: Track) => void;
    pauseTrack: () => void;
    resumeTrack: () => void; // Diferente de playTrack, apenas resume
    closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

    // Referência global ao áudio (embora o elemento <audio> fique no BottomPlayer, 
    // o estado é controlado aqui para que qualquer componente saiba quem está tocando)

    const playTrack = (track: Track) => {
        // Se já estiver tocando a mesma, apenas toggle
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pauseTrack = () => setIsPlaying(false);

    const resumeTrack = () => {
        if (currentTrack) setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentTrack) {
            setIsPlaying(!isPlaying);
        }
    };

    const closePlayer = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
    };

    return (
        <PlayerContext.Provider
            value={{
                isPlaying,
                currentTrack,
                togglePlay,
                playTrack,
                pauseTrack,
                resumeTrack,
                closePlayer
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);

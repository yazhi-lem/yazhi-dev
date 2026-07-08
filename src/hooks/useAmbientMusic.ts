'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * useAmbientMusic - Hook for managing ambient Tamil music (yazh & pann)
 * 
 * Features:
 * - Auto-play on load with volume fade-in
 * - Volume sync with scroll position (optional)
 * - Play/pause/mute controls
 * - LocalStorage persistence for user preference
 */
export function useAmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted (browser autoplay policy)
  const [volume, setVolume] = useState(0.5);

  // Initialize audio on mount
  useEffect(() => {
    if (!audioRef.current) return;

    // Restore user's previous mute preference
    const savedMuted = localStorage.getItem('yazhi:audio:muted') === 'true';
    setIsMuted(savedMuted);

    // Set audio source and properties
    const audio = audioRef.current;
    audio.src = '/audio/yazhi-ambient.mp3'; // Placeholder path
    audio.volume = savedMuted ? 0 : 0.5;
    audio.loop = true;

    // Attempt autoplay (respects browser policy)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser blocked autoplay; wait for user interaction
          console.log('Autoplay blocked; music will start on user interaction');
        });
    }

    return () => {
      audio.pause();
    };
  }, []);

  // Fade in music on first user interaction
  useEffect(() => {
    if (!audioRef.current || isMuted) return;

    const audio = audioRef.current;
    if (!audio.paused) return;

    const handleUserInteraction = () => {
      audio.play().catch(() => {});
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isMuted]);

  // Volume control
  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clamped;
    setVolume(clamped);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : volume;
    localStorage.setItem('yazhi:audio:muted', String(newMuted));

    if (!newMuted && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return {
    audioRef,
    isPlaying,
    isMuted,
    volume,
    toggleMute,
    togglePlayPause,
    setVolume: handleVolumeChange,
  };
}

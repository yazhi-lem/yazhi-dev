"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface YazhiVideoMascotProps {
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export function YazhiVideoMascot({
  className = "",
  alt = "Yazhi temple guardian mascot",
  onClick,
}: YazhiVideoMascotProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [shouldReduceMotion]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className={`group relative inline-block select-none cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 ${className}`.trim()}
    >
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/videos/yazhi-guardian-poster.png"
          alt={alt}
          loading="eager"
          decoding="async"
          className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
        />
      ) : (
        <video
          ref={videoRef}
          src="/videos/yazhi-guardian.webm"
          poster="/videos/yazhi-guardian-poster.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}
    </button>
  );
}

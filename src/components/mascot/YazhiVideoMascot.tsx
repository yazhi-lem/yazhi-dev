"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { MASCOT_VIDEO_CONFIG, MASCOT_SIZES } from "./mascotCoordinates";
import type { YazhiMascotProps } from "./types";

/**
 * YazhiVideoMascot renders the official transparent VP9 WebM animation.
 *
 * Requirements satisfied:
 * - Native HTML5 <video> with autoplay, muted, loop, playsInline
 * - 100% transparent background with natural website background visibility
 * - Preserves native 16:9 aspect ratio without cropping paws, ears, wings, or tail
 * - Responsive sizing: visually dominant on desktop, proportionate on mobile (360px+)
 * - Zero rectangular containers, cards, or opaque backgrounds
 * - Subtle contour drop-shadow for separation
 * - Respects prefers-reduced-motion by pausing / serving static first-frame poster
 * - Extensible interaction architecture: ready for cursor proximity, gaze, hover, click, and Tamil greeting
 */
export function YazhiVideoMascot({
  size = "lg",
  className = "",
  priority = true,
  alt = MASCOT_VIDEO_CONFIG.alt,
  onInteraction,
}: YazhiMascotProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Future interaction architecture state placeholders
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [proximity, setProximity] = useState<{ x: number; y: number } | null>(null);

  // Ensure autoplay starts reliably even after hydration / navigation
  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be deferred until first user gesture depending on browser policies
      });
    }
  }, [shouldReduceMotion]);

  // Proximity & pointer interaction handlers (prepared for future gaze / reaction layers)
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    onInteraction?.({ type: "hover", data: { hovered: true } });
  }, [onInteraction]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setProximity(null);
    onInteraction?.({ type: "hover", data: { hovered: false } });
  }, [onInteraction]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const coords = { x: Math.max(-1, Math.min(1, relX)), y: Math.max(-1, Math.min(1, relY)) };
      setProximity(coords);
      onInteraction?.({ type: "proximity", data: coords });
    },
    [onInteraction]
  );

  const handleClick = useCallback(() => {
    setIsClicked((prev) => !prev);
    onInteraction?.({ type: "click", data: { clicked: true } });
  }, [onInteraction]);

  // Video-specific responsive sizing:
  // On desktop, the mascot should be large and dominant; on mobile, it scales down proportionally.
  const videoSizeClass =
    size === "custom"
      ? ""
      : size === "xs"
      ? "w-32 max-w-full"
      : size === "sm"
      ? "w-48 max-w-full"
      : size === "md"
      ? "w-64 sm:w-72 max-w-full"
      : size === "xl"
      ? "w-full max-w-[340px] sm:max-w-[380px]"
      : "w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[380px]"; // default 'lg'

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      className={`relative inline-block select-none cursor-pointer ${videoSizeClass} ${className}`.trim()}
      style={{
        aspectRatio: MASCOT_VIDEO_CONFIG.aspectRatio,
      }}
      data-hovered={isHovered ? "true" : undefined}
      data-clicked={isClicked ? "true" : undefined}
    >
      {shouldReduceMotion ? (
        /* Static poster state when prefers-reduced-motion is enabled */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={MASCOT_VIDEO_CONFIG.poster}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
        />
      ) : (
        /* Transparent VP9 WebM Animation (100% alpha transparency, zero black background) */
        <video
          ref={videoRef}
          src={MASCOT_VIDEO_CONFIG.src}
          poster={MASCOT_VIDEO_CONFIG.poster}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          aria-hidden
          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
        />
      )}
    </div>
  );
}

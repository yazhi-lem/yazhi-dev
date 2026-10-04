"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MASCOT_ASPECT_RATIO,
  MASCOT_LAYERS,
  EYES_RELATIVE_TO_HEAD,
  AVATAR_CONFIG,
  MASCOT_SIZES,
  MASCOT_FULL_ASSET,
} from "./mascotCoordinates";
import type { YazhiMascotProps } from "./types";
import { YazhiVideoMascot } from "./YazhiVideoMascot";

export { YazhiVideoMascot } from "./YazhiVideoMascot";

export function YazhiMascot({
  mode = "interactive",
  size = "lg",
  className = "",
  interactive = true,
  priority = false,
  alt = "Yazhi — sovereign mythical guardian mascot",
  onInteraction,
}: YazhiMascotProps) {
  // ----------------------------------------------------
  // VIDEO MASCOT MODE (Transparent VP9 WebM Animation):
  // ----------------------------------------------------
  if (mode === "video") {
    return (
      <YazhiVideoMascot
        size={size}
        className={className}
        priority={priority}
        alt={alt}
        onInteraction={onInteraction}
      />
    );
  }

  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Blinking state
  const [isBlinking, setIsBlinking] = useState(false);

  // Pointer tracking (subtle micro-gaze offset, clamped to tiny pixel range)
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // Natural irregular blinking cycle (every 3.8 to 6.5s)
  useEffect(() => {
    if (mode === "static" || shouldReduceMotion) return;

    let timeoutId: NodeJS.Timeout;
    const scheduleBlink = () => {
      const nextDelay = 3800 + Math.random() * 2700;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [mode, shouldReduceMotion]);

  // Subtle cursor gaze tracking (drastically reduced to micro-glance: max 1.2px X, 0.8px Y)
  useEffect(() => {
    if (mode === "static" || !interactive || shouldReduceMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy) || 1;

      // Clamped micro-travel: only 1.2px in X, 0.8px in Y to stay firmly seated in eye socket
      const maxDistance = 600;
      const factor = Math.min(dist / maxDistance, 1);

      const targetX = (dx / dist) * factor * 1.2;
      const targetY = (dy / dist) * factor * 0.8;

      setGaze({ x: targetX, y: targetY });
    };

    const handlePointerLeave = () => {
      setGaze({ x: 0, y: 0 });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [mode, interactive, shouldReduceMotion]);

  const sizeClass = size !== "custom" ? MASCOT_SIZES[size] : "";

  // ----------------------------------------------------
  // AVATAR MODE: Cropped head + eyes
  // ----------------------------------------------------
  if (mode === "avatar") {
    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={alt}
        className={`relative inline-block overflow-hidden rounded-full select-none ${sizeClass} ${className}`}
        style={{ aspectRatio: 1 }}
      >
        {/* Head base container */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: AVATAR_CONFIG.head.left,
            top: AVATAR_CONFIG.head.top,
            width: AVATAR_CONFIG.head.width,
            height: AVATAR_CONFIG.head.height,
            zIndex: AVATAR_CONFIG.head.zIndex,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR_CONFIG.head.src}
            alt=""
            aria-hidden
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(211,179,106,0.12)]"
          />

          {/* Dynamic eyes layer nestled precisely inside Head container */}
          <motion.div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: EYES_RELATIVE_TO_HEAD.left,
              top: EYES_RELATIVE_TO_HEAD.top,
              width: EYES_RELATIVE_TO_HEAD.width,
              height: EYES_RELATIVE_TO_HEAD.height,
              zIndex: 2,
              transformOrigin: EYES_RELATIVE_TO_HEAD.transformOrigin,
              willChange: "transform",
            }}
            animate={{
              scaleY: isBlinking ? 0.08 : 1,
              x: gaze.x * 0.7,
              y: gaze.y * 0.7,
            }}
            transition={{
              scaleY: { duration: 0.09, ease: "easeInOut" },
              x: { type: "spring", stiffness: 120, damping: 18 },
              y: { type: "spring", stiffness: 120, damping: 18 },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_CONFIG.eyes.src}
              alt=""
              aria-hidden
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATIC MASCOT MODE (Unified clean high-resolution asset):
  // ----------------------------------------------------
  if (mode === "static") {
    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={alt}
        className={`relative inline-block select-none ${sizeClass} ${className}`}
        style={{
          aspectRatio: MASCOT_FULL_ASSET.aspectRatio,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_FULL_ASSET.src}
          srcSet={`${MASCOT_FULL_ASSET.src} 1x, ${MASCOT_FULL_ASSET.src2x} 2x`}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // INTERACTIVE MASCOT MODE (6 Layered Micro-Animations):
  // ----------------------------------------------------
  const isInteractive = !shouldReduceMotion;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`relative inline-block select-none ${sizeClass} ${className}`}
      style={{
        aspectRatio: MASCOT_ASPECT_RATIO,
      }}
    >
      {/* 1. WINGS (Layer 1 - Background) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: MASCOT_LAYERS.wings.left,
          top: MASCOT_LAYERS.wings.top,
          width: MASCOT_LAYERS.wings.width,
          height: MASCOT_LAYERS.wings.height,
          zIndex: MASCOT_LAYERS.wings.zIndex,
          transformOrigin: MASCOT_LAYERS.wings.transformOrigin,
          willChange: isInteractive ? "transform" : "auto",
        }}
        animate={
          isInteractive
            ? {
                scale: [1, 1.012, 1],
                rotate: [-0.3, 0.3, -0.3],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 4.4,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_LAYERS.wings.src}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(211,179,106,0.08)]"
        />
      </motion.div>

      {/* 2. TAIL (Layer 2 - Firmly anchored hip attachment) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: MASCOT_LAYERS.tail.left,
          top: MASCOT_LAYERS.tail.top,
          width: MASCOT_LAYERS.tail.width,
          height: MASCOT_LAYERS.tail.height,
          zIndex: MASCOT_LAYERS.tail.zIndex,
          transformOrigin: MASCOT_LAYERS.tail.transformOrigin,
          willChange: isInteractive ? "transform" : "auto",
        }}
        animate={
          isInteractive
            ? {
                y: [0, -0.8, 0],
                rotate: [-0.5, 0.7, -0.5],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 4.4,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_LAYERS.tail.src}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(211,179,106,0.08)]"
        />
      </motion.div>

      {/* 3. BODY (Layer 3 - Torso & Paws, rhythmic gentle breathing) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: MASCOT_LAYERS.body.left,
          top: MASCOT_LAYERS.body.top,
          width: MASCOT_LAYERS.body.width,
          height: MASCOT_LAYERS.body.height,
          zIndex: MASCOT_LAYERS.body.zIndex,
          transformOrigin: MASCOT_LAYERS.body.transformOrigin,
          willChange: isInteractive ? "transform" : "auto",
        }}
        animate={
          isInteractive
            ? {
                scaleY: [1, 1.008, 1],
                y: [0, -0.8, 0],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 4.4,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_LAYERS.body.src}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
        />
      </motion.div>

      {/* 4. PENDANT (Layer 4 - Chest Medallion) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: MASCOT_LAYERS.pendant.left,
          top: MASCOT_LAYERS.pendant.top,
          width: MASCOT_LAYERS.pendant.width,
          height: MASCOT_LAYERS.pendant.height,
          zIndex: MASCOT_LAYERS.pendant.zIndex,
          transformOrigin: MASCOT_LAYERS.pendant.transformOrigin,
          willChange: isInteractive ? "transform" : "auto",
        }}
        animate={
          isInteractive
            ? {
                y: [0, -0.8, 0],
                rotate: [-1.4, 1.4, -1.4],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 3.6,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_LAYERS.pendant.src}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(211,179,106,0.18)]"
        />
      </motion.div>

      {/* 5. HEAD (Layer 5 - Mane & Face) */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: MASCOT_LAYERS.head.left,
          top: MASCOT_LAYERS.head.top,
          width: MASCOT_LAYERS.head.width,
          height: MASCOT_LAYERS.head.height,
          zIndex: MASCOT_LAYERS.head.zIndex,
          transformOrigin: MASCOT_LAYERS.head.transformOrigin,
          willChange: isInteractive ? "transform" : "auto",
        }}
        animate={
          isInteractive
            ? {
                y: [0, -0.8, 0],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 4.4,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MASCOT_LAYERS.head.src}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        />

        {/* 6. EYES (Layer 6 - Gaze & Blink, nestled physically inside Head) */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: EYES_RELATIVE_TO_HEAD.left,
            top: EYES_RELATIVE_TO_HEAD.top,
            width: EYES_RELATIVE_TO_HEAD.width,
            height: EYES_RELATIVE_TO_HEAD.height,
            zIndex: 6,
            transformOrigin: EYES_RELATIVE_TO_HEAD.transformOrigin,
            willChange: isInteractive ? "transform" : "auto",
          }}
          animate={
            isInteractive
              ? {
                  scaleY: isBlinking ? 0.08 : 1,
                  x: gaze.x,
                  y: gaze.y,
                }
              : {
                  scaleY: isBlinking ? 0.08 : 1,
                }
          }
          transition={{
            scaleY: { duration: 0.09, ease: "easeInOut" },
            x: { type: "spring", stiffness: 120, damping: 18 },
            y: { type: "spring", stiffness: 120, damping: 18 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MASCOT_LAYERS.eyes.src}
            alt=""
            aria-hidden
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(211,179,106,0.12)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface YazhiProps {
  size?: number;
  variant?: "adult" | "baby";
  animate?: boolean;
}

export default function YazhiIllustration({ size = 300, variant = "adult", animate = true }: YazhiProps) {
  const isBaby = variant === "baby";
  const scale = isBaby ? 0.7 : 1;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={animate ? { opacity: 1, scale: 1, rotateY: [0, 5, -5, 0] } : { opacity: 1, scale: 1 }}
      transition={animate ? {
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 },
        rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      } : undefined}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <defs>
        {/* Gradients for 3D effect */}
        <linearGradient id="yazhiBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "var(--accent-light)", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0.6 }} />
        </linearGradient>

        <radialGradient id="yazhiGlow">
          <stop offset="0%" style={{ stopColor: "var(--accent-light)", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0.2 }} />
        </radialGradient>

        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(100, 100) scale(${scale})`}>
        {/* Glow background */}
        <motion.circle
          cx="0"
          cy="0"
          r="70"
          fill="url(#yazhiGlow)"
          opacity="0.3"
          animate={animate ? { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : undefined}
          transition={animate ? { duration: 3, repeat: Infinity } : undefined}
        />

        {/* Main Body */}
        <motion.ellipse
          cx="0"
          cy="10"
          rx="40"
          ry="30"
          fill="url(#yazhiBody)"
          filter="url(#shadow)"
          animate={animate ? { ry: [30, 32, 30] } : undefined}
          transition={animate ? { duration: 2, repeat: Infinity } : undefined}
        />

        {/* Head */}
        <motion.circle
          cx="0"
          cy="-20"
          r={isBaby ? "22" : "25"}
          fill="url(#yazhiBody)"
          filter="url(#shadow)"
          animate={animate ? { y: [-20, -22, -20] } : undefined}
          transition={animate ? { duration: 2, repeat: Infinity, delay: 0.2 } : undefined}
        />

        {/* Eyes */}
        <motion.circle
          cx="-10"
          cy="-22"
          r={isBaby ? "4" : "3"}
          fill="var(--text)"
          animate={animate ? { scale: [1, 0.1, 1] } : undefined}
          transition={animate ? { duration: 3, repeat: Infinity, delay: 1 } : undefined}
        />
        <motion.circle
          cx="10"
          cy="-22"
          r={isBaby ? "4" : "3"}
          fill="var(--text)"
          animate={animate ? { scale: [1, 0.1, 1] } : undefined}
          transition={animate ? { duration: 3, repeat: Infinity, delay: 1 } : undefined}
        />

        {/* Mane/Crown (mythical element) */}
        {[...Array(7)].map((_, i) => {
          const angle = (i - 3) * 25;
          const length = isBaby ? 15 : 20;
          return (
            <motion.line
              key={i}
              x1="0"
              y1="-35"
              x2={`${Math.sin(angle * Math.PI / 180) * length}`}
              y2={`${-35 - Math.cos(angle * Math.PI / 180) * length}`}
              stroke="url(#yazhiBody)"
              strokeWidth={isBaby ? "3" : "4"}
              strokeLinecap="round"
              animate={animate ? {
                x2: [
                  `${Math.sin(angle * Math.PI / 180) * length}`,
                  `${Math.sin(angle * Math.PI / 180) * (length + 3)}`,
                  `${Math.sin(angle * Math.PI / 180) * length}`
                ],
                y2: [
                  `${-35 - Math.cos(angle * Math.PI / 180) * length}`,
                  `${-35 - Math.cos(angle * Math.PI / 180) * (length + 3)}`,
                  `${-35 - Math.cos(angle * Math.PI / 180) * length}`
                ]
              } : undefined}
              transition={animate ? { duration: 2, repeat: Infinity, delay: i * 0.1 } : undefined}
            />
          );
        })}

        {/* Legs */}
        {[-15, -5, 5, 15].map((x, i) => (
          <motion.rect
            key={i}
            x={x - 3}
            y="35"
            width="6"
            height={isBaby ? "15" : "20"}
            rx="3"
            fill="url(#yazhiBody)"
            filter="url(#shadow)"
            animate={animate ? { height: [isBaby ? 15 : 20, (isBaby ? 15 : 20) + 2, isBaby ? 15 : 20] } : undefined}
            transition={animate ? { duration: 2, repeat: Infinity, delay: i * 0.1 } : undefined}
          />
        ))}

        {/* Tail */}
        <motion.path
          d={isBaby ? "M 30 10 Q 50 5, 55 -5" : "M 35 10 Q 60 5, 70 -10"}
          stroke="url(#yazhiBody)"
          strokeWidth={isBaby ? "6" : "8"}
          strokeLinecap="round"
          fill="none"
          filter="url(#shadow)"
          animate={animate ? {
            d: isBaby
              ? ["M 30 10 Q 50 5, 55 -5", "M 30 10 Q 50 8, 55 0", "M 30 10 Q 50 5, 55 -5"]
              : ["M 35 10 Q 60 5, 70 -10", "M 35 10 Q 60 10, 70 -5", "M 35 10 Q 60 5, 70 -10"]
          } : undefined}
          transition={animate ? { duration: 2, repeat: Infinity } : undefined}
        />

        {/* Horn/Tusk (mythical element) */}
        <motion.path
          d={isBaby ? "M -15 -15 Q -20 -25, -18 -30" : "M -20 -15 Q -28 -28, -25 -35"}
          stroke="var(--accent-light)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={animate ? { opacity: [0.6, 1, 0.6] } : undefined}
          transition={animate ? { duration: 2, repeat: Infinity } : undefined}
        />

        {/* Heart symbol for baby version */}
        {isBaby && (
          <motion.path
            d="M 0,-5 C -3,-8 -8,-8 -8,-3 C -8,2 0,8 0,8 C 0,8 8,2 8,-3 C 8,-8 3,-8 0,-5"
            fill="var(--accent-light)"
            opacity="0.6"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </g>
    </motion.svg>
  );
}

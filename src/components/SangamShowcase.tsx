"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SangamShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF5E6 0%, #E8F5E9 100%)' }}
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 right-1/4 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(197, 225, 165, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left side - Madurai Kanji Landscape */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[700px] hidden md:block"
        >
          {/* Sangam-era Madurai landscape with temple pond */}
          <svg
            viewBox="0 0 600 700"
            className="w-full h-full drop-shadow-xl"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C5E1A5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FEF9F3" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8E6D5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C5E1A5" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="templeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D99F" />
                <stop offset="100%" stopColor="#FFB5A7" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="600" height="300" fill="url(#skyGrad)" />

            {/* Distant hills */}
            <motion.path
              d="M 0 280 Q 150 240 300 260 Q 450 250 600 280 L 600 300 L 0 300 Z"
              fill="rgba(197, 225, 165, 0.3)"
              animate={{
                d: [
                  "M 0 280 Q 150 240 300 260 Q 450 250 600 280 L 600 300 L 0 300 Z",
                  "M 0 285 Q 150 245 300 255 Q 450 255 600 285 L 600 300 L 0 300 Z",
                  "M 0 280 Q 150 240 300 260 Q 450 250 600 280 L 600 300 L 0 300 Z",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Ground */}
            <rect y="300" width="600" height="400" fill="#FEF9F3" />

            {/* Temple pond (Kanji) - center piece */}
            <motion.ellipse
              cx="300"
              cy="450"
              rx="180"
              ry="120"
              fill="url(#waterGrad)"
              animate={{
                ry: [120, 125, 120],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Water ripples */}
            {[0, 1, 2].map((i) => (
              <motion.ellipse
                key={i}
                cx="300"
                cy="450"
                rx="180"
                ry="120"
                fill="none"
                stroke="rgba(184, 230, 213, 0.4)"
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.2, 1.4],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Temple structure - background */}
            <motion.g
              animate={{
                y: [-2, 2, -2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Temple base */}
              <rect x="220" y="320" width="160" height="80" fill="url(#templeGrad)" opacity="0.7" />

              {/* Temple tower (gopuram) */}
              <path
                d="M 240 320 L 300 260 L 360 320 Z"
                fill="url(#templeGrad)"
                opacity="0.8"
              />

              {/* Tower details */}
              <rect x="280" y="280" width="40" height="40" fill="rgba(255, 181, 167, 0.6)" />
              <circle cx="300" cy="270" r="8" fill="#F5D99F" />
            </motion.g>

            {/* Palm trees - left */}
            {[0, 1].map((i) => (
              <motion.g
                key={`left-${i}`}
                animate={{
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: `${80 + i * 40}px 500px` }}
              >
                {/* Trunk */}
                <path
                  d={`M ${80 + i * 40} 500 Q ${85 + i * 40} 420 ${80 + i * 40} 340`}
                  stroke="rgba(197, 225, 165, 0.6)"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Fronds */}
                {[0, 1, 2, 3, 4].map((j) => (
                  <motion.path
                    key={j}
                    d={`M ${80 + i * 40} 340 Q ${60 + i * 40 + j * 15} ${320 - j * 10} ${40 + i * 40 + j * 20} ${310 - j * 15}`}
                    stroke="rgba(197, 225, 165, 0.7)"
                    strokeWidth="3"
                    fill="none"
                    animate={{
                      d: [
                        `M ${80 + i * 40} 340 Q ${60 + i * 40 + j * 15} ${320 - j * 10} ${40 + i * 40 + j * 20} ${310 - j * 15}`,
                        `M ${80 + i * 40} 340 Q ${65 + i * 40 + j * 15} ${318 - j * 10} ${45 + i * 40 + j * 20} ${308 - j * 15}`,
                        `M ${80 + i * 40} 340 Q ${60 + i * 40 + j * 15} ${320 - j * 10} ${40 + i * 40 + j * 20} ${310 - j * 15}`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: j * 0.2,
                    }}
                  />
                ))}
              </motion.g>
            ))}

            {/* Palm trees - right */}
            {[0, 1].map((i) => (
              <motion.g
                key={`right-${i}`}
                animate={{
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: `${480 + i * 40}px 520px` }}
              >
                {/* Trunk */}
                <path
                  d={`M ${480 + i * 40} 520 Q ${475 + i * 40} 440 ${480 + i * 40} 360`}
                  stroke="rgba(197, 225, 165, 0.6)"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Fronds */}
                {[0, 1, 2, 3, 4].map((j) => (
                  <motion.path
                    key={j}
                    d={`M ${480 + i * 40} 360 Q ${500 + i * 40 - j * 15} ${340 - j * 10} ${520 + i * 40 - j * 20} ${330 - j * 15}`}
                    stroke="rgba(197, 225, 165, 0.7)"
                    strokeWidth="3"
                    fill="none"
                    animate={{
                      d: [
                        `M ${480 + i * 40} 360 Q ${500 + i * 40 - j * 15} ${340 - j * 10} ${520 + i * 40 - j * 20} ${330 - j * 15}`,
                        `M ${480 + i * 40} 360 Q ${495 + i * 40 - j * 15} ${338 - j * 10} ${515 + i * 40 - j * 20} ${328 - j * 15}`,
                        `M ${480 + i * 40} 360 Q ${500 + i * 40 - j * 15} ${340 - j * 10} ${520 + i * 40 - j * 20} ${330 - j * 15}`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: j * 0.2,
                    }}
                  />
                ))}
              </motion.g>
            ))}

            {/* Lotus flowers on pond */}
            {[0, 1, 2].map((i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={260 + i * 40}
                  cy={440 + i * 10}
                  r="12"
                  fill="rgba(255, 181, 167, 0.7)"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut",
                  }}
                />
                <circle
                  cx={260 + i * 40}
                  cy={440 + i * 10}
                  r="6"
                  fill="rgba(245, 217, 159, 0.9)"
                />
              </motion.g>
            ))}

            {/* Birds in sky */}
            {[0, 1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d="M 0 0 Q 5 -3 10 0 Q 15 -3 20 0"
                stroke="rgba(74, 74, 74, 0.3)"
                strokeWidth="1.5"
                fill="none"
                initial={{ x: -30, y: 100 + i * 30 }}
                animate={{
                  x: [0, 600],
                  y: [100 + i * 30, 80 + i * 30, 100 + i * 30],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  delay: i * 3,
                  ease: "linear",
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-[1px]" style={{ background: '#C5E1A560' }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.5em]" style={{ color: '#C5E1A5' }}>
              Literary Analysis
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl mb-4 leading-[0.9] tracking-tighter font-dm-serif font-bold"
            style={{ color: '#2A2A2A' }}
          >
            Project
            <span className="block italic text-5xl md:text-6xl mt-1" style={{ color: '#C5E1A5', fontWeight: 700 }}>
              Sangam
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl font-light mb-8 leading-relaxed"
            style={{ color: '#4A4A4A' }}
          >
            Deep analysis of classical Tamil literature from the Sangam era. Understanding ancient poetry through
            computational linguistics, exploring Thinai (landscape-emotion mapping), morphological analysis,
            and cultural context preservation of Madurai's golden age.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-4 mb-8"
          >
            {[
              { label: "Poem Analysis", desc: "Cultural & emotional deep-dive into classical verses", icon: "📜" },
              { label: "Linguistic Analysis", desc: "Morphology, sandhi rules, and grammatical structure", icon: "🔤" },
              { label: "Thinai Mapping", desc: "Landscape-emotion correlation in Sangam works", icon: "🏞️" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-start gap-4 rounded-lg p-4"
                style={{
                  background: 'rgba(197, 225, 165, 0.15)',
                  border: '1px solid rgba(197, 225, 165, 0.3)',
                }}
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: '#C5E1A5' }}>{feature.label}</div>
                  <div className="text-sm" style={{ color: '#4A4A4A' }}>{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <button className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold rounded-full shadow-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C5E1A5, #B8E6D5)',
                color: '#4A4A4A',
              }}
            >
              Explore Sangam
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

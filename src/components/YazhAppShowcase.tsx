"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function YazhAppShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8F5E9 0%, #FFF3E0 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 181, 167, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-[1px]" style={{ background: '#FFB5A760' }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.5em]" style={{ color: '#FFB5A7' }}>
              Mythical Guardian
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tighter font-dm-serif"
            style={{ color: '#4A4A4A' }}
          >
            Yazh
            <span className="block italic text-4xl md:text-5xl mt-2" style={{ color: '#FFB5A7' }}>
              Guardian App
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl font-light mb-6 leading-relaxed"
            style={{ color: '#4A4A4A' }}
          >
            Inspired by the mythical Yazhi creature and our kid's beloved pet, this guardian watches over
            the communal forest playground. A companion app that embodies protective wisdom, playful spirit,
            and the joy of community gathering under ancient trees.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm md:text-base italic mb-8 font-light"
            style={{ color: '#FFB5A7' }}
          >
            "Named after our kid's pet, embodying fierce loyalty and gentle wisdom in the community forest"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {[
              { icon: "🛡️", label: "Guardian AI", desc: "Protective intelligence" },
              { icon: "🌳", label: "Forest Keeper", desc: "Nature preservation" },
              { icon: "🎠", label: "Play Guardian", desc: "Safe community spaces" },
              { icon: "✨", label: "Myth Keeper", desc: "Cultural heritage" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + i * 0.1 }}
                className="rounded-lg p-4 transition-all hover:scale-105"
                style={{
                  background: 'rgba(255, 181, 167, 0.15)',
                  border: '1px solid rgba(255, 181, 167, 0.3)',
                }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: '#FFB5A7' }}>{feature.label}</div>
                <div className="text-xs" style={{ color: '#4A4A4A80' }}>{feature.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex gap-4"
          >
            <button className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold rounded-full shadow-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FFB5A7, #F5D99F)',
                color: '#4A4A4A',
              }}
            >
              Launch App
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="px-8 py-3 border-2 text-sm font-bold rounded-full transition-all hover:scale-105"
              style={{
                borderColor: 'rgba(255, 181, 167, 0.4)',
                color: '#4A4A4A',
                background: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Right side - Communal Forest with Playground */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[700px] hidden md:flex items-center justify-center"
        >
          <svg viewBox="0 0 600 700" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C5E1A5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B8E6D5" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="yazhGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB5A7" />
                <stop offset="50%" stopColor="#F5D99F" />
                <stop offset="100%" stopColor="#FFB5A7" />
              </linearGradient>
            </defs>

            {/* Forest background */}
            <rect width="600" height="700" fill="url(#forestGrad)" />

            {/* Large forest trees - background */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.g
                key={`tree-${i}`}
                animate={{
                  x: [-3, 3, -3],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                {/* Tree trunk */}
                <rect
                  x={50 + i * 120}
                  y={500}
                  width="30"
                  height="180"
                  fill="rgba(139, 94, 60, 0.4)"
                  rx="5"
                />
                {/* Tree canopy */}
                <motion.ellipse
                  cx={65 + i * 120}
                  cy={460}
                  rx="80"
                  ry="100"
                  fill="rgba(197, 225, 165, 0.6)"
                  animate={{
                    ry: [100, 105, 100],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              </motion.g>
            ))}

            {/* Playground elements */}
            {/* Swing set */}
            <g>
              <rect x="150" y="550" width="10" height="120" fill="rgba(139, 94, 60, 0.5)" />
              <rect x="240" y="550" width="10" height="120" fill="rgba(139, 94, 60, 0.5)" />
              <rect x="140" y="550" width="120" height="8" fill="rgba(139, 94, 60, 0.5)" />

              {/* Swings */}
              {[0, 1].map((i) => (
                <motion.g
                  key={`swing-${i}`}
                  animate={{
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 1.5,
                  }}
                  style={{ transformOrigin: `${165 + i * 60}px 558px` }}
                >
                  <line
                    x1={165 + i * 60}
                    y1="558"
                    x2={165 + i * 60}
                    y2="620"
                    stroke="rgba(74, 74, 74, 0.3)"
                    strokeWidth="2"
                  />
                  <rect
                    x={150 + i * 60}
                    y="620"
                    width="30"
                    height="8"
                    fill="rgba(255, 181, 167, 0.7)"
                    rx="2"
                  />
                </motion.g>
              ))}
            </g>

            {/* Slide */}
            <g>
              <rect x="380" y="580" width="15" height="80" fill="rgba(139, 94, 60, 0.5)" />
              <path
                d="M 395 580 Q 450 600 480 650"
                stroke="rgba(245, 217, 159, 0.7)"
                strokeWidth="40"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* Yazh Guardian - center, watching over playground */}
            <motion.g
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Yazh body */}
              <motion.ellipse
                cx="300"
                cy="380"
                rx="60"
                ry="80"
                fill="url(#yazhGrad)"
                opacity="0.9"
                animate={{
                  ry: [80, 85, 80],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Head */}
              <ellipse cx="300" cy="300" rx="50" ry="55" fill="url(#yazhGrad)" opacity="0.9" />

              {/* Ears/horns */}
              <path
                d="M 260 280 Q 240 260 245 240"
                stroke="#FFB5A7"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 340 280 Q 360 260 355 240"
                stroke="#FFB5A7"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />

              {/* Glowing eyes */}
              <motion.circle
                cx="280"
                cy="295"
                r="8"
                fill="#F5D99F"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  r: [8, 10, 8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="320"
                cy="295"
                r="8"
                fill="#F5D99F"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  r: [8, 10, 8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />

              {/* Protective aura */}
              <motion.circle
                cx="300"
                cy="340"
                r="120"
                fill="none"
                stroke="rgba(255, 181, 167, 0.3)"
                strokeWidth="2"
                animate={{
                  r: [120, 140, 120],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>

            {/* Children silhouettes playing */}
            {[0, 1, 2].map((i) => (
              <motion.g
                key={`child-${i}`}
                animate={{
                  y: i === 1 ? [-5, 5, -5] : 0,
                  x: i === 2 ? [-3, 3, -3] : 0,
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
              >
                <circle
                  cx={100 + i * 180}
                  cy={640}
                  r="15"
                  fill="rgba(74, 74, 74, 0.3)"
                />
                <rect
                  x={90 + i * 180}
                  y={655}
                  width="20"
                  height="30"
                  fill="rgba(74, 74, 74, 0.3)"
                  rx="5"
                />
              </motion.g>
            ))}

            {/* Butterflies */}
            {[0, 1, 2, 3].map((i) => (
              <motion.g
                key={`butterfly-${i}`}
                initial={{ x: Math.random() * 600, y: Math.random() * 400 }}
                animate={{
                  x: [0, 600],
                  y: [100 + i * 80, 50 + i * 80, 100 + i * 80],
                }}
                transition={{
                  duration: 12 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              >
                <ellipse cx="0" cy="0" rx="4" ry="6" fill="rgba(255, 181, 167, 0.6)" />
                <ellipse cx="8" cy="0" rx="4" ry="6" fill="rgba(255, 181, 167, 0.6)" />
              </motion.g>
            ))}

            {/* Grass patches */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M ${i * 30} 680 Q ${i * 30 + 5} 665 ${i * 30 + 10} 680`}
                stroke="rgba(197, 225, 165, 0.5)"
                strokeWidth="2"
                fill="none"
                animate={{
                  d: [
                    `M ${i * 30} 680 Q ${i * 30 + 5} 665 ${i * 30 + 10} 680`,
                    `M ${i * 30} 680 Q ${i * 30 + 5} 670 ${i * 30 + 10} 680`,
                    `M ${i * 30} 680 Q ${i * 30 + 5} 665 ${i * 30 + 10} 680`,
                  ],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SangamShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden theme-transition"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Marutham Landscape - Pond & Farm */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative h-[600px] hidden md:block"
        >
          <svg viewBox="0 0 500 600" className="w-full h-full">
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--accent-tertiary)', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: 'var(--accent-secondary)', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="500" height="200" style={{ fill: 'var(--bg-secondary)' }} />

            {/* Farm fields - terraced */}
            <rect y="200" width="500" height="100" style={{ fill: 'var(--accent-tertiary)', opacity: 0.3 }} />
            <rect y="300" width="500" height="100" style={{ fill: 'var(--accent-tertiary)', opacity: 0.4 }} />
            <rect y="400" width="500" height="200" style={{ fill: 'var(--accent-tertiary)', opacity: 0.5 }} />

            {/* Pond - center */}
            <motion.ellipse
              cx="250"
              cy="400"
              rx="150"
              ry="100"
              fill="url(#waterGrad)"
              animate={{ ry: [100, 105, 100] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Water ripples */}
            {[0, 1, 2].map((i) => (
              <motion.ellipse
                key={i}
                cx="250"
                cy="400"
                rx="150"
                ry="100"
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                opacity="0"
                animate={{
                  scale: [0.8, 1.4],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i,
                }}
              />
            ))}

            {/* Rice plants */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.line
                key={i}
                x1={50 + i * 20}
                y1="500"
                x2={50 + i * 20}
                y2="470"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                animate={{
                  x2: [50 + i * 20, 52 + i * 20, 50 + i * 20],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                }}
              />
            ))}

            {/* Lotus in pond */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={200 + i * 50}
                cy={390 + i * 10}
                r="10"
                style={{ fill: 'var(--accent-primary)' }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}

            {/* Farmers (silhouettes) */}
            {[0, 1].map((i) => (
              <g key={i}>
                <circle cx={100 + i * 280} cy="510" r="12" style={{ fill: 'var(--text-primary)', opacity: 0.4 }} />
                <rect x={93 + i * 280} y="522" width="14" height="25" style={{ fill: 'var(--text-primary)', opacity: 0.4 }} />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-7xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Sangam
          </h2>
          <p className="text-3xl font-bold mb-6" style={{ color: 'var(--accent-primary)' }}>
            மருதம் Marutham
          </p>
          <p className="text-xl mb-8 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Classical Tamil literature analysis. Understanding Sangam poetry through the five landscapes—Marutham (agricultural), Kurinji (mountains), Mullai (forests), Neytal (coast), Palai (desert).
          </p>

          <div className="space-y-3 mb-8">
            {[
              { label: "Poem Analysis", icon: "📜" },
              { label: "Thinai Classification", icon: "🏞️" },
              { label: "Linguistic Study", icon: "📖" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <button
            className="px-8 py-3 font-bold rounded-full transition-all hover:scale-105"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            Explore Sangam →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

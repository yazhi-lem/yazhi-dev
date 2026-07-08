"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SangamShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 flex items-center justify-center px-6 overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* மருதம் Landscape */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative h-[600px] hidden md:block"
        >
          <svg viewBox="0 0 500 600" className="w-full h-full">
            <defs>
              <linearGradient id="pond" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--accent-light)', stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>

            {/* வானம் - Sky */}
            <rect width="500" height="200" style={{ fill: 'var(--surface)' }} />

            {/* விளை நிலங்கள் - Farm Fields */}
            <rect y="200" width="500" height="100" style={{ fill: 'var(--accent)', opacity: 0.15 }} />
            <rect y="300" width="500" height="100" style={{ fill: 'var(--accent)', opacity: 0.2 }} />
            <rect y="400" width="500" height="200" style={{ fill: 'var(--accent)', opacity: 0.25 }} />

            {/* குளம் - Pond */}
            <motion.ellipse
              cx="250"
              cy="400"
              rx="150"
              ry="100"
              fill="url(#pond)"
              animate={{ ry: [100, 105, 100] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* நீர் அலைகள் - Water Ripples */}
            {[0, 1, 2].map((i) => (
              <motion.ellipse
                key={i}
                cx="250"
                cy="400"
                rx="150"
                ry="100"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                opacity="0"
                animate={{
                  scale: [0.8, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i,
                }}
              />
            ))}

            {/* நெல் - Rice Plants */}
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.line
                key={i}
                x1={30 + i * 20}
                y1="520"
                x2={30 + i * 20}
                y2="490"
                stroke="var(--accent)"
                strokeWidth="2"
                animate={{
                  x2: [30 + i * 20, 32 + i * 20, 30 + i * 20],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                }}
              />
            ))}

            {/* தாமரை - Lotus */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={200 + i * 50}
                cy={390 + i * 10}
                r="12"
                style={{ fill: 'var(--accent)' }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}

            {/* உழவர் - Farmers */}
            {[0, 1].map((i) => (
              <g key={i}>
                <circle cx={100 + i * 280} cy="530" r="10" style={{ fill: 'var(--text)', opacity: 0.3 }} />
                <rect x={94 + i * 280} y="540" width="12" height="20" style={{ fill: 'var(--text)', opacity: 0.3 }} />
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
          <h2 className="tamil-title text-8xl mb-4" style={{ color: 'var(--text)' }}>
            சங்கம்
          </h2>
          <p className="text-4xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
            Sangam
          </p>
          <p className="tamil-body text-2xl mb-4" style={{ color: 'var(--text)' }}>
            மருதம் - விளை நிலம்
          </p>
          <p className="text-lg mb-8 font-semibold leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Classical Tamil literature analysis through the five landscapes. Marutham represents agricultural fertile lands, union, and domestic happiness.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { tamil: "செய்யுள் ஆய்வு", eng: "Poem Analysis", icon: "📜" },
              { tamil: "திணை வகைப்பாடு", eng: "Thinai Classification", icon: "🏞️" },
              { tamil: "மொழி ஆய்வு", eng: "Linguistic Study", icon: "📖" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{ background: 'var(--surface)' }}
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className="tamil-body text-lg" style={{ color: 'var(--text)' }}>
                    {item.tamil}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    {item.eng}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            மேலும் அறிக →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

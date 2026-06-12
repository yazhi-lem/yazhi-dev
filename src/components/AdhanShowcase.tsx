"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Complete Tamil alphabet
const TAMIL_LETTERS = [
  // Vowels
  'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
  // Consonants
  'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
  // Combined
  'கா', 'கி', 'கீ', 'கு', 'கூ', 'கெ', 'கே', 'கை', 'கொ', 'கோ', 'கௌ',
  'சா', 'சி', 'சீ', 'சு', 'சூ', 'செ', 'சே', 'சை', 'சொ', 'சோ', 'சௌ',
  'தா', 'தி', 'தீ', 'து', 'தூ', 'தெ', 'தே', 'தை', 'தொ', 'தோ', 'தௌ',
  'மா', 'மி', 'மீ', 'மு', 'மூ', 'மெ', 'மே', 'மை', 'மொ', 'மோ', 'மௌ',
  'னா', 'னி', 'னீ', 'னு', 'னூ', 'னெ', 'னே', 'னை', 'னொ', 'னோ', 'னௌ',
];

export default function AdhanShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Generate DENSE particles (200+ letters)
  const denseParticles = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    letter: TAMIL_LETTERS[i % TAMIL_LETTERS.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 12 + Math.random() * 32,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <section
      id="adhan"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FEF9F3 0%, #FFF5E6 100%)' }}
    >
      {/* DENSE Tamil letter particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {denseParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute font-dm-serif select-none pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
              color: particle.id % 3 === 0 ? '#F5D99F' : particle.id % 3 === 1 ? '#FFB5A7' : '#C5E1A5',
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(particle.id) * 20, 0],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          >
            {particle.letter}
          </motion.div>
        ))}
      </div>

      {/* Soft gradient overlays */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(245, 217, 159, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left side - Info */}
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
            <div className="w-12 h-[1px]" style={{ background: '#F5D99F60' }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.5em]" style={{ color: '#F5D99F' }}>
              Sovereign AI
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl mb-4 leading-[0.9] tracking-tighter font-dm-serif font-bold"
            style={{ color: '#2A2A2A' }}
          >
            Adhan
            <span className="block italic text-5xl md:text-6xl mt-1" style={{ color: '#F5D99F', fontWeight: 700 }}>
              Tamil-First Model
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl font-medium mb-6 leading-relaxed"
            style={{ color: '#2A2A2A' }}
          >
            A sovereign language model built for Tamil. Trained on the rich corpus of Tamil literature,
            modern discourse, and cultural wisdom. Adhan understands context, nuance, and the soul of Tamil language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { label: "Model Size", value: "7B Parameters", color: "#F5D99F" },
              { label: "Training", value: "Tamil-First", color: "#FFB5A7" },
              { label: "Status", value: "Active", color: "#C5E1A5" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg px-6 py-3"
                style={{
                  background: `${stat.color}20`,
                  border: `1px solid ${stat.color}40`,
                }}
              >
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: stat.color }}>
                  {stat.label}
                </div>
                <div className="text-2xl font-dm-serif" style={{ color: '#4A4A4A' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8"
          >
            <a
              href="https://github.com/yazhi-lem/adhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold rounded-full shadow-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #F5D99F, #FFB5A7)',
                color: '#4A4A4A',
              }}
            >
              Explore Adhan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Right side - Code Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[600px] hidden md:block"
        >
          {/* Code snippet */}
          <div className="relative z-10 rounded-lg p-8 font-mono text-sm shadow-xl backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(245, 217, 159, 0.3)',
            }}
          >
            <div className="mb-2" style={{ color: '#4A4A4A60' }}># Tamil Language Processing</div>
            <div className="mb-4" style={{ color: '#4A4A4A' }}>
              <span style={{ color: '#FFB5A7' }}>from</span> adhan <span style={{ color: '#FFB5A7' }}>import</span> Model
            </div>
            <div className="mb-4" style={{ color: '#4A4A4A' }}>
              model = Model.<span style={{ color: '#F5D99F' }}>load</span>(<span style={{ color: '#C5E1A5' }}>"adhan-7b"</span>)
            </div>
            <div className="mb-4" style={{ color: '#4A4A4A' }}>
              response = model.<span style={{ color: '#F5D99F' }}>generate</span>(
            </div>
            <div className="ml-4 mb-4" style={{ color: '#4A4A4A' }}>
              <span style={{ color: '#C5E1A5' }}>"குமரிக்கண்டத்தின் வரலாறு என்ன?"</span>
            </div>
            <div style={{ color: '#4A4A4A' }}>)</div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-6 pt-6"
              style={{ borderTop: '1px solid rgba(245, 217, 159, 0.2)' }}
            >
              <div className="text-xs mb-2" style={{ color: '#F5D99F' }}>→ Output:</div>
              <div className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                குமரிக்கண்டம் என்பது தமிழ் இலக்கியங்களில் குறிப்பிடப்படும் ஒரு பண்டைய நிலப்பகுதி...
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

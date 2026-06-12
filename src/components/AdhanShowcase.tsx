"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// இந்திய எழுத்துமுறைகள் - Indian Scripts
const BHARATA_LIPI = {
  tamil: ['அ', 'ஆ', 'இ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'],
  devanagari: ['अ', 'आ', 'इ', 'क', 'ख', 'ग', 'च', 'ज', 'ट', 'ड', 'त', 'द', 'न', 'प', 'ब', 'म', 'य', 'र', 'ल', 'व'],
  bengali: ['অ', 'আ', 'ই', 'ক', 'খ', 'গ', 'চ', 'জ', 'ট', 'ড', 'ত', 'দ', 'ন', 'প', 'ব', 'ম', 'য', 'র', 'ল'],
  telugu: ['అ', 'ఆ', 'ఇ', 'క', 'గ', 'చ', 'జ', 'ట', 'డ', 'త', 'ద', 'న', 'ప', 'బ', 'మ', 'య', 'ర', 'ల', 'వ'],
  kannada: ['ಅ', 'ಆ', 'ಇ', 'ಕ', 'ಗ', 'ಚ', 'ಜ', 'ಟ', 'ಡ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಬ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ'],
  malayalam: ['അ', 'ആ', 'ഇ', 'ക', 'ഗ', 'ച', 'ജ', 'ട', 'ഡ', 'ത', 'ദ', 'ന', 'പ', 'ബ', 'മ', 'യ', 'ര', 'ല', 'വ'],
  gujarati: ['અ', 'આ', 'ઇ', 'ક', 'ગ', 'ચ', 'જ', 'ટ', 'ડ', 'ત', 'દ', 'ન', 'પ', 'બ', 'મ', 'ય', 'ર', 'લ', 'વ'],
  punjabi: ['ਅ', 'ਆ', 'ਇ', 'ਕ', 'ਗ', 'ਚ', 'ਜ', 'ਟ', 'ਡ', 'ਤ', 'ਦ', 'ਨ', 'ਪ', 'ਬ', 'ਮ', 'ਯ', 'ਰ', 'ਲ', 'ਵ'],
};

const ALL_LIPI = Object.values(BHARATA_LIPI).flat();

export default function AdhanShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const particles = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    letter: ALL_LIPI[i % ALL_LIPI.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 16 + Math.random() * 32,
    delay: Math.random() * 5,
    duration: 12 + Math.random() * 12,
  }));

  return (
    <section
      id="adhan"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* Floating Indian Scripts */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: 'var(--accent)',
              fontFamily: 'var(--font-tamil)',
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          >
            {p.letter}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="tamil-title text-8xl mb-4" style={{ color: 'var(--text)' }}>
            அதன்
          </h2>
          <p className="text-4xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
            Adhan
          </p>
          <p className="tamil-body text-2xl mb-4" style={{ color: 'var(--text)' }}>
            இந்திய மொழிகளுக்கான இறையாண்மை செயற்கை நுண்ணறிவு
          </p>
          <p className="text-lg mb-8 font-semibold leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            7B parameter sovereign AI model for 22+ Indian languages. One unified model from Tamil to Hindi, Bengali to Telugu.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { value: "7B", label: "அளவுருக்கள்" },
              { value: "22+", label: "மொழிகள்" },
              { value: "100%", label: "இந்திய" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg)' }}>
                <div className="text-3xl font-black" style={{ color: 'var(--accent)' }}>
                  {stat.value}
                </div>
                <div className="tamil-body text-xs mt-1" style={{ color: 'var(--text-soft)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://github.com/yazhi-lem/adhan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            GitHub இல் காண்க →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-xl font-mono text-sm"
          style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
          <div className="mb-3 font-bold tamil-body" style={{ color: 'var(--accent)' }}>
            # பல மொழி செயற்கை நுண்ணறிவு
          </div>
          <div className="mb-2">from adhan import Model</div>
          <div className="mb-2">model = Model.load("adhan-7b")</div>
          <div className="mb-4">response = model.generate(</div>
          <div className="ml-4 space-y-2 mb-4">
            <div style={{ color: 'var(--accent)' }}>"தமிழின் வரலாறு என்ன?"</div>
            <div style={{ color: 'var(--accent)' }}>"भारत का इतिहास क्या है?"</div>
            <div style={{ color: 'var(--accent)' }}>"ಭಾರತದ ಇತಿಹಾಸವೇನು?"</div>
          </div>
          <div>)</div>
        </motion.div>
      </div>
    </section>
  );
}

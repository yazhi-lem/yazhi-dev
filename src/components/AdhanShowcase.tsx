"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Indian Scripts - Major languages
const INDIAN_SCRIPTS = {
  devanagari: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'ञ', 'ट', 'ड', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व'], // Hindi/Sanskrit
  bengali: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ক', 'খ', 'গ', 'ঘ', 'চ', 'ছ', 'জ', 'ট', 'ড', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল'], // Bengali
  tamil: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'], // Tamil
  telugu: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ట', 'డ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ'], // Telugu
  kannada: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಚ', 'ಛ', 'ಜ', 'ಟ', 'ಡ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ'], // Kannada
  malayalam: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ക', 'ഖ', 'ഗ', 'ഘ', 'ച', 'ഛ', 'ജ', 'ട', 'ഡ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ'], // Malayalam
  gujarati: ['અ', 'આ', 'ઇ', 'ઈ', 'ઉ', 'ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ટ', 'ડ', 'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ', 'બ', 'ભ', 'મ', 'ય', 'ર', 'લ', 'વ'], // Gujarati
  punjabi: ['ਅ', 'ਆ', 'ਇ', 'ਈ', 'ਉ', 'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਚ', 'ਛ', 'ਜ', 'ਟ', 'ਡ', 'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ', 'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ', 'ਯ', 'ਰ', 'ਲ', 'ਵ'], // Punjabi/Gurmukhi
  odia: ['ଅ', 'ଆ', 'ଇ', 'ଈ', 'ଉ', 'କ', 'ଖ', 'ଗ', 'ଘ', 'ଚ', 'ଛ', 'ଜ', 'ଟ', 'ଡ', 'ତ', 'ଥ', 'ଦ', 'ଧ', 'ନ', 'ପ', 'ଫ', 'ବ', 'ଭ', 'ମ', 'ଯ', 'ର', 'ଲ', 'ଵ'], // Odia
};

const ALL_LETTERS = Object.values(INDIAN_SCRIPTS).flat();

export default function AdhanShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Generate dense particles
  const particles = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    letter: ALL_LETTERS[i % ALL_LETTERS.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 14 + Math.random() * 28,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 15,
  }));

  return (
    <section
      id="adhan"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden theme-transition"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Multi-lingual particles */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute font-dm-serif select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: 'var(--accent-primary)',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
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
          <h2 className="text-7xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Adhan
          </h2>
          <p className="text-3xl font-bold mb-6" style={{ color: 'var(--accent-primary)' }}>
            Sovereign AI for India
          </p>
          <p className="text-xl mb-8 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            7B parameter model trained on 22+ Indian languages. From Tamil to Hindi, Bengali to Telugu—one unified model for all of India.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: "7B", label: "Parameters" },
              { value: "22+", label: "Languages" },
              { value: "100%", label: "Indian" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                <div className="text-3xl font-black" style={{ color: 'var(--accent-primary)' }}>
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://github.com/yazhi-lem/adhan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 font-bold rounded-full transition-all hover:scale-105"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            View on GitHub →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-lg font-mono text-sm"
          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
          <div className="mb-3 font-bold" style={{ color: 'var(--accent-primary)' }}># Multi-lingual AI</div>
          <div className="mb-2">from adhan import Model</div>
          <div className="mb-2">model = Model.load("adhan-7b")</div>
          <div className="mb-4">response = model.generate(</div>
          <div className="ml-4 mb-2" style={{ color: 'var(--accent-secondary)' }}>"भारत का भविष्य" # Hindi</div>
          <div className="ml-4 mb-2" style={{ color: 'var(--accent-secondary)' }}>"தமிழின் வரலாறு" # Tamil</div>
          <div className="ml-4 mb-2" style={{ color: 'var(--accent-secondary)' }}>"ಕನ್ನಡ ಸಂಸ್ಕೃತಿ" # Kannada</div>
          <div>)</div>
        </motion.div>
      </div>
    </section>
  );
}

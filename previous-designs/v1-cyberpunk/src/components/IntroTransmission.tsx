"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function IntroTransmission() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background - uses theme variables */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, color-mix(in srgb, var(--accent-light) 40%, transparent) 0%, transparent 50%),
            linear-gradient(180deg,
              var(--bg) 0%,
              color-mix(in srgb, var(--bg) 60%, black) 50%,
              var(--bg) 100%
            )
          `,
        }}
      />

      {/* Flowing Color Waves */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 60%)',
            'radial-gradient(circle at 70% 60%, color-mix(in srgb, var(--accent-light) 30%, transparent) 0%, transparent 60%)',
            'radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particle effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'var(--accent)' : 'var(--accent-light)',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Central Verse */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Glowing circle behind text */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Tamil Verse */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <p
            className="text-4xl md:text-6xl mb-8 leading-relaxed"
            style={{
              fontFamily: 'var(--font-tamil)',
              color: 'var(--text)',
              textShadow: '0 0 20px color-mix(in srgb, var(--accent) 50%, transparent), 0 0 40px color-mix(in srgb, var(--accent-light) 30%, transparent)',
            }}
          >
            யாமறிந்த மொழிகளிலே தமிழ்மொழி போல்
            <br />
            இனிதாவது எங்கும் காணோம்
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="text-xl md:text-2xl font-semibold"
            style={{
              color: 'var(--text-soft)',
              textShadow: '0 0 10px color-mix(in srgb, var(--accent-light) 40%, transparent)',
            }}
          >
            Of all the languages we know,
            <br />
            none is as sweet as Tamil
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 2.5 }}
            className="text-lg mt-6"
            style={{ color: 'var(--accent-light)' }}
          >
            — பாரதியார் • Bharathiyar
          </motion.p>
        </motion.div>

        {/* Decorative lines */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
        >
          <motion.div
            className="h-px w-24"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
            animate={{ width: [96, 120, 96] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-light)' }} />
          <motion.div
            className="h-px w-24"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-light), transparent)' }}
            animate={{ width: [96, 120, 96] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: [0, 1, 0], y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
            scroll to explore
          </div>
        </motion.div>
      </div>

      {/* Bottom merge into Hero */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
        }}
      />
    </section>
  );
}

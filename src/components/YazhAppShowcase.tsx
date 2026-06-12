"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function YazhAppShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden theme-transition"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-7xl font-black mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Yazh Guardian
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6"
          style={{ color: 'var(--accent-primary)' }}
        >
          யாழி Mythical Protector
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-xl max-w-3xl mx-auto mb-12 font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Guardian app inspired by the mythical Yazhi creature. Protective wisdom for the digital age, watching over Tamil heritage and community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <button
            className="px-8 py-3 font-bold rounded-full transition-all hover:scale-105"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            Launch App
          </button>
        </motion.div>
      </div>
    </section>
  );
}

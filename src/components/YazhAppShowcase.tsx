"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function YazhAppShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 flex items-center justify-center px-6 overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="tamil-title text-8xl mb-4"
          style={{ color: 'var(--text)' }}
        >
          யாழ்
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-6"
          style={{ color: 'var(--accent)' }}
        >
          Yazh Guardian
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="tamil-body text-2xl mb-6"
          style={{ color: 'var(--text)' }}
        >
          யாழி • புராண காவலன்
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-lg max-w-2xl mx-auto mb-12 font-semibold leading-relaxed"
          style={{ color: 'var(--text-soft)' }}
        >
          Guardian application inspired by the mythical Yazhi creature. Protecting Tamil digital heritage and community wisdom.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <button
            className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            தொடங்குக
          </button>
        </motion.div>
      </div>
    </section>
  );
}

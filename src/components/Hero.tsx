"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Hero() {
  const [theme, setTheme] = useState<"agam" | "puram">("puram");

  const toggleTheme = () => {
    const newTheme = theme === "agam" ? "puram" : "agam";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden theme-transition"
      style={{ background: 'var(--bg-primary)' }}>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 z-50 px-6 py-3 rounded-full font-bold text-sm transition-all"
        style={{
          background: 'var(--accent-primary)',
          color: 'var(--bg-primary)',
        }}
      >
        {theme === "agam" ? "அகம் Agam" : "புறம் Puram"}
      </button>

      {/* Simple gradient overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--accent-tertiary) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-6"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
            <circle cx="50" cy="30" r="12" style={{ fill: 'var(--accent-primary)' }} />
            <circle cx="30" cy="60" r="12" style={{ fill: 'var(--accent-primary)' }} />
            <circle cx="70" cy="60" r="12" style={{ fill: 'var(--accent-primary)' }} />
            <line x1="50" y1="30" x2="30" y2="60" style={{ stroke: 'var(--accent-secondary)', strokeWidth: 3 }} />
            <line x1="50" y1="30" x2="70" y2="60" style={{ stroke: 'var(--accent-secondary)', strokeWidth: 3 }} />
            <line x1="30" y1="60" x2="70" y2="60" style={{ stroke: 'var(--accent-secondary)', strokeWidth: 3 }} />
          </svg>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-8xl md:text-[12rem] font-black mb-4 leading-none"
          style={{ color: 'var(--text-primary)' }}
        >
          YAZHI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-4xl font-medium mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Tamil AI • தமிழ் செயற்கை நுண்ணறிவு
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl max-w-3xl mx-auto mb-10 font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Sovereign AI for Indian languages • Adhan Model • Project Sangam • Yazh Guardian
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-4 justify-center"
        >
          <a
            href="#adhan"
            className="px-10 py-4 font-bold text-lg rounded-full transition-all hover:scale-105"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            Explore
          </a>
          <a
            href="https://discord.gg/yazhi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 font-bold text-lg rounded-full border-2 transition-all hover:scale-105"
            style={{
              borderColor: 'var(--accent-primary)',
              color: 'var(--text-primary)',
            }}
          >
            Join Community
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex justify-center gap-12"
        >
          {[
            { value: "7B", label: "Parameters" },
            { value: "22+", label: "Indian Scripts" },
            { value: "3", label: "Core Projects" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black mb-1" style={{ color: 'var(--accent-primary)' }}>
                {stat.value}
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ color: 'var(--accent-primary)' }}
      >
        <svg width="24" height="40" viewBox="0 0 24 40">
          <rect x="1" y="1" width="22" height="38" rx="11" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="currentColor">
            <animate attributeName="cy" from="12" to="28" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    </section>
  );
}

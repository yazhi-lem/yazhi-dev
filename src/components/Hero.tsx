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
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ background: 'var(--bg)' }}
    >
      {/* Indian Flag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-6 left-6 z-50"
      >
        <svg width="80" height="54" viewBox="0 0 80 54">
          <rect width="80" height="18" fill="#FF9933" />
          <rect y="18" width="80" height="18" fill="#FFFFFF" />
          <rect y="36" width="80" height="18" fill="#138808" />
          <circle cx="40" cy="27" r="8" fill="none" stroke="#000080" strokeWidth="0.8" />
          <g transform="translate(40, 27)">
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-7"
                stroke="#000080"
                strokeWidth="0.5"
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* அகமும் புறமும் Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
        style={{
          background: 'var(--accent)',
          color: 'var(--bg)',
          fontFamily: 'var(--font-tamil-display)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {theme === "agam" ? "அகம்" : "புறம்"}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* யாழி Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 inline-block"
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--accent)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--accent-light)' }} />
              </linearGradient>
            </defs>
            <circle cx="60" cy="35" r="15" fill="url(#logoGrad)" />
            <circle cx="35" cy="75" r="15" fill="url(#logoGrad)" />
            <circle cx="85" cy="75" r="15" fill="url(#logoGrad)" />
            <line x1="60" y1="35" x2="35" y2="75" stroke="var(--accent)" strokeWidth="4" />
            <line x1="60" y1="35" x2="85" y2="75" stroke="var(--accent)" strokeWidth="4" />
            <line x1="35" y1="75" x2="85" y2="75" stroke="var(--accent)" strokeWidth="4" />
          </svg>
        </motion.div>

        {/* தமிழ் Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="tamil-title mb-6"
          style={{
            fontSize: 'clamp(4rem, 15vw, 14rem)',
            color: 'var(--text)',
          }}
        >
          யாழி
        </motion.h1>

        {/* Subtitle in Tamil */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="tamil-body text-3xl md:text-5xl mb-4"
          style={{ color: 'var(--accent)' }}
        >
          தமிழ் செயற்கை நுண்ணறிவு
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="tamil-body text-xl md:text-2xl mb-12"
          style={{ color: 'var(--text-soft)' }}
        >
          Tamizh AI • அகமும் புறமும்
        </motion.p>

        {/* தர்சர்பு - Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <p className="tamil-body text-lg md:text-xl leading-relaxed" style={{ color: 'var(--text)' }}>
            இந்திய மொழிகளுக்கான இறையாண்மை கொண்ட செயற்கை நுண்ணறிவு மாதிரி
          </p>
          <p className="mt-2 text-base md:text-lg font-semibold" style={{ color: 'var(--text-soft)' }}>
            Sovereign AI Model for Indian Languages
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#adhan"
            className="px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            ஆராய்க
          </a>
          <a
            href="https://discord.gg/yazhi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full border-2 font-bold text-lg transition-all hover:scale-105"
            style={{
              borderColor: 'var(--accent)',
              color: 'var(--text)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            இணையுங்கள்
          </a>
        </motion.div>

        {/* Stats in Tamil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="grid grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "7B", label: "அளவுருக்கள்", sub: "Parameters" },
            { value: "22+", label: "இந்திய மொழிகள்", sub: "Indian Languages" },
            { value: "3", label: "திட்டங்கள்", sub: "Projects" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="p-4 rounded-xl"
              style={{ background: 'var(--surface)' }}
            >
              <div className="text-4xl font-black mb-1" style={{ color: 'var(--accent)' }}>
                {stat.value}
              </div>
              <div className="tamil-body text-sm mb-1" style={{ color: 'var(--text)' }}>
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Tamil Letters */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        {['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ'].map((letter, i) => (
          <motion.div
            key={i}
            className="absolute text-9xl tamil-title"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              color: 'var(--accent)',
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {letter}
          </motion.div>
        ))}
      </div>

      {/* Scroll */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg width="24" height="40" viewBox="0 0 24 40" style={{ stroke: 'var(--accent)' }}>
          <rect x="1" y="1" width="22" height="38" rx="11" fill="none" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="var(--accent)">
            <animate attributeName="cy" from="12" to="28" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    </section>
  );
}

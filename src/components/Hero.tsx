"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [theme, setTheme] = useState<"agam" | "puram">("puram");
  const [currentLang, setCurrentLang] = useState(0);

  const languages = [
    { tamil: "தமிழ்", eng: "Tamil" },
    { tamil: "செயற்கை நுண்ணறிவு", eng: "Artificial Intelligence" },
  ];

  useEffect(() => {
    // Set initial theme on mount
    document.documentElement.setAttribute("data-theme", theme);

    // Rotate languages every 3 seconds
    const interval = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Indian Gradient Sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 left-6 z-50"
      >
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <radialGradient id="indianSphere" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="70%" stopColor="#138808" stopOpacity="1" />
              <stop offset="100%" stopColor="#000080" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#indianSphere)" opacity="0.9" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
        </motion.svg>
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
        {/* யாழி V-Logo - Three Elements */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 inline-block"
        >
          <svg width="140" height="140" viewBox="0 0 140 140">
            <defs>
              {/* Stone Pattern */}
              <pattern id="stonePattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#8B7355" />
                <circle cx="2" cy="2" r="1" fill="#6B5345" opacity="0.5" />
                <circle cx="6" cy="5" r="0.8" fill="#5B4335" opacity="0.3" />
              </pattern>
              <radialGradient id="stoneGrad">
                <stop offset="0%" stopColor="#A0826D" />
                <stop offset="100%" stopColor="#5B4335" />
              </radialGradient>

              {/* Water Ripple */}
              <radialGradient id="waterGrad">
                <stop offset="0%" stopColor="#4FC3F7" />
                <stop offset="50%" stopColor="#29B6F6" />
                <stop offset="100%" stopColor="#0288D1" />
              </radialGradient>

              {/* Grass/Nature */}
              <radialGradient id="grassGrad">
                <stop offset="0%" stopColor="#8BC34A" />
                <stop offset="100%" stopColor="#558B2F" />
              </radialGradient>

              {/* Volcano Smoke */}
              <radialGradient id="smokeGrad">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="40%" stopColor="#BFC0C0" />
                <stop offset="100%" stopColor="#6C757D" />
              </radialGradient>
            </defs>

            {/* Top - Small (Volcano Smoke) */}
            <g>
              <motion.circle
                cx="70"
                cy="30"
                r="12"
                fill="url(#smokeGrad)"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Smoke wisps */}
              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M ${70 + i * 3 - 3} 30 Q ${70 + i * 2} ${20 - i * 2} ${70 + i * 4 - 6} 15`}
                  stroke="#BFC0C0"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.4"
                  animate={{
                    d: [
                      `M ${70 + i * 3 - 3} 30 Q ${70 + i * 2} ${20 - i * 2} ${70 + i * 4 - 6} 15`,
                      `M ${70 + i * 3 - 3} 30 Q ${70 + i * 3} ${18 - i * 2} ${70 + i * 3 - 4} 12`,
                      `M ${70 + i * 3 - 3} 30 Q ${70 + i * 2} ${20 - i * 2} ${70 + i * 4 - 6} 15`,
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </g>

            {/* Bottom Left - Large (Stone/Earth) */}
            <g>
              <circle cx="35" cy="95" r="22" fill="url(#stoneGrad)" />
              <circle cx="35" cy="95" r="22" fill="url(#stonePattern)" opacity="0.4" />
              {/* Stone cracks */}
              <path d="M 25 95 L 45 95" stroke="#3B2315" strokeWidth="1" opacity="0.6" />
              <path d="M 35 85 L 38 105" stroke="#3B2315" strokeWidth="0.8" opacity="0.4" />
            </g>

            {/* Bottom Right - Large (Water) */}
            <g>
              <motion.circle
                cx="105"
                cy="95"
                r="22"
                fill="url(#waterGrad)"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Water ripples */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx="105"
                  cy="95"
                  r="22"
                  fill="none"
                  stroke="#4FC3F7"
                  strokeWidth="1"
                  opacity="0"
                  animate={{
                    r: [18, 26],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                />
              ))}
            </g>

            {/* Grass blades on water circle */}
            <g>
              {[0, 1, 2, 3].map((i) => (
                <motion.path
                  key={i}
                  d={`M ${105 + i * 5 - 7} 95 Q ${105 + i * 5 - 7} 88 ${105 + i * 6 - 9} 82`}
                  stroke="url(#grassGrad)"
                  strokeWidth="2"
                  fill="none"
                  animate={{
                    d: [
                      `M ${105 + i * 5 - 7} 95 Q ${105 + i * 5 - 7} 88 ${105 + i * 6 - 9} 82`,
                      `M ${105 + i * 5 - 7} 95 Q ${105 + i * 5 - 5} 88 ${105 + i * 6 - 7} 82`,
                      `M ${105 + i * 5 - 7} 95 Q ${105 + i * 5 - 7} 88 ${105 + i * 6 - 9} 82`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </g>

            {/* Connecting lines - V shape */}
            <line x1="70" y1="30" x2="35" y2="95" stroke="var(--accent)" strokeWidth="3" opacity="0.3" />
            <line x1="70" y1="30" x2="105" y2="95" stroke="var(--accent)" strokeWidth="3" opacity="0.3" />
            <line x1="35" y1="95" x2="105" y2="95" stroke="var(--accent)" strokeWidth="4" opacity="0.3" />
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

        {/* Rotating Language Text */}
        <div className="h-20 md:h-24 mb-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentLang}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.5 }}
              className="tamil-body text-3xl md:text-5xl"
              style={{ color: 'var(--accent)' }}
            >
              {currentLang === 0 ? languages[0].tamil : languages[1].tamil}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-12 md:h-16 mb-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentLang + 100}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl font-semibold"
              style={{ color: 'var(--text-soft)' }}
            >
              {currentLang === 0 ? languages[0].eng : languages[1].eng}
            </motion.p>
          </AnimatePresence>
        </div>

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

        {/* Three Hatching Eggs - Incubation till 2027 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <p className="tamil-body text-base mb-6" style={{ color: 'var(--accent)' }}>
            அடைகாக்கும் காலம் • Incubation Period
          </p>
          <div className="flex justify-center gap-8 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.svg
                key={i}
                width="80"
                height="100"
                viewBox="0 0 80 100"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <defs>
                  <linearGradient id={`eggGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
                  </linearGradient>
                </defs>
                {/* Egg shape */}
                <ellipse
                  cx="40"
                  cy="55"
                  rx="28"
                  ry="38"
                  fill={`url(#eggGrad${i})`}
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
                {/* Crack lines */}
                <motion.path
                  d="M 40 40 Q 45 50 40 60"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.6 + 1,
                  }}
                />
                <motion.path
                  d="M 35 45 Q 40 48 45 45"
                  stroke="var(--text)"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.6 + 1.5,
                  }}
                />
              </motion.svg>
            ))}
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-soft)' }}>
            முட்டையிடல் 2025 → குஞ்சு பொரிக்கும் 2027
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-soft)' }}>
            Laying 2025 → Hatching 2027
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

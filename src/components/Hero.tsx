"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [theme, setTheme] = useState<"agam" | "puram">("puram");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Get initial theme from DOM or set default
    const currentTheme = document.documentElement.getAttribute("data-theme") as "agam" | "puram" || "puram";
    setTheme(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Track mouse position for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
      {/* Interactive Gradient Sphere - Click to toggle theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 left-6 z-50 cursor-pointer group"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
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
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#indianSphere)" opacity="0.9" filter="url(#glow)" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3"
            className="group-hover:opacity-100 transition-opacity" />
        </motion.svg>
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          {theme === "agam" ? "புறம்" : "அகம்"}
        </motion.div>
      </motion.div>

      {/* Theme Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-6 right-6 z-50 px-6 py-3 rounded-full backdrop-blur-sm"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--accent)',
          color: 'var(--text)',
        }}
      >
        <span className="tamil-title text-2xl">
          {theme === "agam" ? "அகம்" : "புறம்"}
        </span>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">

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

      {/* Tamil Constellation - Connected Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 1 }}>
        <defs>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Constellation lines */}
        {[
          { x1: '20%', y1: '30%', x2: '35%', y2: '25%' },
          { x1: '35%', y1: '25%', x2: '50%', y2: '35%' },
          { x1: '50%', y1: '35%', x2: '65%', y2: '28%' },
          { x1: '65%', y1: '28%', x2: '80%', y2: '40%' },
          { x1: '20%', y1: '60%', x2: '40%', y2: '70%' },
          { x1: '40%', y1: '70%', x2: '60%', y2: '65%' },
          { x1: '60%', y1: '65%', x2: '75%', y2: '75%' },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.3 }}
          />
        ))}
        {/* Stars at constellation points */}
        {['20%,30%', '35%,25%', '50%,35%', '65%,28%', '80%,40%', '20%,60%', '40%,70%', '60%,65%', '75%,75%'].map((pos, i) => {
          const [x, y] = pos.split(',');
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="var(--accent)"
              filter="url(#starGlow)"
              animate={{
                opacity: [0.4, 1, 0.4],
                r: [3, 4, 3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          );
        })}
      </svg>

      {/* Interactive Mouse Followers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'var(--accent)',
              opacity: 0.3,
            }}
            animate={{
              x: mousePos.x - 600 + i * 100,
              y: mousePos.y - 300 + i * 50,
            }}
            transition={{
              type: "spring",
              damping: 20 + i * 5,
              stiffness: 100 - i * 10,
            }}
          />
        ))}
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

      {/* Floating Wisdom Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 5 }}
        className="absolute top-1/4 right-12 max-w-xs text-right pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <p className="tamil-body text-sm italic" style={{ color: 'var(--accent)' }}>
          "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல்<br />
          இனிதாவது எங்கும் காணோம்"
        </p>
        <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--text-soft)' }}>
          - பாரதியார்
        </p>
      </motion.div>

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

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* Animated gradient mesh background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%,
            rgba(212, 165, 116, 0.25) 0%,
            rgba(232, 116, 97, 0.15) 25%,
            rgba(107, 159, 127, 0.12) 50%,
            transparent 70%)`,
        }}
      />

      {/* Organic blob shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(212, 165, 116, 0.35) 0%, transparent 70%)',
          }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(107, 159, 127, 0.35) 0%, transparent 70%)',
          }}
          className="absolute bottom-0 right-1/4 w-[900px] h-[900px] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(232, 116, 97, 0.3) 0%, transparent 70%)',
          }}
          className="absolute top-1/2 right-1/3 w-[700px] h-[700px] rounded-full blur-3xl"
        />
      </div>

      {/* Three-mark Yazhi logo floating */}
      <motion.div
        className="absolute top-20 right-20 z-20"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#E87461" />
              <stop offset="100%" stopColor="#6B9F7F" />
            </linearGradient>
          </defs>
          {/* Three marks representing trinity */}
          <circle cx="40" cy="20" r="8" fill="url(#logoGrad)" opacity="0.8" />
          <circle cx="25" cy="50" r="8" fill="url(#logoGrad)" opacity="0.8" />
          <circle cx="55" cy="50" r="8" fill="url(#logoGrad)" opacity="0.8" />
          {/* Connecting lines */}
          <line x1="40" y1="20" x2="25" y2="50" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.4" />
          <line x1="40" y1="20" x2="55" y2="50" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.4" />
          <line x1="25" y1="50" x2="55" y2="50" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Floating grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 74, 74, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 74, 74, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
          y,
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center py-8"
      >
        {/* Yazh creature icon - simplified, modern */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="mb-8 inline-block"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
            <defs>
              <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="50%" stopColor="#E87461" />
                <stop offset="100%" stopColor="#6B9F7F" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="url(#iconGrad)"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <text
              x="60"
              y="75"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
              fill="#1A1A1A"
              fontFamily="serif"
            >
              ழ
            </text>
          </svg>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 rounded-full border-2 text-sm font-bold uppercase tracking-[0.3em]"
            style={{
              background: 'rgba(212, 165, 116, 0.15)',
              borderColor: '#D4A574',
              color: '#1A1A1A',
            }}
          >
            குமரிக்கண்டம் • Sovereign Tamil AI
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-7xl md:text-[10rem] font-black mb-4 leading-[0.85] tracking-tight"
        >
          <span style={{
            background: 'linear-gradient(135deg, #D4A574 0%, #E87461 50%, #6B9F7F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 12px rgba(212, 165, 116, 0.4))',
          }}>
            YAZHI
          </span>
        </motion.h1>

        {/* Subtitle with typing effect feel */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-3xl font-medium mb-8 max-w-4xl mx-auto leading-relaxed"
          style={{ color: '#1A1A1A' }}
        >
          Building the future of Tamil intelligence with{" "}
          <span style={{ color: '#D4A574', fontWeight: 800 }}>Adhan AI</span>,{" "}
          <span style={{ color: '#6B9F7F', fontWeight: 800 }}>Project Sangam</span>, and{" "}
          <span style={{ color: '#E87461', fontWeight: 800 }}>Yazh Guardian</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#adhan"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-4 font-bold text-lg rounded-full shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #D4A574, #E87461)',
              color: '#FFFFFF',
            }}
          >
            <span className="relative z-10">Explore Ecosystem</span>
            <span className="relative z-10 ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>

          <motion.a
            href="https://discord.gg/yazhi"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 border-2 font-bold text-lg rounded-full transition-all"
            style={{
              borderColor: '#1A1A1A',
              color: '#1A1A1A',
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Join Community
          </motion.a>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "7B", label: "Parameters", color: "#D4A574" },
            { value: "3", label: "Core Projects", color: "#E87461" },
            { value: "∞", label: "Tamil Heritage", color: "#6B9F7F" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${stat.color}20, transparent)`,
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#4A4A4A80' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: '#4A4A4A60' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 rounded-full flex justify-center pt-2"
          style={{ borderColor: '#F5D99F60' }}
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 rounded-full"
            style={{ background: '#F5D99F' }}
          />
        </motion.div>
      </motion.div>

      {/* Ambient particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#F5D99F80' : i % 3 === 1 ? '#FFB5A780' : '#C5E1A580',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
}

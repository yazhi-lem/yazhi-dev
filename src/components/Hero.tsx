"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type BubbleData = {
  id: number;
  size: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

// Pre-computed static bubble data (fixed at module parse time on the client).
// Using a stable seed avoids Math.random() inside render bodies and satisfies
// the react-hooks/purity and react-hooks/set-state-in-effect lint rules.
const BUBBLE_DATA: BubbleData[] = [
  { id: 0, size: "12px", left: "5%", animationDelay: "0s", animationDuration: "13s" },
  { id: 1, size: "8px", left: "12%", animationDelay: "1.2s", animationDuration: "15s" },
  { id: 2, size: "16px", left: "20%", animationDelay: "2.5s", animationDuration: "11s" },
  { id: 3, size: "6px", left: "28%", animationDelay: "3.7s", animationDuration: "14s" },
  { id: 4, size: "14px", left: "35%", animationDelay: "0.8s", animationDuration: "16s" },
  { id: 5, size: "10px", left: "42%", animationDelay: "4.1s", animationDuration: "12s" },
  { id: 6, size: "18px", left: "50%", animationDelay: "1.9s", animationDuration: "10s" },
  { id: 7, size: "7px", left: "57%", animationDelay: "5.3s", animationDuration: "17s" },
  { id: 8, size: "13px", left: "63%", animationDelay: "2.0s", animationDuration: "13s" },
  { id: 9, size: "9px", left: "70%", animationDelay: "6.5s", animationDuration: "11s" },
  { id: 10, size: "15px", left: "76%", animationDelay: "0.4s", animationDuration: "15s" },
  { id: 11, size: "11px", left: "82%", animationDelay: "3.2s", animationDuration: "14s" },
  { id: 12, size: "8px", left: "88%", animationDelay: "7.1s", animationDuration: "12s" },
  { id: 13, size: "17px", left: "93%", animationDelay: "1.5s", animationDuration: "16s" },
  { id: 14, size: "6px", left: "8%", animationDelay: "4.8s", animationDuration: "10s" },
  { id: 15, size: "12px", left: "17%", animationDelay: "2.3s", animationDuration: "13s" },
  { id: 16, size: "9px", left: "24%", animationDelay: "6.0s", animationDuration: "17s" },
  { id: 17, size: "14px", left: "31%", animationDelay: "0.7s", animationDuration: "11s" },
  { id: 18, size: "7px", left: "38%", animationDelay: "5.5s", animationDuration: "15s" },
  { id: 19, size: "16px", left: "46%", animationDelay: "1.1s", animationDuration: "13s" },
  { id: 20, size: "10px", left: "54%", animationDelay: "3.9s", animationDuration: "16s" },
  { id: 21, size: "13px", left: "61%", animationDelay: "7.3s", animationDuration: "12s" },
  { id: 22, size: "8px", left: "68%", animationDelay: "2.7s", animationDuration: "10s" },
  { id: 23, size: "11px", left: "75%", animationDelay: "4.4s", animationDuration: "14s" },
  { id: 24, size: "15px", left: "83%", animationDelay: "0.2s", animationDuration: "17s" },
];

import { useTheme } from "./ThemeProvider";

export default function Hero() {
  const { theme } = useTheme();
  // Lazy state initializer runs once on mount (client only), never on SSR.
  const [bubbles] = useState<BubbleData[]>(() => BUBBLE_DATA);

  return (
    <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-32 pb-20">
      {/* Hero Visual Layers */}
      <div className="absolute inset-0 z-0 bg-ocean-depth">
        <Image
          src="/hero-bg.png"
          alt="Sunken Disrupted Landscape of Thenmadurai"
          fill
          priority
          className={`object-cover transition-all duration-1000 ${
            theme === "light" ? "opacity-20 grayscale" : "opacity-[var(--hero-img-opacity)]"
          }`}
        />
        <div className="theme-overlay absolute inset-0 opacity-80 z-[1] transition-all duration-1000"></div>
        <div className="caustics absolute inset-0 z-[2]"></div>

        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="bubble"
              style={{
                width: b.size,
                height: b.size,
                left: b.left,
                animationDelay: b.animationDelay,
                animationDuration: b.animationDuration,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-[10] max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 inline-flex items-center gap-4"
        >
          <div className="w-12 h-[1px] bg-turmeric/30"></div>
          <span className="text-turmeric text-[10px] font-bold uppercase tracking-[0.6em] whitespace-nowrap">
            Sovereign Intelligence
          </span>
          <div className="w-12 h-[1px] bg-turmeric/30"></div>
        </motion.div>
 
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-palm-parchment text-6xl md:text-9xl mb-8 leading-[0.85] tracking-tighter font-dm-serif"
        >
          Indian Developer <br />
          <span className="italic text-turmeric">Collective.</span>
        </motion.h1>
 
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-palm-parchment text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto opacity-80 leading-relaxed"
        >
          A guild of engineers reclaiming the agentic power of Thenmadurai.
          We build sovereign language models and decentralized infrastructure for the next linguistic era.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <a
            href="https://discord.gg/yazhi"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-turmeric text-night-soil px-8 py-3 text-sm font-bold rounded-sm hover:bg-palm-parchment transition-all flex justify-center items-center gap-2 shadow-lg"
          >
            Join the Guild
          </a>
          <Link
            href="#feed"
            className="border border-palm-parchment/30 text-palm-parchment px-8 py-3 text-sm font-bold rounded-sm hover:bg-white/5 backdrop-blur-sm transition-colors flex justify-center items-center"
          >
            Activity Feed
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

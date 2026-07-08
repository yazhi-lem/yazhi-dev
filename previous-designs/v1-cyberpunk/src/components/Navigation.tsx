"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

function BubbleSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-[--color-turmeric]/5 border border-[--color-turmeric]/20 backdrop-blur-md transition-all hover:border-[--color-turmeric]/50 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ 
          x: theme === "dark" ? 4 : 36,
          backgroundColor: theme === "dark" ? "var(--color-turmeric)" : "var(--color-red-clay)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full" />
        {theme === "dark" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
          </svg>
        )}
      </motion.div>
      
      <div className="absolute inset-0 flex justify-around items-center px-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-[--color-turmeric]" />
        <div className="w-1 h-1 rounded-full bg-[--color-turmeric]" />
        <div className="w-1 h-1 rounded-full bg-[--color-turmeric]" />
      </div>
    </button>
  );
}

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center nav-glass text-palm-parchment border-b border-palm-parchment/10">
      <div className="flex items-center gap-5">
        <div className="ack-container shrink-0">
          <div className="fire-dot"></div>
          <div className="fire-dot"></div>
          <div className="fire-dot"></div>
        </div>
        <div className="flex flex-col">
          <span className="serif text-3xl tracking-[0.05em] block leading-none font-bold">
            YAZHI
          </span>
          <span className="text-[8px] uppercase tracking-[0.55em] opacity-70 block mt-1.5 font-bold whitespace-nowrap">
            Sovereign Intelligence
          </span>
        </div>
      </div>
      <div className="hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.25em] items-center">
        <Link href="/vision" className="text-turmeric font-bold hover:opacity-80 transition-all">
          Vision 2030
        </Link>
        <Link href="#focus" className="hover:text-turmeric transition-colors">
          Focus
        </Link>
        <Link href="#sectors" className="hover:text-turmeric transition-colors">
          Sectors
        </Link>
        
        <BubbleSwitch />

        <a
          href="https://discord.gg/yazhi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-turmeric flex items-center gap-2 border-l border-palm-parchment/10 pl-10"
        >
          Discord{" "}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}

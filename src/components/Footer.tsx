"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="bg-[--color-night-soil] py-32 px-6 md:px-20 border-t border-[--color-palm-parchment]/10 relative z-[50]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-10">
            <div className="ack-container">
              <div className="fire-dot"></div>
              <div className="fire-dot"></div>
              <div className="fire-dot"></div>
            </div>
            <div>
              <h2 className="font-dm-serif text-4xl tracking-tighter">Yazhi</h2>
              <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mt-2">
                Vision 2031 | Sovereign Intelligence
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-[--color-turmeric] font-dm-serif text-3xl italic mb-6">
              மொழி உரிமை — Language is a Right
            </div>
            <div className="flex gap-12 justify-center md:justify-end text-[11px] uppercase tracking-[0.3em] opacity-50">
              <a
                href="https://discord.gg/yazhi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Discord Colony
              </a>
              <Link href="#" className="hover:text-white transition-colors">
                Sovereign Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

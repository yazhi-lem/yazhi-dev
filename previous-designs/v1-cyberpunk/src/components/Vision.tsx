"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Vision() {
  return (
    <section id="vision" className="py-40 px-6 md:px-20 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-[--color-turmeric]"></div>
            <span className="text-[--color-turmeric] font-bold uppercase tracking-[0.4em] text-xs">
              Sovereign Future
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl mb-12 leading-none font-dm-serif">Vision 2030.</h2>
          <div className="space-y-10">
            <div className="vision-card p-10 backdrop-blur-md bg-[--color-palm-parchment]/5 border border-[--color-turmeric]/10 hover:bg-[--color-turmeric]/5 hover:border-[--color-turmeric] transition-all duration-500 rounded-sm">
              <h4 className="font-bold text-xl mb-3 tracking-wide text-[--color-turmeric]">
                Phase 1: Outreach & Community
              </h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Building the outreach engine through value-first educational content focusing on the Economics of Tamil Pride.
              </p>
            </div>
            <div className="vision-card p-10 backdrop-blur-md bg-[--color-palm-parchment]/5 border border-[--color-turmeric]/10 hover:bg-[--color-turmeric]/5 hover:border-[--color-turmeric] transition-all duration-500 rounded-sm">
              <h4 className="font-bold text-xl mb-3 tracking-wide text-[--color-turmeric]">
                Phase 2: Scaling the Stack
              </h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Launching the Yazhi SaaS suite for local businesses with high-integrity sales and long-term partnerships.
              </p>
            </div>
            <div className="vision-card p-10 backdrop-blur-md bg-[--color-palm-parchment]/5 border border-[--color-turmeric]/10 hover:bg-[--color-turmeric]/5 hover:border-[--color-turmeric] transition-all duration-500 rounded-sm">
              <h4 className="font-bold text-xl mb-3 tracking-wide text-[--color-turmeric]">
                Phase 3: Total Sovereignty
              </h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Transitioning to a decentralized model where the users and workers own the data and the profits.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="sticky top-32"
        >
          <div className="bg-[--color-palm-parchment]/5 p-14 border border-[--color-turmeric]/20 backdrop-blur-xl rounded-sm">
            <h3 className="text-3xl mb-10 text-[--color-turmeric] font-dm-serif">The Manifesto</h3>
            <p className="text-2xl italic mb-10 opacity-90 leading-snug font-dm-serif">
              &ldquo;The bones of Thenmadurai are our blueprint. No Dravidian speaker shall be forced to choose between their language and their livelihood.&rdquo;
            </p>
            <ul className="space-y-6 text-sm opacity-70 mb-10">
              <li className="flex gap-6 items-start">
                <span className="text-[--color-turmeric] font-bold">—</span> 0% Dependence on non-sovereign models.
              </li>
              <li className="flex gap-6 items-start">
                <span className="text-[--color-turmeric] font-bold">—</span> 100% Community data ownership.
              </li>
              <li className="flex gap-6 items-start">
                <span className="text-[--color-turmeric] font-bold">—</span> Secure local industry mediation via agents.
              </li>
            </ul>

            <div className="flex flex-col gap-4">
              <a 
                href="/yazhi-vision-2030.md" 
                download 
                className="w-full py-4 bg-[--color-turmeric] text-[--color-palm-parchment] font-bold text-center uppercase tracking-widest text-xs hover:bg-[--color-turmeric]/90 transition-all shadow-lg shadow-[--color-turmeric]/10"
              >
                Download Manifesto
              </a>
              <Link 
                href="/vision" 
                className="w-full py-4 border border-[--color-turmeric]/30 text-[--color-turmeric] font-bold text-center uppercase tracking-widest text-xs hover:bg-[--color-turmeric]/5 transition-all"
              >
                Explore Full Vision 2030
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

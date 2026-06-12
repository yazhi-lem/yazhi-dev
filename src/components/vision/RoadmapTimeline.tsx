"use client";

import React from "react";
import { motion } from "framer-motion";

const phases = [
  {
    years: "2024 - 2025",
    title: "The Outreach Engine",
    description: "Build the community through value-first educational content. Focus on \"The Economics of Tamil Pride.\"",
  },
  {
    years: "2026 - 2028",
    title: "Scaling the Stack",
    description: "Launch the Yazhi SaaS suite for local businesses. High-integrity sales focusing on long-term partnerships.",
  },
  {
    years: "2029 - 2030",
    title: "Total Sovereignty",
    description: "Transition to a decentralized model where the users and workers own the data and the profits.",
  },
];

export default function RoadmapTimeline() {
  return (
    <div className="relative pl-12 space-y-24 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[--color-turmeric]/20">
      {phases.map((phase, index) => (
        <motion.div
          key={phase.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          className="relative"
        >
          <div className="absolute -left-[45px] top-0 w-6 h-6 rounded-full bg-[--color-turmeric] shadow-[0_0_15px_var(--color-turmeric)] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[--color-palm-parchment]"></div>
          </div>
          
          <span className="text-[--color-turmeric] font-bold tracking-widest text-xs mb-2 block uppercase">
            {phase.years}
          </span>
          <h3 className="text-3xl font-dm-serif mb-4">{phase.title}</h3>
          <p className="text-lg opacity-70 max-w-2xl leading-relaxed">
            {phase.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

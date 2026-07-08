"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CoreEngineering() {
  return (
    <section id="focus" className="py-40 px-6 md:px-20 bg-[--color-night-soil]/30 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-6xl mb-24 text-center font-dm-serif"
        >
          Core Engineering
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="p-16 border border-[--color-turmeric]/30 bg-[--color-night-soil]/40 backdrop-blur-sm group hover:border-[--color-turmeric] transition-all rounded-sm"
          >
            <div className="text-6xl mb-10 transform group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-4xl mb-8 text-[--color-turmeric] font-dm-serif">Model Agents</h3>
            <p className="text-xl opacity-80 leading-relaxed">
              Autonomous AI agents trained on native linguistic nuances. Capable of complex reasoning, negotiation, and service delivery in local scripts.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-16 border border-[--color-red-clay]/30 bg-[--color-night-soil]/40 backdrop-blur-sm group hover:border-[--color-red-clay] transition-all rounded-sm"
          >
            <div className="text-6xl mb-10 transform group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-4xl mb-8 text-[--color-red-clay] font-dm-serif">Sovereign Security</h3>
            <p className="text-xl opacity-80 leading-relaxed">
              Protecting indigenous knowledge from extractive data mining through federated learning and decentralized script-integrity proofs.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

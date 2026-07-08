"use client";

import React from "react";
import { motion } from "framer-motion";

const MEMBERS = [
  { name: "Zrya", role: "Model Architect", specialty: "Tamil SLM, Fine-tuning" },
  { name: "Arul", role: "Core Systems", specialty: "Decentralized Protocols" },
  { name: "Meena", role: "Interface Designer", specialty: "Dravidian Geometry, UI/UX" },
  { name: "Kavin", role: "Data Strategist", specialty: "Dialect Archival, NLP" },
  { name: "Agent_42", role: "Infrastructure", specialty: "Federated Learning, Scaling" },
  { name: "Senthamilan", role: "Linguist Engineer", specialty: "Ancient Script Processing" },
];

export default function MemberDirectory() {
  return (
    <section id="members" className="py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-dm-serif mb-1">The Guild</h2>
          <p className="text-[10px] opacity-50 uppercase tracking-widest text-palm-parchment">Sovereign Developers of the Collective</p>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 border border-palm-parchment/10 bg-palm-parchment/5 hover:bg-turmeric/5 hover:border-turmeric/20 transition-all group rounded-sm"
            >
              <div className="w-10 h-10 bg-night-soil border border-turmeric/30 rounded-full mb-4 flex items-center justify-center text-[10px] font-bold text-turmeric group-hover:scale-110 transition-transform">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-lg font-dm-serif mb-0.5 group-hover:text-turmeric transition-colors">{member.name}</h3>
              <p className="text-[9px] text-red-clay uppercase tracking-widest mb-3 font-bold">{member.role}</p>
              <p className="text-xs opacity-60 font-light leading-relaxed">
                <span className="text-palm-parchment opacity-100">{member.specialty}</span>
              </p>
            </motion.div>
          ))}
 
          <div className="p-6 border border-dashed border-palm-parchment/20 flex flex-col justify-center items-center text-center rounded-sm hover:border-turmeric/40 transition-colors group cursor-pointer">
            <div className="w-8 h-8 border border-palm-parchment/20 rounded-full flex items-center justify-center mb-3 group-hover:border-turmeric/40">
              <span className="text-lg opacity-40 group-hover:opacity-100">+</span>
            </div>
            <p className="text-[10px] opacity-40 group-hover:opacity-80 uppercase tracking-widest">Join</p>
          </div>
        </div>
      </div>
    </section>
  );
}

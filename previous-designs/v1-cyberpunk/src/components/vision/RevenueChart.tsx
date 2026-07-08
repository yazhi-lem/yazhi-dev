"use client";

import React from "react";
import { motion } from "framer-motion";

const revenueData = [
  { label: "Infrastructure", value: 40, color: "var(--color-turmeric)", description: "B2B APIs for regional language processing." },
  { label: "Creative Commons", value: 30, color: "rgba(255, 184, 76, 0.6)", description: "Subscription-based media with 60% profit sharing." },
  { label: "Ethical Commerce", value: 30, color: "rgba(255, 184, 76, 0.3)", description: "No-tax marketplace for local MSMEs." },
];

export default function RevenueChart() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-4 h-24 w-full">
        {revenueData.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            style={{ width: `${item.value}%`, backgroundColor: item.color }}
            className="h-full relative group cursor-pointer origin-left"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[--color-palm-parchment] font-bold text-lg md:text-2xl">{item.value}%</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {revenueData.map((item) => (
          <div key={item.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
              <h4 className="font-bold uppercase tracking-widest text-xs">{item.label}</h4>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

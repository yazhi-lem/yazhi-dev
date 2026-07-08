"use client";

import React from "react";
import { motion } from "framer-motion";

interface FormulaBoxProps {
  title: string;
  formula: string;
  explanation: string;
  isFraction?: boolean;
  numerator?: string;
  denominator?: string;
}

export default function FormulaBox({ title, formula, explanation, isFraction = false, numerator, denominator }: FormulaBoxProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 bg-[--color-palm-parchment]/5 border border-[--color-turmeric]/20 rounded-sm backdrop-blur-sm"
    >
      <h4 className="text-[--color-turmeric] font-bold uppercase tracking-[0.2em] text-xs mb-8">{title}</h4>
      <div className="text-2xl md:text-4xl font-dm-serif mb-8 leading-relaxed flex items-center">
        {isFraction ? (
          <div className="flex items-center gap-4">
            <span className="text-xl opacity-60">{title.split(' ')[0]} = </span>
            <div className="flex flex-col items-center">
              <span className="border-b border-[--color-soil-dark] dark:border-[--color-palm-parchment] pb-1 px-4">{numerator}</span>
              <span className="pt-1 px-4">{denominator}</span>
            </div>
          </div>
        ) : (
          formula
        )}
      </div>
      <p className="text-sm opacity-60 italic leading-relaxed">
        {explanation}
      </p>
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Sectors() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="sectors" className="py-40 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center text-6xl mb-24 font-dm-serif"
        >
          Industrial Sectors
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="p-12 border border-[--color-palm-parchment]/10 hover:bg-[--color-palm-parchment]/5 transition-all group rounded-sm">
            <h4 className="uppercase tracking-widest text-[10px] font-bold text-[--color-red-clay] mb-6">Sector 01</h4>
            <h3 className="text-3xl mb-8 group-hover:text-[--color-turmeric] transition-colors font-dm-serif">Healthcare</h3>
            <p className="text-base opacity-70">
              Diagnostic sovereignty for rural patients using native medical dialects and traditional healing terminology via agents.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-12 border border-[--color-palm-parchment]/10 hover:bg-[--color-palm-parchment]/5 transition-all group rounded-sm">
            <h4 className="uppercase tracking-widest text-[10px] font-bold text-[--color-red-clay] mb-6">Sector 02</h4>
            <h3 className="text-3xl mb-8 group-hover:text-[--color-turmeric] transition-colors font-dm-serif">Real Estate</h3>
            <p className="text-base opacity-70">
              Securing land titles and heritage property rights through script-aware verification and community land-ledger systems.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-12 border border-[--color-palm-parchment]/10 hover:bg-[--color-palm-parchment]/5 transition-all group rounded-sm">
            <h4 className="uppercase tracking-widest text-[10px] font-bold text-[--color-red-clay] mb-6">Sector 03</h4>
            <h3 className="text-3xl mb-8 group-hover:text-[--color-turmeric] transition-colors font-dm-serif">Agriculture</h3>
            <p className="text-base opacity-70">
              Transfer of heirloom farming techniques and native market access via autonomous linguistic representatives.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

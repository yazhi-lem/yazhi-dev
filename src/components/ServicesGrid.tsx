"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: "🤖", tamil: "முகவர்கள்", eng: "Agents", desc: "AI agents for Tamil tasks" },
    { icon: "⚡", tamil: "செயலிகள்", eng: "Applications", desc: "Tamil applications" },
    { icon: "📝", tamil: "விளக்கங்கள்", eng: "Annotations", desc: "Quality datasets" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="tamil-title text-7xl mb-6"
          style={{ color: 'var(--text)' }}
        >
          எங்கள் சேவைகள்
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-2xl mb-16 font-semibold"
          style={{ color: 'var(--text-soft)' }}
        >
          Our Services • தமிழ் செயற்கை நுண்ணறிவு சூழல்
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-8 rounded-xl transition-all hover:scale-105"
              style={{ background: 'var(--surface)' }}
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="tamil-title text-3xl mb-2" style={{ color: 'var(--text)' }}>
                {service.tamil}
              </h3>
              <p className="text-xl font-bold mb-3" style={{ color: 'var(--accent)' }}>
                {service.eng}
              </p>
              <p className="font-medium" style={{ color: 'var(--text-soft)' }}>
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://discord.gg/yazhi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-tamil)',
            }}
          >
            எங்கள் சமூகத்தில் சேருங்கள்
          </a>
        </motion.div>
      </div>
    </section>
  );
}

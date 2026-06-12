"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: "🤖",
      title: "Agents",
      desc: "AI agents for Tamil language tasks",
    },
    {
      icon: "⚡",
      title: "Applications",
      desc: "Production-ready Tamil apps",
    },
    {
      icon: "📝",
      title: "Annotations",
      desc: "High-quality datasets",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden theme-transition"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-6xl font-black mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Our Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-2xl mb-16 font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Complete ecosystem for Tamil AI
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-8 rounded-xl transition-all hover:scale-105"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
                {service.title}
              </h3>
              <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
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
            className="inline-block px-10 py-4 font-bold text-lg rounded-full transition-all hover:scale-105"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            Join Our Community
          </a>
        </motion.div>
      </div>
    </section>
  );
}

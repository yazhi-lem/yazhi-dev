"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      category: "Agents",
      icon: "🤖",
      title: "AI Agents",
      description: "Autonomous agents powered by Adhan for Tamil language tasks",
      features: [
        "Content moderation",
        "Translation services",
        "Conversational AI",
        "Document processing",
      ],
      color: "turmeric",
      gradient: "from-turmeric/20 to-red-clay/10",
    },
    {
      category: "Applications",
      icon: "⚡",
      title: "Tamil Apps",
      description: "Production-ready applications built on our sovereign stack",
      features: [
        "Yazh Guardian companion",
        "Sangam poetry explorer",
        "Language learning tools",
        "Cultural preservation",
      ],
      color: "neem-leaf",
      gradient: "from-neem-leaf/20 to-turmeric/10",
    },
    {
      category: "Annotations",
      icon: "📝",
      title: "Data Services",
      description: "High-quality Tamil datasets and annotation pipelines",
      features: [
        "Linguistic annotation",
        "Sentiment labeling",
        "Named entity recognition",
        "Cultural context tags",
      ],
      color: "red-clay",
      gradient: "from-red-clay/20 to-neem-leaf/10",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF3E0 0%, #FEF9F3 100%)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-turmeric/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neem-leaf/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, rgba(196, 149, 106, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-16 h-[1px] bg-turmeric/40"></div>
            <span className="text-turmeric text-xs font-bold uppercase tracking-[0.5em]">
              Our Services
            </span>
            <div className="w-16 h-[1px] bg-turmeric/40"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-palm-parchment text-5xl md:text-7xl mb-6 leading-[0.9] tracking-tighter font-dm-serif"
          >
            Agents, Applications
            <span className="block text-turmeric italic mt-2">& Annotations</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-palm-parchment/70 text-lg md:text-xl max-w-3xl mx-auto font-light"
          >
            Complete ecosystem of Tamil-first services, from intelligent agents to production applications and curated datasets
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.2 }}
              className="group relative"
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${service.gradient} backdrop-blur-sm border border-${service.color}/30 rounded-xl p-8 hover:border-${service.color}/60 transition-all duration-300 h-full`}>
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10 rounded-xl`} />

                {/* Category tag */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.9 + i * 0.2, type: "spring" }}
                  className={`inline-block px-4 py-1 rounded-full bg-${service.color}/20 border border-${service.color}/40 mb-6`}
                >
                  <span className={`text-${service.color} text-xs font-bold uppercase tracking-wider`}>
                    {service.category}
                  </span>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="text-6xl mb-6"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  {service.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-palm-parchment text-2xl md:text-3xl font-dm-serif mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-palm-parchment/70 text-sm md:text-base mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.2 + i * 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 text-palm-parchment/60 text-sm"
                    >
                      <div className={`w-1.5 h-1.5 bg-${service.color} rounded-full flex-shrink-0`} />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.2 }}
                  className={`mt-8 w-full py-3 border border-${service.color}/40 text-${service.color} rounded-lg hover:bg-${service.color}/10 transition-all font-bold text-sm`}
                >
                  Explore {service.category}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-center mt-20"
        >
          <p className="text-palm-parchment/60 text-lg mb-6">
            Ready to build with Tamil-first AI?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/yazhi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-turmeric text-night-soil px-10 py-4 text-sm font-bold rounded-lg hover:bg-palm-parchment transition-all shadow-lg hover:shadow-turmeric/30"
            >
              Join Our Community
            </a>
            <button className="border border-palm-parchment/30 text-palm-parchment px-10 py-4 text-sm font-bold rounded-lg hover:bg-white/5 transition-all">
              View Documentation
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-turmeric/40 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </section>
  );
}

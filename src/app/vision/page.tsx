"use client";

import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import RevenueChart from "@/components/vision/RevenueChart";
import FormulaBox from "@/components/vision/FormulaBox";
import RoadmapTimeline from "@/components/vision/RoadmapTimeline";

export default function VisionPage() {
  return (
    <main className="bg-[--color-palm-parchment] text-[--color-soil-dark] dark:bg-[--color-soil-dark] dark:text-[--color-palm-parchment] transition-colors duration-500 overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 md:px-20 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-[--color-turmeric]"></div>
              <span className="text-[--color-turmeric] font-bold uppercase tracking-[0.4em] text-xs">
                Movement-Led Enterprise
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-dm-serif mb-12 leading-none">
              Vision <span className="text-[--color-turmeric]">2030.</span>
            </h1>
            <p className="text-2xl md:text-4xl opacity-80 max-w-4xl font-dm-serif leading-tight">
              By 2030, Yazhi will be the definitive digital gateway for Tamil-first and regional-first economic activity.
            </p>
          </motion.div>
        </div>
        
        {/* Subtle Background Radial */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[--color-turmeric]/5 to-transparent pointer-events-none"></div>
      </section>

      {/* Core Principles */}
      <section className="py-32 px-6 md:px-20 border-y border-[--color-turmeric]/10 bg-[--color-turmeric]/2 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-dm-serif mb-12">The Sovereign Ecosystem</h2>
            <div className="space-y-8 text-lg opacity-80 leading-relaxed">
              <p>
                We are not a "platform"; we are a movement. Our goal is to dismantle the digital-colonial grip of Big Tech by providing high-scale tools that respect Language Sovereignty.
              </p>
              <p>
                Yazhi Vision 2030 ensures that the next 100 million Indians entering the workforce do not need to learn English to use high-level ERP or Sales tools.
              </p>
            </div>
          </div>
          <div className="bg-[--color-turmeric]/5 p-12 border-l-2 border-[--color-turmeric] backdrop-blur-md">
            <h3 className="text-2xl font-dm-serif mb-8 text-[--color-turmeric]">The Cultural Moat</h3>
            <ul className="space-y-6 opacity-70">
              <li className="flex gap-4">
                <span className="text-[--color-turmeric] font-bold">01</span>
                <span>World's most robust Tamil-centric Neural Networks.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[--color-turmeric] font-bold">02</span>
                <span>Decolonized interfaces for vernacular-first labor.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[--color-turmeric] font-bold">03</span>
                <span>Native "thinking" vs global "translation".</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sector Economics */}
      <section className="py-32 px-6 md:px-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-dm-serif mb-4">Sector Economics</h2>
            <div className="h-1 w-20 bg-[--color-turmeric] mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-32">
            <FormulaBox 
              title="Financial Integrity Formula"
              formula="LTV/CAC"
              isFraction={true}
              numerator="LTV (adjusted)"
              denominator="CAC (organic)"
              explanation="Lifetime Value (Adjusted for Community Retention) divided by Cost of Acquisition (Organic Content Led)."
            />
            <FormulaBox 
              title="Burn Rate Management"
              formula="Monthly Burn"
              isFraction={true}
              numerator="Labor + Infra"
              denominator="Gross Revenue"
              explanation="Sustain a 12-month runway through community-backed bonds rather than dilutive equity rounds."
            />
          </div>

          <div className="space-y-16">
            <h3 className="text-2xl font-dm-serif text-center mb-12">Target 2030 Revenue Structure</h3>
            <div className="max-w-4xl mx-auto">
              <RevenueChart />
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-32 px-6 md:px-20 bg-[--color-soil-dark] text-[--color-palm-parchment] dark:bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-5xl font-dm-serif mb-12">Strategic Roadmap</h2>
            <p className="text-xl opacity-70 mb-12 leading-relaxed">
              Our path to total sovereignty is built on three distinct phases of growth and community integration.
            </p>
            <div className="p-10 border border-[--color-turmeric]/30 bg-[--color-turmeric]/5">
              <h4 className="text-[--color-turmeric] font-bold uppercase tracking-widest text-xs mb-4">Strategic Pivot</h4>
              <p className="italic opacity-80 leading-relaxed text-lg">
                "Business is a form of social organizing. Let us organize for the many, not the few."
              </p>
            </div>
          </div>
          <div className="pt-8">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-32 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-dm-serif mb-6">The Yazhi Guild</h2>
            <p className="text-xl opacity-70">Rejecting "Shark" hierarchies for federated worker cooperatives.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "ESOPs for All", desc: "Every permanent worker is a shareholder." },
              { title: "Open-Book Management", desc: "Real-time financial dashboards accessible to all." },
              { title: "Strategic Alignment", desc: "Integration with DPI (UPI/ONDC) and TN Startup Policy." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 bg-[--color-turmeric]/2 border border-[--color-turmeric]/10 hover:border-[--color-turmeric] transition-all rounded-sm"
              >
                <h4 className="text-xl font-dm-serif mb-4 text-[--color-turmeric]">{item.title}</h4>
                <p className="opacity-70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 md:px-20 text-center border-t border-[--color-turmeric]/10 bg-[--color-turmeric]/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-dm-serif mb-12 leading-tight">Join the Sovereignty.</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a 
              href="/yazhi-vision-2030.md" 
              download 
              className="px-12 py-6 bg-[--color-turmeric] text-[--color-palm-parchment] font-bold uppercase tracking-[0.3em] text-sm hover:opacity-90 transition-all shadow-xl shadow-[--color-turmeric]/10"
            >
              Download Manifesto
            </a>
            <a 
              href="https://discord.gg/yazhi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 border border-[--color-turmeric]/40 text-[--color-turmeric] font-bold uppercase tracking-[0.3em] text-sm hover:bg-[--color-turmeric]/5 transition-colors"
            >
              Join the Guild
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

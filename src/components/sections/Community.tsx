"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { COMMUNITY, DEVELOPERS, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

export function Community() {
  return (
    <Section id="community" fullHeight className="py-6 sm:py-8 lg:py-10">
      <div className="text-scrim max-w-4xl">
        <SectionHeading
          thinaiTa="நெய்தல்"
          thinaiEn="Neytal"
          landscapeTa="கடற்கரை · இரங்கல்"
          landscape="Coastal · separation, pining"
          titleTa={COMMUNITY.titleTa}
          titleEn={COMMUNITY.titleEn}
          subTa={COMMUNITY.subTa}
          subEn={COMMUNITY.subEn}
          plainTa={COMMUNITY.plainTa}
          plainEn={COMMUNITY.plainEn}
          className="mb-3.5"
        />
      </div>

      {/* Main Asymmetric Grid: Unified Builder & Developer Network (7 cols) + Living Channels (5 cols) */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-3.5 grid gap-4 lg:grid-cols-12 items-stretch"
      >
        {/* Left Column (7 cols): Unified Builder, Contributor & Developer Network Showcase */}
        <motion.div
          variants={fadeUp}
          className="glass-card relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border-l-2 border-l-[color:var(--accent)] p-5 sm:p-6 lg:col-span-7"
        >
          {/* Subtle ambient spotlight behind art */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)",
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <Bi
                as="p"
                ta={DEVELOPERS.eyebrowTa}
                en={DEVELOPERS.eyebrowEn}
                className="flex gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[color:var(--accent)]"
                separator={<span aria-hidden>·</span>}
              />
              <Bi
                as="span"
                ta="சமூகமும் நிரலும்"
                en="Community & Code"
                className="font-mono text-[9px] text-gold/85 uppercase tracking-wider rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5"
              />
            </div>

            <Bi
              as="h3"
              ta={DEVELOPERS.titleTa}
              en={DEVELOPERS.titleEn}
              className="mt-1 flex flex-col font-display text-lg sm:text-xl font-bold text-ivory sm:flex-row sm:gap-2"
              separator={<span aria-hidden className="hidden sm:inline">·</span>}
            />

            {/* Mascot Developer Community Artwork (seamless organic blend, no box, no border) */}
            <div className="relative -mx-2 my-2 flex items-center justify-center select-none sm:-mx-3">
              {/* Soft ambient atmospheric glow blending naturally into the glass card */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 h-36 -z-10 rounded-full opacity-35 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 55%, transparent), transparent 75%)",
                }}
              />
              <Image
                src="/images/mascot/Yazhi-dev-com.png"
                alt="Yazhi Developer Community — Indic AI builders, models, and native language tools"
                width={1882}
                height={836}
                priority
                className="relative z-10 w-full max-h-[175px] sm:max-h-[205px] object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>

            <Bi
              as="p"
              ta={DEVELOPERS.bodyTa}
              en={DEVELOPERS.bodyEn}
              className="text-xs leading-relaxed text-ivory-dim flex flex-col gap-1.5"
            />

            {/* Feature Tags / Focus Areas */}
            <div className="mt-3.5 flex flex-wrap gap-1.5 font-mono text-[10px] text-ivory-dim/80">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                <Bi ta="⚡ திறந்த மாதிரி & அதன்" en="⚡ Open Weights & Adhan" />
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                <Bi ta="📜 சங்க இலக்கியத் தரவுகள்" en="📜 Sangam Corpus Datasets" />
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                <Bi ta="🔍 தாய்மொழி உரை விளக்கங்கள்" en="🔍 Native Language Annotations" />
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                <Bi ta="🤖 இந்திய முகவர் வழிமுறைகள்" en="🤖 Indic Agent Pipelines" />
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <Button href={DEVELOPERS.ctaHref}>
              <Bi
                ta={DEVELOPERS.ctaTa}
                en={DEVELOPERS.ctaEn}
                className="flex gap-1.5 font-medium"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
            <span className="font-mono text-[10px] text-ivory-dim/60">
              /onboarding?track=developer
            </span>
          </div>
        </motion.div>

        {/* Right Column (5 cols): Living Community Channels (Discord & GitHub) */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-5">
          {/* Channel 1: Discord Town Square */}
          <motion.div
            variants={fadeUp}
            className="glass-card group flex flex-1 flex-col justify-between rounded-[var(--radius-card)] border border-white/10 p-5 transition-colors hover:border-[#5865F2]/50 hover:bg-[#5865F2]/[0.04]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5865F2]">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <Bi
                    as="span"
                    ta="மன்றம்"
                    en="Town Square"
                    className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5865F2]"
                  />
                </div>
                <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Bi ta="நேரலை அரட்டை" en="Live Chat" />
                </span>
              </div>

              <Bi
                as="h4"
                ta={COMMUNITY.discord.titleTa}
                en={COMMUNITY.discord.titleEn}
                className="mt-2.5 flex flex-col font-display text-base font-semibold text-ivory"
              />
              <Bi
                as="p"
                ta={COMMUNITY.discord.bodyTa}
                en={COMMUNITY.discord.bodyEn}
                className="mt-1 text-xs text-ivory-dim/85 leading-relaxed"
              />
            </div>

            <div className="mt-4">
              <Button href={COMMUNITY.discord.href} variant="ghost" external className="w-full text-center text-xs py-1.5 group-hover:border-[#5865F2]/40 group-hover:text-ivory">
                {COMMUNITY.discord.label}
              </Button>
            </div>
          </motion.div>

          {/* Channel 2: GitHub Open Source Repositories */}
          <motion.div
            variants={fadeUp}
            className="glass-card group flex flex-1 flex-col justify-between rounded-[var(--radius-card)] border border-white/10 p-5 transition-colors hover:border-gold/50 hover:bg-gold/[0.03]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ivory">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <Bi
                    as="span"
                    ta="திறந்த மூலம்"
                    en="Open Source"
                    className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ivory-dim"
                  />
                </div>
                <span className="font-mono text-[9px] text-gold/80">
                  Apache 2.0 / MIT
                </span>
              </div>

              <Bi
                as="h4"
                ta={COMMUNITY.github.titleTa}
                en={COMMUNITY.github.titleEn}
                className="mt-2.5 flex flex-col font-display text-base font-semibold text-ivory"
              />
              <Bi
                as="p"
                ta={COMMUNITY.github.bodyTa}
                en={COMMUNITY.github.bodyEn}
                className="mt-1 text-xs text-ivory-dim/85 leading-relaxed"
              />
            </div>

            <div className="mt-4">
              <Button href={COMMUNITY.github.href} variant="ghost" external className="w-full text-center text-xs py-1.5 group-hover:border-gold/40 group-hover:text-ivory">
                {COMMUNITY.github.label}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Row: Family Age Disclaimer */}
      <div className="mt-4 flex items-center justify-between">
        <Bi
          as="p"
          ta={COMMUNITY.chatAgeTa}
          en={COMMUNITY.chatAgeEn}
          className="flex flex-col sm:flex-row gap-1 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-ivory-dim/70"
        />
      </div>
    </Section>
  );
}

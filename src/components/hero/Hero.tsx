"use client";
import { motion } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { IDENTITY, UI } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

/** The hero: one focused idea per viewport — eyebrow, headline, subtitle,
    scroll cue. The constellation set-piece and the Bharathiyar quote used
    to live here too; they now have their own room to breathe in
    HeroSignature, rendered directly after this section. See yazhi-dev
    issue: "Hero section is visually cluttered". */
export function Hero() {
  const { lang } = useLang();

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-24">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div variants={fadeUp}>
          <Bi
            as="p"
            ta={UI.heroEyebrow.ta}
            en={UI.heroEyebrow.en}
            className="mb-5 flex flex-col gap-0.5 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Bi
            as="h1"
            display
            ta={IDENTITY.taglineTa}
            en={IDENTITY.taglineEn}
            className="flex flex-col items-center gap-3"
            taClass="font-display text-[length:var(--text-4xl)] font-bold sm:text-[length:var(--text-5xl)]"
            enClass={
              lang === "en"
                ? "font-display text-[length:var(--text-3xl)] font-bold sm:text-[length:var(--text-4xl)]"
                : "text-[length:var(--text-lg)] uppercase tracking-[0.25em] text-ivory-dim"
            }
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6">
          <Bi as="p" ta={IDENTITY.fullTa} en={IDENTITY.fullEn} className="flex flex-col gap-1 text-ivory-dim" />
        </motion.div>
      </motion.div>

      <motion.a
        href="#adhan"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="scroll-cue relative z-10 mt-16 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-ivory-dim transition-colors hover:text-ivory"
      >
        <Bi ta={UI.scrollCue.ta} en={UI.scrollCue.en} className="flex flex-col items-center gap-0.5" />
        <span aria-hidden className="scroll-cue-arrow">↓</span>
      </motion.a>
    </section>
  );
}

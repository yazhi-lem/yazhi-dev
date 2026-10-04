"use client";
import { motion } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { IDENTITY, UI } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

/** The hero: one focused idea per viewport — eyebrow, headline, subtitle,
    scroll cue. Everything else that used to crowd it (the constellation
    set-piece, the Bharathiyar quote) has been removed; the Yazhi section
    directly below now carries the first real proof-point. */
export function Hero() {
  const { lang } = useLang();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 pt-16 pb-8"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="text-scrim relative z-10 mx-auto max-w-6xl w-full text-center"
      >
        <motion.div variants={fadeUp}>
          <Bi
            as="p"
            ta={UI.heroEyebrow.ta}
            en={UI.heroEyebrow.en}
            className="mb-3 flex flex-col gap-0.5 text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[color:var(--accent)]"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Bi
            as="h1"
            display
            ta={IDENTITY.taglineTa}
            en={IDENTITY.taglineEn}
            className="flex flex-col items-center gap-2 sm:gap-2.5 max-w-5xl mx-auto"
            taClass="font-display text-[length:var(--text-hero-ta)] font-bold tracking-tight text-ivory leading-[1.2]"
            enClass={
              lang === "en"
                ? "font-display text-[length:var(--text-hero)] font-bold tracking-tight text-ivory leading-[1.08]"
                : "text-[length:var(--text-subhead)] uppercase tracking-[0.2em] text-ivory-dim"
            }
          />
        </motion.div>

        {/* the founding deck's own line under the wordmark */}
        <motion.div variants={fadeUp} className="mt-3.5">
          <Bi
            as="p"
            ta={IDENTITY.heroLineTa}
            en={IDENTITY.heroLineEn}
            className="mx-auto max-w-3xl text-[length:var(--text-subhead)] leading-relaxed text-ivory-dim"
          />
        </motion.div>

        {/* the plain-language layer — one sentence a ten-year-old can read */}
        <motion.div variants={fadeUp} className="mt-2">
          <Bi
            as="p"
            ta={IDENTITY.plainTa}
            en={IDENTITY.plainEn}
            className="mx-auto flex max-w-2xl flex-col gap-0.5 text-xs sm:text-sm text-ivory-dim/90 leading-relaxed"
          />
        </motion.div>
      </motion.div>

      <motion.a
        href="#yazhi"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="scroll-cue relative z-10 mt-8 sm:mt-10 flex flex-col items-center gap-1.5 text-xs font-mono uppercase tracking-[0.25em] text-ivory-dim transition-colors hover:text-ivory"
      >
        <Bi ta={UI.scrollCue.ta} en={UI.scrollCue.en} className="flex flex-col items-center gap-0.5" />
        <span aria-hidden className="scroll-cue-arrow text-sm">↓</span>
      </motion.a>
    </section>
  );
}


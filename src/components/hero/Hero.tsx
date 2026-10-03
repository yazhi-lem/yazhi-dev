"use client";
import { motion } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { HERO, UI } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

/** One idea per viewport: Yazhi 2030, the platform line, "we begin
    with Tamil", two actions. Tamil leads; English is the quiet gloss. */
export function Hero() {
  const { lang } = useLang();
  const glossOnly = lang === "both";

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div variants={fadeUp}>
          <Bi
            as="p" ta={HERO.eyebrowTa} en={HERO.eyebrowEn}
            className="mb-6 inline-flex gap-2 text-sm text-[color:var(--accent)]"
            separator={<span aria-hidden>·</span>}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Bi
            as="h1" display ta={HERO.titleTa} en={HERO.titleEn}
            className="flex flex-col items-center gap-4"
            // sized so the longest word (மொழிகளுக்குமான, 11.33em wide) never
            // overflows: (viewport − 3rem side padding) / 11.6 ≈ 29px on a
            // 390px phone, 23px at 320px, capped at --text-5xl on desktop
            taClass="font-display text-[length:min(var(--text-5xl),calc((100vw_-_3rem)/11.6))] font-bold leading-snug"
            enClass={
              glossOnly
                ? "text-[length:var(--text-lg)] text-ivory-dim"
                : "font-display text-[length:var(--text-3xl)] font-bold sm:text-[length:var(--text-5xl)]"
            }
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6">
          <Bi as="p" ta={HERO.leadTa} en={HERO.leadEn} className="flex flex-col gap-1 text-[length:var(--text-lg)] text-ivory" enClass={glossOnly ? "text-base text-ivory-dim" : ""} />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={HERO.primaryHref}>
            <Bi ta={HERO.primaryTa} en={HERO.primaryEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
          </Button>
          <Button href={HERO.secondaryHref} variant="ghost">
            <Bi ta={HERO.secondaryTa} en={HERO.secondaryEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
          </Button>
        </motion.div>
      </motion.div>

      <a
        href="#vision"
        className="relative z-10 mt-16 flex flex-col items-center gap-2 text-xs text-ivory-dim transition-colors hover:text-ivory"
      >
        <Bi ta={UI.scrollCue.ta} en={UI.scrollCue.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        <span aria-hidden className="scroll-cue-arrow">↓</span>
      </a>
    </section>
  );
}

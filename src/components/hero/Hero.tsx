"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Constellation } from "./Constellation";
import { Bi } from "@/components/ui/Bi";
import { HERO_QUOTE, IDENTITY, UI } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();

  // Scroll-scrubbed set-piece: the constellation recedes as Kurinji
  // gives way to the forest of Mullai.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-orbit]", {
        scale: 0.82,
        opacity: 0.25,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-24">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div variants={fadeUp}>
          <Bi
            as="p"
            ta={UI.heroEyebrow.ta}
            en={UI.heroEyebrow.en}
            className="mb-4 flex flex-col gap-0.5 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Bi
            as="h1"
            display
            ta={IDENTITY.taglineTa}
            en={IDENTITY.taglineEn}
            className="flex flex-col items-center gap-2"
            taClass="font-display text-[length:var(--text-4xl)] font-bold sm:text-[length:var(--text-5xl)]"
            enClass={
              lang === "en"
                ? "font-display text-[length:var(--text-3xl)] font-bold sm:text-[length:var(--text-4xl)]"
                : "text-[length:var(--text-lg)] uppercase tracking-[0.25em] text-ivory-dim"
            }
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-4">
          <Bi as="p" ta={IDENTITY.fullTa} en={IDENTITY.fullEn} className="flex flex-col gap-1 text-ivory-dim" />
        </motion.div>
      </motion.div>

      <motion.div data-hero-orbit variants={fadeUp} initial="hidden" animate="show" className="relative z-0 mt-8 w-full">
        <Constellation />
      </motion.div>

      {/* Bharathiyar — verbatim, correctly attributed. The Tamil line always
          renders (it is the artefact itself); the translation follows the
          language mode. */}
      <motion.blockquote
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 mt-10 max-w-2xl border-l-2 border-gold/60 pl-5 text-left"
      >
        <p lang="ta" className="font-display text-[length:var(--text-lg)] text-ivory">
          “{HERO_QUOTE.ta}”
        </p>
        {lang !== "ta" && (
          <p lang="en" className="mt-2 text-sm italic text-ivory-dim">
            “{HERO_QUOTE.en}”
          </p>
        )}
        <cite className="mt-3 block text-xs not-italic tracking-widest text-gold">
          — {lang === "en" ? HERO_QUOTE.attributionEn : HERO_QUOTE.attributionTa}
        </cite>
      </motion.blockquote>

      <a
        href="#adhan"
        className="scroll-cue relative z-10 mb-8 mt-12 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-ivory-dim transition-colors hover:text-ivory"
      >
        <Bi ta={UI.scrollCue.ta} en={UI.scrollCue.en} className="flex flex-col items-center gap-0.5" />
        <span aria-hidden className="scroll-cue-arrow">↓</span>
      </a>
    </section>
  );
}

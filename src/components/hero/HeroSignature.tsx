"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Constellation } from "./Constellation";
import { HERO_QUOTE } from "@/lib/content";
import { fadeUp } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

/** The hero's "signature" beat: the multi-script constellation and the
    Bharathiyar quote, given their own breathing room below the fold
    instead of being crammed into the hero's first viewport (see
    yazhi-dev issue: "Hero section is visually cluttered"). Splitting
    this out means the hero itself can stay to a single, focused idea —
    eyebrow, headline, subtitle, scroll cue — while this section carries
    the proof-point (the model) and the emotional anchor (the quote) as
    a deliberate second beat. */
export function HeroSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-signature-orbit]", {
        scale: 0.9,
        opacity: 0.4,
        y: 40,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 40%", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-12 px-5 py-[var(--space-section)] text-center">
      <div data-signature-orbit className="w-full">
        <Constellation />
      </div>

      {/* Bharathiyar — verbatim, correctly attributed. The Tamil line always
          renders (it is the artefact itself); the translation follows the
          language mode. Kept subtle and left-aligned so it reads as a
          quiet citation rather than another competing headline. */}
      <motion.blockquote
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-xl border-l-2 border-gold/40 pl-5 text-left"
      >
        <p lang="ta" className="font-display text-[length:var(--text-lg)] text-ivory/90">
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
    </div>
  );
}

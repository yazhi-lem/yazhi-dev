"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Constellation } from "./Constellation";
import { HERO_QUOTE } from "@/lib/content";
import { fadeUp } from "@/lib/motionPresets";
import { useLang, useText, resolveIndic } from "@/lib/i18n";
import { Bi } from "@/components/ui/Bi";

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
  const { mode, indic } = useLang();
  const t = useText();
  // the quote's translation of record: English in ENG mode, otherwise the
  // visitor's language (falling back to English until it's translated)
  const translation =
    mode === "en"
      ? { value: HERO_QUOTE.translation.en, lang: "en" }
      : resolveIndic(HERO_QUOTE.translation, indic);

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
          renders (it is the artefact itself); the conversational lead-in and
          the translation follow the visitor's language. Kept subtle and
          left-aligned so it reads as a quiet citation rather than another
          competing headline. */}
      <motion.blockquote
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-xl border-l-2 border-gold/40 pl-5 text-left"
      >
        <Bi as="p" text={HERO_QUOTE.intro} className="mb-3 flex flex-col gap-0.5 text-xs uppercase tracking-widest text-ivory-dim" />
        <p lang="ta" className="font-display text-[length:var(--text-lg)] text-ivory/90">
          “{HERO_QUOTE.ta}”
        </p>
        {translation.value !== HERO_QUOTE.ta && (
          <p lang={translation.lang} className="mt-2 text-sm italic text-ivory-dim">
            “{translation.value}”
          </p>
        )}
        <cite className="mt-3 block text-xs not-italic tracking-widest text-gold">
          — {t(HERO_QUOTE.attribution)}
        </cite>
      </motion.blockquote>
    </div>
  );
}

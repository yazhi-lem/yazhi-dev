"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Constellation } from "./Constellation";

/** The hero's "signature" beat: the multi-script constellation, given its
    own breathing room below the fold instead of being crammed into the
    hero's first viewport (see yazhi-dev issue: "Hero section is visually
    cluttered"). Splitting this out means the hero itself can stay to a
    single, focused idea — eyebrow, headline, subtitle, scroll cue — while
    this section carries the proof-point (the model) as a deliberate
    second beat. */
export function HeroSignature() {
  const ref = useRef<HTMLDivElement>(null);

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
    </div>
  );
}

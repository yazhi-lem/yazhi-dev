"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GUARDIAN } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";
import { fadeUp, stagger } from "@/lib/motionPresets";

/** Palai (desert · hardship) governs Yazh Guardian: the guardian is the
    figure who endures the harsh terrain to protect what crosses it. The
    guardian motif is rendered as an SVG mark derived from temple-pillar
    yazhi silhouettes — mane, tusk, coiled body — kept abstract enough to
    stay a mark, not an illustration. */
export function Guardian() {
  // Probe for the Yazhi character art: show it only once it successfully
  // loads, otherwise keep the abstract SVG mark. No broken-image flash
  // before public/yazhi.png is added.
  const [hasArt, setHasArt] = useState(false);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHasArt(true);
    img.src = "/yazhi.png";
  }, []);
  return (
    <Section id="guardian">
      <SectionHeading eyebrow={GUARDIAN.eyebrow} title={GUARDIAN.name} sub={GUARDIAN.sub} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(260px,380px)]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.div variants={fadeUp}>
            <Bi as="p" text={GUARDIAN.body} className="flex max-w-prose flex-col gap-3 text-ivory-dim" />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button href={GUARDIAN.ctaHref}>
              <Bi text={GUARDIAN.cta} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Guardian — the Yazhi character art, or the abstract mark as fallback */}
        <motion.figure
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mx-auto"
        >
          {hasArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/yazhi.png"
              alt="Yazhi — mythical guardian"
              className="mx-auto h-56 w-56 object-contain drop-shadow-[0_12px_34px_rgba(0,0,0,0.45)] sm:h-72 sm:w-72"
            />
          ) : (
            <svg
              viewBox="0 0 200 200" role="img" aria-label="Abstract yazhi guardian mark"
              className="h-56 w-56 sm:h-72 sm:w-72"
            >
              <defs>
                <linearGradient id="yz" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" />
                  <stop offset="100%" stopColor="var(--palai)" />
                </linearGradient>
              </defs>
              {/* coiled body */}
              <path d="M100 178c-42 0-72-30-72-68 0-40 32-70 72-70 30 0 54 20 54 46 0 22-17 38-40 38-17 0-29-11-29-26 0-11 8-19 19-19"
                fill="none" stroke="url(#yz)" strokeWidth="7" strokeLinecap="round" />
              {/* mane arcs */}
              <path d="M52 60c-8 12-12 26-12 40" fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
              <path d="M66 44c-10 9-17 20-21 33" fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              {/* tusk */}
              <path d="M144 66c10-8 14-18 12-30" fill="none" stroke="var(--ivory)" strokeWidth="5" strokeLinecap="round" />
              {/* eye */}
              <circle cx="128" cy="78" r="5" fill="var(--gold)" />
            </svg>
          )}
          <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-ivory-dim">
            யாழி · temple guardian
          </figcaption>
        </motion.figure>
      </div>
    </Section>
  );
}

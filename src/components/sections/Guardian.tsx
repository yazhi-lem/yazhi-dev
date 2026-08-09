"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GUARDIAN, LINKS } from "@/lib/content";
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
      <SectionHeading
        thinaiTa="பாலை" thinaiEn="Palai" landscapeTa="பாலைவனம் · பிரிதல்" landscape="Desert · hardship endured"
        titleTa={GUARDIAN.nameTa} titleEn={GUARDIAN.nameEn}
        subTa={GUARDIAN.subTa} subEn={GUARDIAN.subEn}
        plainTa={GUARDIAN.plainTa} plainEn={GUARDIAN.plainEn}
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(260px,380px)]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.p variants={fadeUp} lang="en" className="max-w-prose text-ivory-dim">
            {GUARDIAN.bodyEn}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button href={GUARDIAN.ctaHref}>
              <Bi ta={GUARDIAN.ctaTa} en={GUARDIAN.ctaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
            <Button href={LINKS.whatsapp} variant="ghost" external>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.486 2 2.01 6.477 2.01 11.995c0 1.997.583 3.855 1.588 5.418L2 22l4.71-1.564a9.947 9.947 0 0 0 5.294 1.517h.004c5.518 0 9.994-4.477 9.994-9.995C21.998 6.477 17.522 2.001 12.004 2Zm0 18.16h-.003a8.15 8.15 0 0 1-4.163-1.14l-.298-.177-3.114 1.033 1.048-3.033-.194-.312a8.146 8.146 0 0 1-1.258-4.353c0-4.518 3.66-8.187 8.176-8.187 2.183 0 4.234.85 5.777 2.393a8.117 8.117 0 0 1 2.394 5.788c0 4.518-3.66 8.188-8.365 8.188Z" />
              </svg>
              <Bi ta={GUARDIAN.whatsappCtaTa} en={GUARDIAN.whatsappCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 max-w-prose text-xs text-ivory-dim/80">
            <Bi ta={GUARDIAN.whatsappNoteTa} en={GUARDIAN.whatsappNoteEn} className="flex flex-col gap-0.5" />
          </motion.p>
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

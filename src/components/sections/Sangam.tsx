"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SANGAM, MADURAI_KANCHI } from "@/lib/content";
import { stagger } from "@/lib/motionPresets";

/** Open Sangam — the memory we protect (deck p7 · 03). Marutham governs
    it by the brand file's own sub-line. The five thinai it classifies
    against get their own section (Thinai) directly after this one. */
export function Sangam() {
  return (
    <Section id="sangam">
      <SectionHeading
        thinaiTa="மருதம்" thinaiEn="Marutham" landscapeTa="வயல் · விளை நிலம்" landscape="Agriculture · fertile land"
        titleTa={SANGAM.nameTa} titleEn={SANGAM.nameEn}
        subTa={SANGAM.subTa} subEn={SANGAM.subEn}
        plainTa={SANGAM.plainTa} plainEn={SANGAM.plainEn}
      />
      <Bi
        as="p"
        ta={SANGAM.eyebrowTa}
        en={SANGAM.eyebrowEn}
        className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]"
        separator={<span aria-hidden>·</span>}
      />
      <p lang="en" className="max-w-prose text-ivory-dim">{SANGAM.bodyEn}</p>

      {/* the corpus isn't a description, it's a poem — lead with a real
          block of Maduraikkanci and its translation, not just the pitch */}
      <motion.figure
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-10 rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/60 p-6 sm:p-8"
      >
        <figcaption className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs uppercase tracking-widest text-ivory-dim">
          <Bi ta={MADURAI_KANCHI.poemTa} en={MADURAI_KANCHI.poemEn} className="flex gap-1.5 text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
          <span aria-hidden className="text-ivory/30">—</span>
          <Bi ta={MADURAI_KANCHI.authorTa} en={MADURAI_KANCHI.authorEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </figcaption>
        <blockquote lang="ta" className="whitespace-pre-line font-display text-lg leading-relaxed text-ivory/90 sm:text-xl">
          {MADURAI_KANCHI.verseTa}
        </blockquote>
        <p lang="en" className="mt-5 max-w-prose text-sm italic leading-relaxed text-ivory-dim">
          {MADURAI_KANCHI.translationEn}
        </p>
        <p className="mt-4 text-xs text-ivory-dim/70">{MADURAI_KANCHI.sourceEn}</p>
      </motion.figure>

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-5 sm:grid-cols-3"
      >
        {SANGAM.pillars.map((p) => (
          <Card key={p.en} accent>
            <p aria-hidden className="mb-3 text-2xl">{p.icon}</p>
            <Bi
              ta={p.ta} en={p.en}
              className="flex flex-col gap-1"
              taClass="font-display text-lg font-semibold"
              enClass="text-sm text-ivory-dim"
            />
          </Card>
        ))}
      </motion.div>

      <div className="mt-8">
        <Button href={SANGAM.ctaHref} variant="ghost" external>
          <Bi ta={SANGAM.ctaTa} en={`${SANGAM.ctaEn} →`} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </Button>
      </div>
    </Section>
  );
}

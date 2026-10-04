"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SANGAM, MADURAI_KANCHI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

export function Sangam() {
  const { lang } = useLang();
  return (
    <Section id="sangam" fullHeight className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column (5 cols): Narrative, Pillars & CTA */}
        <div className="text-scrim flex flex-col justify-center lg:col-span-5">
          <SectionHeading
            thinaiTa="மருதம்"
            thinaiEn="Marutham"
            landscapeTa="வயல் · ஊடல்"
            landscape="Agriculture · fertile land"
            titleTa={SANGAM.nameTa}
            titleEn={SANGAM.nameEn}
            subTa={SANGAM.subTa}
            subEn={SANGAM.subEn}
            plainTa={SANGAM.plainTa}
            plainEn={SANGAM.plainEn}
            className="mb-3"
          />
          <Bi
            as="p"
            ta={SANGAM.bodyTa}
            en={SANGAM.bodyEn}
            className="text-xs sm:text-sm leading-relaxed text-ivory-dim flex flex-col gap-1.5"
          />

          {/* Pillars */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-3.5 grid grid-cols-3 gap-2"
          >
            {SANGAM.pillars.map((p) => (
              <Card key={p.en} accent className="p-2.5 text-center">
                <p aria-hidden className="mb-1 text-lg">{p.icon}</p>
                <Bi
                  ta={p.ta}
                  en={p.en}
                  className="flex flex-col gap-0.5"
                  taClass="font-display text-xs font-semibold text-ivory"
                  enClass="text-[10px] text-ivory-dim"
                />
              </Card>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-3.5">
            <Button href={SANGAM.ctaHref} variant="ghost" external>
              <Bi ta={SANGAM.ctaTa} en={`${SANGAM.ctaEn} →`} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>
        </div>

        {/* Right Column (7 cols): Classical Manuscript Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <figure className="glass-card rounded-[var(--radius-card)] border-l-2 border-l-[color:var(--accent)] p-4 sm:p-5">
            <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-ivory-dim">
              <Bi
                ta={MADURAI_KANCHI.poemTa}
                en={MADURAI_KANCHI.poemEn}
                className="flex gap-1.5 text-[color:var(--accent)] font-semibold"
                separator={<span aria-hidden>·</span>}
              />
              <span aria-hidden className="text-white/20">—</span>
              <Bi
                ta={MADURAI_KANCHI.authorTa}
                en={MADURAI_KANCHI.authorEn}
                className="flex gap-1.5 text-ivory-dim/80"
                separator={<span aria-hidden>·</span>}
              />
            </figcaption>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <blockquote
                lang={lang === "en" ? "en" : "ta"}
                className="whitespace-pre-line font-display text-xs sm:text-sm leading-[1.65] text-ivory/95"
              >
                {lang === "en" ? MADURAI_KANCHI.verseEn : MADURAI_KANCHI.verseTa}
              </blockquote>
              <div className="flex flex-col justify-between border-t border-white/10 pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <Bi
                  as="p"
                  ta={MADURAI_KANCHI.uraiTa}
                  en={MADURAI_KANCHI.translationEn}
                  className="text-xs sm:text-sm italic leading-relaxed text-ivory-dim/90 flex flex-col gap-1.5"
                />
                <Bi
                  as="p"
                  ta={MADURAI_KANCHI.sourceTa}
                  en={MADURAI_KANCHI.sourceEn}
                  className="mt-3 font-mono text-[10px] text-ivory-dim/60"
                />
              </div>
            </div>
          </figure>
        </motion.div>
      </div>
    </Section>
  );
}


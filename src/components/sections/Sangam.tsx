"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SANGAM, MADURAI_KANCHI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

export function Sangam() {
  const t = useSiteT();

  return (
    <Section id="sangam" className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column (5 cols): Narrative, Pillars & CTA with deep dark backdrop */}
        <div className="flex flex-col justify-center lg:col-span-5 rounded-[var(--radius-card)] bg-[#0a0b10]/85 p-5 sm:p-6 border border-white/[0.09] backdrop-blur-xl shadow-xl">
          <SectionHeading
            thinaiKey="site.section.sangam.thinai"
            landscapeKey="site.section.sangam.landscape"
            titleKey="site.sangam.name"
            subKey="site.sangam.sub"
            plainKey="site.sangam.plain"
          />

          <Bi
            as="p"
            ta={t("site.sangam.eyebrow")}
            en={t("site.sangam.eyebrow", undefined, { language: "en" })}
            className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)] font-mono"
            separator={<span aria-hidden>·</span>}
          />

          <p className="text-xs sm:text-sm leading-relaxed text-ivory-dim">
            {t("site.sangam.body")}
          </p>

          {/* Pillars */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-4 grid grid-cols-3 gap-2"
          >
            {SANGAM.pillars.map((p, i) => (
              <Card key={p.en} accent className="p-2.5 text-center bg-[#090a0f]/95">
                <p aria-hidden className="mb-1 text-lg">{p.icon}</p>
                <Bi
                  ta={t(`site.sangam.pillar.${i}`, undefined, { listingTerms: true })}
                  en={t(`site.sangam.pillar.${i}`, undefined, { language: "en" })}
                  className="flex flex-col gap-0.5"
                  taClass="font-display text-xs font-semibold text-ivory"
                  enClass="text-[10px] text-ivory-dim"
                />
              </Card>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4">
            <Button href={SANGAM.ctaHref} variant="ghost" external>
              <Bi
                ta={t("site.sangam.cta")}
                en={t("site.sangam.cta", undefined, { language: "en" })}
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
          </motion.div>
        </div>

        {/* Right Column (7 cols): Classical Manuscript Glass Card for Madurai Kanchi */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <figure className="glass-card rounded-[var(--radius-card)] border-l-4 border-l-[color:var(--accent)] bg-[#08090f]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
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
                lang="ta"
                className="whitespace-pre-line font-display text-xs sm:text-sm leading-[1.65] text-ivory/95"
              >
                {MADURAI_KANCHI.verseTa}
              </blockquote>
              <div className="flex flex-col justify-between border-t border-white/10 pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <p
                  lang="en"
                  className="text-xs sm:text-sm italic leading-relaxed text-ivory-dim/90"
                >
                  {MADURAI_KANCHI.translationEn}
                </p>
                <p className="mt-3 font-mono text-[10px] text-ivory-dim/60">
                  {t("site.sangam.source")}
                </p>
              </div>
            </div>
          </figure>
        </motion.div>
      </div>
    </Section>
  );
}

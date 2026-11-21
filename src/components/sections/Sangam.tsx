"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SANGAM, MADURAI_KANCHI } from "@/lib/content";
import { fadeUp } from "@/lib/motionPresets";
import { useSiteT, useLocale } from "@/lib/i18n";

export function Sangam() {
  const t = useSiteT();
  const { locale } = useLocale();

  const isTa = locale === "ta";
  const poemTitle = isTa ? MADURAI_KANCHI.poemTa : MADURAI_KANCHI.poemEn;
  const authorName = isTa ? MADURAI_KANCHI.authorTa : MADURAI_KANCHI.authorEn;

  // Curated opening lines of the classical verse for single-screen focus
  const verseSnippet = isTa
    ? MADURAI_KANCHI.verseTa.split("\n").slice(0, 6).join("\n")
    : null;

  return (
    <Section id="sangam">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (5 cols): Heading, narrative sentence & CTA */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <SectionHeading
            thinaiKey="site.section.sangam.thinai"
            landscapeKey="site.section.sangam.landscape"
            titleKey="site.sangam.name"
            subKey="site.sangam.sub"
            plainKey="site.sangam.plain"
          />

          <p className="mt-4 text-sm leading-relaxed text-ivory-dim">
            {t("site.sangam.body")}
          </p>

          <div className="mt-6">
            <Button href={SANGAM.ctaHref} variant="ghost" external>
              {t("site.sangam.cta")}
            </Button>
          </div>
        </div>

        {/* Right Column (7 cols): Classical Manuscript Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="lg:col-span-7"
        >
          <figure className="rounded-[var(--radius-card)] border border-ivory/12 bg-night-2/70 p-6 sm:p-8 border-l-4 border-l-[color:var(--accent)]">
            <figcaption className="mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-ivory-dim">
              <span className="font-semibold text-[color:var(--accent)]">{poemTitle}</span>
              <span aria-hidden className="text-ivory-dim/40">—</span>
              <span className="text-ivory-dim/80">{authorName}</span>
            </figcaption>

            {isTa ? (
              <blockquote
                lang="ta"
                className="whitespace-pre-line font-display text-base sm:text-lg leading-[1.75] text-ivory"
              >
                {verseSnippet}
              </blockquote>
            ) : (
              <blockquote
                lang="en"
                className="text-sm sm:text-base italic leading-relaxed text-ivory-dim"
              >
                {MADURAI_KANCHI.translationEn}
              </blockquote>
            )}

            <p className="mt-4 text-xs text-ivory-dim/60">
              {t("site.sangam.source")}
            </p>
          </figure>
        </motion.div>
      </div>
    </Section>
  );
}

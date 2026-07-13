"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SANGAM, THINAI, UI, THINAI_TA_LANDSCAPE, THINAI_TA_POETIC } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Marutham governs Sangam by the brand file's own sub-line. The five
    thinai reappear here as the literal product feature (landscape
    classifier) — the dual appearance BRAND_AND_CONTENT §2 asks for. */
export function Sangam() {
  const { lang } = useLang();
  return (
    <Section id="sangam">
      <SectionHeading
        thinaiTa="மருதம்" thinaiEn="Marutham" landscapeTa="வயல் · விளை நிலம்" landscape="Agriculture · fertile land"
        titleTa={SANGAM.nameTa} titleEn={SANGAM.nameEn}
        subTa={SANGAM.subTa} subEn={SANGAM.subEn}
      />
      <p lang="en" className="max-w-prose text-ivory-dim">{SANGAM.bodyEn}</p>

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

      {/* thinai as product feature: the classifier's own taxonomy */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/60"
      >
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">The five thinai — Sangam's landscape classification taxonomy</caption>
          <thead>
            <tr className="border-b border-ivory/10 text-xs uppercase tracking-widest text-ivory-dim">
              <th className="px-4 py-3 font-medium"><Bi ta={UI.thinaiCol.ta} en={UI.thinaiCol.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
              <th className="px-4 py-3 font-medium"><Bi ta={UI.landscapeCol.ta} en={UI.landscapeCol.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
              <th className="px-4 py-3 font-medium"><Bi ta={UI.poeticCol.ta} en={UI.poeticCol.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
            </tr>
          </thead>
          <tbody>
            {THINAI.map((t) => (
              <tr key={t.key} className="border-b border-ivory/5 last:border-0">
                <td className="px-4 py-3">
                  <span aria-hidden className="mr-2">{t.icon}</span>
                  {lang !== "en" && (
                    <span lang="ta" className="font-display" style={{ color: `var(--${t.key})` }}>{t.ta}</span>
                  )}
                  {lang === "both" && <span className="text-ivory/30"> · </span>}
                  {lang !== "ta" && <span lang="en" className={lang === "en" ? "font-display" : "text-ivory-dim"} style={lang === "en" ? { color: `var(--${t.key})` } : undefined}>{t.en}</span>}
                </td>
                <td className="px-4 py-3 text-ivory-dim">
                  <Bi ta={THINAI_TA_LANDSCAPE[t.key]} en={t.landscape} className="flex flex-col gap-0.5" />
                </td>
                <td className="px-4 py-3 text-ivory-dim">
                  <Bi ta={THINAI_TA_POETIC[t.key]} en={t.poetic} className="flex flex-col gap-0.5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="mt-8">
        <Button href={SANGAM.ctaHref} variant="ghost" external>
          <Bi ta={SANGAM.ctaTa} en={`${SANGAM.ctaEn} →`} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </Button>
      </div>
    </Section>
  );
}

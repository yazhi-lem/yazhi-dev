"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SANGAM, THINAI, UI } from "@/lib/content";
import { useLang, resolveIndic } from "@/lib/i18n";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Marutham governs Sangam by the brand file's own sub-line. The five
    thinai reappear here as the literal product feature (landscape
    classifier) — the dual appearance BRAND_AND_CONTENT §2 asks for. */
export function Sangam() {
  const { mode, indic } = useLang();
  return (
    <Section id="sangam">
      <SectionHeading eyebrow={SANGAM.eyebrow} title={SANGAM.name} sub={SANGAM.sub} />
      <Bi as="p" text={SANGAM.body} className="flex max-w-prose flex-col gap-3 text-ivory-dim" />

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-5 sm:grid-cols-3"
      >
        {SANGAM.pillars.map((p) => (
          <Card key={p.label.en} accent>
            <p aria-hidden className="mb-3 text-2xl">{p.icon}</p>
            <Bi
              text={p.label}
              className="flex flex-col gap-1"
              taClass="font-display text-lg font-semibold"
              mixedClass="font-display text-lg font-semibold"
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
          <caption className="sr-only">The five thinai — Sangam&apos;s landscape classification taxonomy</caption>
          <thead>
            <tr className="border-b border-ivory/10 text-xs uppercase tracking-widest text-ivory-dim">
              <th className="px-4 py-3 font-medium"><Bi text={UI.thinaiCol} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
              <th className="px-4 py-3 font-medium"><Bi text={UI.landscapeCol} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
              <th className="px-4 py-3 font-medium"><Bi text={UI.poeticCol} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></th>
            </tr>
          </thead>
          <tbody>
            {THINAI.map((t) => {
              const name = resolveIndic(t.name, indic);
              return (
                <tr key={t.key} className="border-b border-ivory/5 last:border-0">
                  <td className="px-4 py-3">
                    <span aria-hidden className="mr-2">{t.icon}</span>
                    {mode !== "en" && (
                      <span lang={name.lang} className="font-display" style={{ color: `var(--${t.key})` }}>{name.value}</span>
                    )}
                    {mode === "mixed" && <span className="text-ivory/30"> · </span>}
                    {mode !== "indic" && <span lang="en" className={mode === "en" ? "font-display" : "text-ivory-dim"} style={mode === "en" ? { color: `var(--${t.key})` } : undefined}>{t.en}</span>}
                  </td>
                  <td className="px-4 py-3 text-ivory-dim">
                    <Bi text={t.landscape} className="flex flex-col gap-0.5" />
                  </td>
                  <td className="px-4 py-3 text-ivory-dim">
                    <Bi text={t.poetic} className="flex flex-col gap-0.5" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <div className="mt-8">
        <Button href={SANGAM.ctaHref} variant="ghost" external>
          <Bi text={SANGAM.cta} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </Button>
      </div>
    </Section>
  );
}

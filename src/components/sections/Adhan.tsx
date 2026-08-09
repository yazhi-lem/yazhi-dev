"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { Card } from "@/components/ui/Card";
import { ADHAN, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Mullai (forest · waiting) governs Adhan: a model is grown patiently,
    like a forest — training as cultivation, not conquest. */
export function Adhan() {
  return (
    <Section id="adhan">
      <SectionHeading
        thinaiTa="முல்லை" thinaiEn="Mullai" landscapeTa="காடு · இருத்தல்" landscape="Forest · waiting"
        titleTa={ADHAN.nameTa} titleEn={ADHAN.nameEn}
        subTa={ADHAN.subTa} subEn={ADHAN.subEn}
        plainTa={ADHAN.plainTa} plainEn={ADHAN.plainEn}
      />
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.p variants={fadeUp} lang="en" className="max-w-prose text-ivory-dim">
            {ADHAN.bodyEn}
          </motion.p>
          <motion.dl variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4">
            {ADHAN.stats.map((s) => (
              <Card key={s.en} interactive={false} className="!p-4 text-center">
                <dd className="font-display text-3xl font-semibold text-[color:var(--accent)]">{s.value}</dd>
                <dt className="mt-1">
                  <Bi ta={s.ta} en={s.en} className="flex flex-col text-xs text-ivory-dim" />
                </dt>
              </Card>
            ))}
          </motion.dl>
          <motion.div variants={fadeUp} className="mt-8">
            <Button href={ADHAN.ctaHref} external><Bi ta={ADHAN.ctaTa} en={UI.adhanCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></Button>
          </motion.div>

          {/* Token tax — same sentence, wildly different token cost per
              language. The reason a from-scratch tokenizer matters. */}
          <motion.div variants={fadeUp} className="mt-10">
            <p className="text-xs uppercase tracking-widest text-ivory-dim">{ADHAN.tokenTax.labelEn}</p>
            <dl className="mt-3 space-y-2">
              {ADHAN.tokenTax.rows.map((r) => {
                const pct = (parseFloat(r.multiplier) / 4.5) * 100;
                return (
                  <div key={r.lang} className="flex items-center gap-3 text-sm">
                    <dt className="w-16 shrink-0 text-ivory-dim">{r.lang}</dt>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ivory/10">
                      <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                    <dd className="w-10 shrink-0 text-right text-ivory-dim">{r.multiplier}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-2 text-xs text-ivory-dim/70">{ADHAN.tokenTax.sourceEn}</p>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <CodeBlock code={ADHAN.code} label="adhan_quickstart.py" />
        </motion.div>
      </div>
    </Section>
  );
}

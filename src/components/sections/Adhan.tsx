"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { ADHAN, LANGUAGE_ROADMAP, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Adhan — the engine underneath (deck p7 · 02). Mullai (forest ·
    waiting) governs it: a model is grown patiently, like a forest —
    training as cultivation, not conquest. The language roadmap below is
    the deck's own "Tamil first, not Tamil only" (p8), and carries the
    point that the model is still being developed rather than shipped and
    frozen. */
export function Adhan() {
  return (
    <Section id="adhan">
      <SectionHeading
        thinaiTa="முல்லை" thinaiEn="Mullai" landscapeTa="காடு · இருத்தல்" landscape="Forest · waiting"
        titleTa={ADHAN.nameTa} titleEn={ADHAN.nameEn}
        subTa={ADHAN.subTa} subEn={ADHAN.subEn}
        plainTa={ADHAN.plainTa} plainEn={ADHAN.plainEn}
      />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <motion.div variants={fadeUp}>
          <Bi
            as="p"
            ta={ADHAN.eyebrowTa}
            en={ADHAN.eyebrowEn}
            className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]"
            separator={<span aria-hidden>·</span>}
          />
        </motion.div>
        <motion.p variants={fadeUp} lang="en" className="max-w-prose text-ivory-dim">
          {ADHAN.bodyEn}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8">
          <Button href={ADHAN.ctaHref} external>
            <Bi ta={ADHAN.ctaTa} en={UI.adhanCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
          </Button>
        </motion.div>

        {/* the language roadmap — the model is a moving target, and this is
            the order it moves in */}
        <motion.div variants={fadeUp} className="mt-14">
          <Bi
            as="h3"
            ta={LANGUAGE_ROADMAP.titleTa}
            en={LANGUAGE_ROADMAP.titleEn}
            className="flex flex-col gap-1 font-display text-2xl font-semibold"
          />
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LANGUAGE_ROADMAP.steps.map((s, i) => (
              <li key={s.langEn} className="border-t border-ivory/15 pt-4">
                <p className={`text-xs uppercase tracking-widest ${i === 0 ? "text-[color:var(--accent)]" : "text-ivory-dim/70"}`}>
                  {s.stageEn}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ivory">{s.langEn}</p>
                <p lang="en" className="mt-2 text-sm text-ivory-dim">{s.bodyEn}</p>
              </li>
            ))}
          </ol>
          <p lang="en" className="mt-6 max-w-prose text-sm text-ivory-dim/85">{LANGUAGE_ROADMAP.footEn}</p>
        </motion.div>

        {/* Token tax — same sentence, wildly different token cost per
            language. The reason a from-scratch tokenizer matters. */}
        <motion.div variants={fadeUp} className="mt-14 max-w-sm">
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
    </Section>
  );
}

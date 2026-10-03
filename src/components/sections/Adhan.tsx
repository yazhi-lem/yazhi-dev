"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { ADHAN, LANGUAGE_ROADMAP, THINAI_HEADINGS, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

const H = THINAI_HEADINGS.palai;

/** Adhan — the engine underneath. Palai (drylands · hardship,
    transformation) governs it: in the Yazhi tinai system palai is the
    hard engineering. The language roadmap below is "Tamil first, not
    Tamil only", and states the model as work in progress. */
export function Adhan() {
  return (
    <Section id="adhan">
      <SectionHeading
        thinaiTa={H.ta} thinaiEn={H.en} landscapeTa={H.landscapeTa} landscape={H.landscapeEn}
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
        <motion.div variants={fadeUp}>
          <Bi as="p" ta={ADHAN.bodyTa} en={ADHAN.bodyEn} className="flex max-w-prose flex-col gap-3 text-ivory-dim" />
        </motion.div>

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
                <Bi
                  as="p" ta={s.stageTa} en={s.stageEn}
                  className={`flex gap-1.5 text-xs uppercase tracking-widest ${i === 0 ? "text-[color:var(--accent)]" : "text-ivory-dim/70"}`}
                  separator={<span aria-hidden>·</span>}
                />
                <Bi as="p" ta={s.langTa} en={s.langEn} className="mt-1 flex flex-col font-display text-xl font-semibold text-ivory" enClass="text-base font-normal text-ivory-dim" />
                <Bi as="p" ta={s.bodyTa} en={s.bodyEn} className="mt-2 flex flex-col gap-1 text-sm text-ivory-dim" />
              </li>
            ))}
          </ol>
          <Bi as="p" ta={LANGUAGE_ROADMAP.footTa} en={LANGUAGE_ROADMAP.footEn} className="mt-6 flex max-w-prose flex-col gap-2 text-sm text-ivory-dim/85" />
        </motion.div>

        {/* Token tax — same sentence, wildly different token cost per
            language. The reason a from-scratch tokenizer matters. */}
        <motion.div variants={fadeUp} className="mt-14 max-w-sm">
          <Bi as="p" ta={ADHAN.tokenTax.labelTa} en={ADHAN.tokenTax.labelEn} className="flex flex-col gap-1 text-xs uppercase tracking-widest text-ivory-dim" />
          <dl className="mt-3 space-y-2">
            {ADHAN.tokenTax.rows.map((r) => {
              const pct = (parseFloat(r.multiplier) / 4.5) * 100;
              return (
                <div key={r.lang} className="flex items-center gap-3 text-sm">
                  <dt className="w-20 shrink-0 text-ivory-dim">
                    <Bi ta={r.langTa} en={r.lang} className="flex flex-col leading-tight" enClass="text-[11px]" />
                  </dt>
                  <dd className="flex flex-1 items-center gap-3">
                    <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-ivory/10">
                      <span className="block h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-10 shrink-0 text-right text-ivory-dim">{r.multiplier}</span>
                  </dd>
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

"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { ADHAN, LANGUAGE_ROADMAP, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

export function Adhan() {
  return (
    <Section id="adhan" fullHeight className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column (5 cols): Narrative, Philosophy & GitHub CTA */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="text-scrim flex flex-col justify-center lg:col-span-5"
        >
          <SectionHeading
            thinaiTa="முல்லை"
            thinaiEn="Mullai"
            landscapeTa="காடு · இருத்தல்"
            landscape="Forest · waiting"
            titleTa={ADHAN.nameTa}
            titleEn={ADHAN.nameEn}
            subTa={ADHAN.subTa}
            subEn={ADHAN.subEn}
            plainTa={ADHAN.plainTa}
            plainEn={ADHAN.plainEn}
            className="mb-3.5"
          />

          <motion.div variants={fadeUp}>
            <Bi
              as="p"
              ta={ADHAN.bodyTa}
              en={ADHAN.bodyEn}
              className="text-xs sm:text-sm leading-relaxed text-ivory-dim flex flex-col gap-1.5"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={ADHAN.ctaHref} external>
              <Bi ta={ADHAN.ctaTa} en={UI.adhanCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 border-l border-white/15 pl-3">
            <Bi
              as="p"
              ta={ADHAN.sivakasiTa.title}
              en={ADHAN.sivakasiEn.title}
              className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent)]"
            />
            <Bi
              as="p"
              ta={ADHAN.sivakasiTa.body}
              en={ADHAN.sivakasiEn.body}
              className="mt-0.5 text-[11px] text-ivory-dim/75 leading-relaxed"
            />
          </motion.div>
        </motion.div>

        {/* Right Column (7 cols): Language Roadmap Progression Cards & Token Tax Graphic */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col justify-center lg:col-span-7"
        >
          <motion.div variants={fadeUp} className="mb-3">
            <Bi
              as="h3"
              ta={LANGUAGE_ROADMAP.titleTa}
              en={LANGUAGE_ROADMAP.titleEn}
              className="flex flex-col gap-0.5 font-display text-base sm:text-lg font-bold text-ivory"
            />
            <Bi
              as="p"
              ta={LANGUAGE_ROADMAP.footTa}
              en={LANGUAGE_ROADMAP.footEn}
              className="mt-1 text-[11px] sm:text-xs leading-relaxed text-ivory-dim/80"
            />
          </motion.div>

          <ol className="grid gap-2.5 sm:grid-cols-2">
            {LANGUAGE_ROADMAP.steps.map((s, i) => (
              <motion.li
                key={s.langEn}
                variants={fadeUp}
                className={`glass-card relative flex flex-col justify-between rounded-[var(--radius-card)] p-3 sm:p-3.5 ${
                  i === 0 ? "border-[color:var(--accent)]/50 ring-1 ring-[color:var(--accent)]/30" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.2 text-[9px] font-mono uppercase tracking-widest ${
                        i === 0
                          ? "bg-[color:var(--accent)]/25 text-[color:var(--accent)] border border-[color:var(--accent)]/40"
                          : "bg-white/[0.06] text-ivory-dim/70"
                      }`}
                    >
                      <Bi ta={s.stageTa} en={s.stageEn} />
                    </span>
                    {i === 0 && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <Bi
                    as="p"
                    ta={s.langTa}
                    en={s.langEn}
                    className="mt-1.5 font-display text-sm sm:text-base font-semibold text-ivory"
                  />
                  <Bi
                    as="p"
                    ta={s.bodyTa}
                    en={s.bodyEn}
                    className="mt-1 text-[11px] leading-snug text-ivory-dim/90"
                  />
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Token Tax Empirical Glass Card beneath the roadmap */}
          <motion.div
            variants={fadeUp}
            className="glass-card mt-2.5 rounded-[var(--radius-card)] p-3.5 sm:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/10 pb-2">
              <Bi
                as="p"
                ta={ADHAN.tokenTax.labelTa}
                en={ADHAN.tokenTax.labelEn}
                className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--accent)]"
              />
              <Bi
                as="span"
                ta={ADHAN.tokenTax.sourceTa}
                en={ADHAN.tokenTax.sourceEn}
                className="font-mono text-[9px] text-ivory-dim/60"
              />
            </div>
            <dl className="mt-2.5 grid gap-1.5 sm:grid-cols-2 sm:gap-3">
              {ADHAN.tokenTax.rows.map((r) => {
                const pct = (parseFloat(r.multiplier) / 4.5) * 100;
                return (
                  <div key={r.lang} className="flex items-center gap-2 text-[11px]">
                    <Bi as="dt" ta={r.langTa} en={r.lang} className="w-16 shrink-0 font-medium text-ivory-dim" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[color:var(--accent)] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <dd className="w-7 shrink-0 text-right font-mono text-[10px] text-ivory">{r.multiplier}</dd>
                  </div>
                );
              })}
            </dl>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}



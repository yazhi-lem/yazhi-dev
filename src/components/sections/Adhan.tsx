"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { ADHAN, LANGUAGE_ROADMAP } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

export function Adhan() {
  const t = useSiteT();

  return (
    <Section id="adhan" className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column (5 cols): Narrative, Philosophy & CTA */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col justify-center lg:col-span-5 rounded-[var(--radius-card)] bg-[#0a0b10]/85 p-5 sm:p-6 border border-white/[0.09] backdrop-blur-xl shadow-xl"
        >
          <SectionHeading
            thinaiKey="site.section.adhan.thinai"
            landscapeKey="site.section.adhan.landscape"
            titleKey="site.adhan.name"
            subKey="site.adhan.sub"
            plainKey="site.adhan.plain"
          />

          <motion.div variants={fadeUp}>
            <Bi
              as="p"
              ta={t("site.adhan.eyebrow")}
              en={t("site.adhan.eyebrow", undefined, { language: "en" })}
              className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)] font-mono"
              separator={<span aria-hidden>·</span>}
            />
            <p className="text-xs sm:text-sm leading-relaxed text-ivory-dim">
              {t("site.adhan.body")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={ADHAN.ctaHref} external>
              <Bi
                ta={t("site.adhan.cta")}
                en={t("site.adhan.cta", undefined, { language: "en" })}
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 border-l border-white/15 pl-3">
            <Bi
              as="p"
              ta="சிவகிராம கணினிகள்"
              en="Sivakasi Training Infrastructure"
              className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent)]"
            />
            <Bi
              as="p"
              ta="எங்கள் சொந்த கணினி அமைப்புகளில் முழுமையான இறையாண்மையுடன் மொழி மாதிரிகள் பயிற்றுவிக்கப்படுகின்றன."
              en="Models are trained natively and independently on dedicated high-performance sovereign infrastructure."
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
          className="flex flex-col justify-center lg:col-span-7 rounded-[var(--radius-card)] bg-[#0a0b10]/85 p-5 sm:p-6 border border-white/[0.09] backdrop-blur-xl shadow-xl"
        >
          <motion.div variants={fadeUp} className="mb-3">
            <Bi
              as="h3"
              ta={t("site.languageRoadmap.title")}
              en={t("site.languageRoadmap.title", undefined, { language: "en" })}
              className="flex flex-col gap-0.5 font-display text-base sm:text-lg font-bold text-ivory"
            />
            <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-ivory-dim/80">
              {t("site.languageRoadmap.foot")}
            </p>
          </motion.div>

          <ol className="grid gap-2.5 sm:grid-cols-2">
            {LANGUAGE_ROADMAP.steps.map((s, i) => (
              <motion.li
                key={s.langEn}
                variants={fadeUp}
                className={`glass-card relative flex flex-col justify-between rounded-[var(--radius-card)] bg-[#090a0f]/95 p-3.5 sm:p-4 border border-white/12 ${
                  i === 0 ? "border-[color:var(--accent)]/60 ring-1 ring-[color:var(--accent)]/40" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.2 text-[9px] font-mono uppercase tracking-widest ${
                        i === 0
                          ? "bg-[color:var(--accent)]/30 text-[color:var(--accent)] border border-[color:var(--accent)]/50 font-bold"
                          : "bg-white/[0.08] text-ivory-dim/80"
                      }`}
                    >
                      {t(`site.languageRoadmap.step.${i}.stage`)}
                    </span>
                    {i === 0 && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1.5 font-display text-sm sm:text-base font-semibold text-ivory">
                    {t(`site.languageRoadmap.step.${i}.lang`)}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ivory-dim/90">
                    {t(`site.languageRoadmap.step.${i}.body`)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Token Tax Empirical Glass Card beneath the roadmap */}
          <motion.div
            variants={fadeUp}
            className="glass-card mt-3 rounded-[var(--radius-card)] bg-[#090a0f]/95 p-3.5 sm:p-4 border border-white/12 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/10 pb-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--accent)] font-semibold">
                {t("site.adhan.tokenTax.label")}
              </p>
              <span className="font-mono text-[9px] text-ivory-dim/60">
                {t("site.adhan.tokenTax.source")}
              </span>
            </div>
            <dl className="mt-2.5 grid gap-1.5 sm:grid-cols-2 sm:gap-3">
              {ADHAN.tokenTax.rows.map((r, i) => {
                const pct = (parseFloat(r.multiplier) / 4.5) * 100;
                return (
                  <div key={r.lang} className="flex items-center gap-2 text-[11px]">
                    <dt className="w-20 shrink-0 font-medium text-ivory-dim">
                      {t(`site.adhan.tokenTax.row.${i}`, undefined, { listingTerms: true })}
                    </dt>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[color:var(--accent)] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <dd className="w-7 shrink-0 text-right font-mono text-[10px] text-ivory">
                      {r.multiplier}
                    </dd>
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

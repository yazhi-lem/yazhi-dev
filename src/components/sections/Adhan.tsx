"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { ADHAN, LANGUAGE_ROADMAP } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

/** Adhan — the engine underneath (deck p7 · 02). Mullai (forest ·
    waiting) governs it: a model is grown patiently, like a forest —
    training as cultivation, not conquest. The language roadmap below is
    the deck's own "Tamil first, not Tamil only" (p8), and carries the
    point that the model is still being developed rather than shipped and
    frozen. */
export function Adhan() {
  const t = useSiteT();
  return (
    <Section id="adhan">
      <SectionHeading
        thinaiKey="site.section.adhan.thinai"
        landscapeKey="site.section.adhan.landscape"
        titleKey="site.adhan.name"
        subKey="site.adhan.sub"
        plainKey="site.adhan.plain"
      />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <motion.div variants={fadeUp}>
          <Bi
            as="p"
            ta={t("site.adhan.eyebrow")}
            en={t("site.adhan.eyebrow", undefined, { language: "en" })}
            className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]"
            separator={<span aria-hidden>·</span>}
          />
        </motion.div>
        <motion.p variants={fadeUp} className="max-w-prose text-ivory-dim">
          {t("site.adhan.body")}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8">
          <Button href={ADHAN.ctaHref} external>
            <Bi
              ta={t("site.adhan.cta")}
              en={t("site.adhan.cta", undefined, { language: "en" })}
              className="flex gap-1.5"
              separator={<span aria-hidden>·</span>}
            />
          </Button>
        </motion.div>

        {/* the language roadmap — the model is a moving target, and this is
            the order it moves in */}
        <motion.div variants={fadeUp} className="mt-14">
          <Bi
            as="h3"
            ta={t("site.languageRoadmap.title")}
            en={t("site.languageRoadmap.title", undefined, { language: "en" })}
            className="flex flex-col gap-1 font-display text-2xl font-semibold"
          />
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LANGUAGE_ROADMAP.steps.map((s, i) => (
              <li key={s.langEn} className="border-t border-ivory/15 pt-4">
                <p className={`text-xs uppercase tracking-widest ${i === 0 ? "text-[color:var(--accent)]" : "text-ivory-dim/70"}`}>
                  {t(`site.languageRoadmap.step.${i}.stage`)}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ivory">{t(`site.languageRoadmap.step.${i}.lang`)}</p>
                <p className="mt-2 text-sm text-ivory-dim">{t(`site.languageRoadmap.step.${i}.body`)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-prose text-sm text-ivory-dim/85">{t("site.languageRoadmap.foot")}</p>
        </motion.div>

        {/* Token tax — same sentence, wildly different token cost per
            language. The reason a from-scratch tokenizer matters. */}
        <motion.div variants={fadeUp} className="mt-14 max-w-sm">
          <p className="text-xs uppercase tracking-widest text-ivory-dim">{t("site.adhan.tokenTax.label")}</p>
          <dl className="mt-3 space-y-2">
            {ADHAN.tokenTax.rows.map((r, i) => {
              const pct = (parseFloat(r.multiplier) / 4.5) * 100;
              return (
                <div key={r.lang} className="flex items-center gap-3 text-sm">
                  <dt className="w-24 shrink-0 text-ivory-dim">
                    {/* a cited comparison: each language is named in its own script */}
                    {t(`site.adhan.tokenTax.row.${i}`, undefined, { listingTerms: true })}
                  </dt>
                  <dd className="flex flex-1 items-center gap-3 text-ivory-dim">
                    <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-ivory/10">
                      <span className="block h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-10 shrink-0 text-right">{r.multiplier}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-2 text-xs text-ivory-dim/70">{t("site.adhan.tokenTax.source")}</p>
        </motion.div>
      </motion.div>
    </Section>
  );
}

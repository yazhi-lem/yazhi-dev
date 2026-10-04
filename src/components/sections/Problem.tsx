"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PROBLEM } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";

/** The problem, told as three short draft articles: the token tax, the
    data gap, and whose data it is. Each names its one source (Aram 1)
    and links to the project that answers it. Palai governs it — the
    hard land the rest of the page sets out to cross. */
export function Problem() {
  return (
    <Section id="problem">
      <SectionTitle
        eyebrow={{ ta: PROBLEM.eyebrowTa, en: PROBLEM.eyebrowEn }}
        title={{ ta: PROBLEM.titleTa, en: PROBLEM.titleEn }}
        lead={{ ta: PROBLEM.leadTa, en: PROBLEM.leadEn }}
      />

      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        {PROBLEM.articles.map((a, i) => (
          <motion.li key={a.key} variants={fadeUp}>
            <article
              aria-labelledby={`problem-${a.key}`}
              className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/70 p-6 backdrop-blur"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ivory-dim">
                <span aria-hidden className="font-display text-sm text-[color:var(--accent)]">{["௧", "௨", "௩"][i]}</span>
                <Bi
                  ta={PROBLEM.draftTa} en={PROBLEM.draftEn}
                  className="inline-flex gap-1.5 rounded-full border border-ivory/15 px-2.5 py-0.5"
                  separator={<span aria-hidden>·</span>}
                />
              </div>
              <h3 id={`problem-${a.key}`}>
                <Bi
                  ta={a.title.ta} en={a.title.en}
                  className="flex flex-col gap-0.5"
                  taClass="font-display text-[length:var(--text-2xl)] font-semibold text-ivory"
                  enClass="font-display text-base text-ivory-dim"
                />
              </h3>
              <Bi as="p" ta={a.body.ta} en={a.body.en} className="flex flex-col gap-2 text-ivory-dim" enClass="text-sm" />

              <div className="mt-auto flex flex-col gap-3 border-t border-ivory/10 pt-4 text-sm">
                <p className="text-ivory-dim">
                  <Bi ta={PROBLEM.sourceTa} en={PROBLEM.sourceEn} className="inline-flex gap-1" separator="/" />
                  {": "}
                  <a href={a.source.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory hover:decoration-ivory">
                    <cite lang="en" className="not-italic">{a.source.label}</cite>
                  </a>
                </p>
                <Link href={a.answer.href} className="group inline-flex flex-wrap items-baseline gap-x-2 text-ivory hover:text-[color:var(--accent)]">
                  <Bi ta={PROBLEM.answerTa} en={PROBLEM.answerEn} className="inline-flex gap-1 text-xs text-[color:var(--accent)]" separator="/" />
                  <Bi ta={a.answer.ta} en={a.answer.en} className="inline-flex flex-col" enClass="text-ivory-dim" />
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}

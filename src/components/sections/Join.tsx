"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { JOIN } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";

/** The ask: everyone has a piece to build — developer, linguist,
    teacher, writer, parent — and each role has a door. Mullai
    (patience, loyalty) governs it: community. */
export function Join() {
  return (
    <Section id="join">
      <SectionTitle center title={{ ta: JOIN.titleTa, en: JOIN.titleEn }} lead={{ ta: JOIN.bodyTa, en: JOIN.bodyEn }} />

      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        {/* three across, then two wider — five roles, no orphan */}
        {JOIN.roles.map((r, i) => (
          <motion.li key={r.en} variants={fadeUp} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
            <Link
              href={r.href}
              className="group flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/70 p-5 backdrop-blur transition-colors hover:border-[color:var(--accent)]"
            >
              <Bi
                ta={r.ta} en={r.en}
                className="flex flex-col"
                taClass="font-display text-[length:var(--text-xl)] font-semibold text-ivory"
                enClass="text-sm text-ivory-dim"
              />
              <Bi as="span" ta={r.doTa} en={r.doEn} className="flex flex-col gap-1 text-sm text-ivory-dim" />
              <span aria-hidden className="mt-auto pt-2 text-[color:var(--accent)] transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto mt-12 max-w-2xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {JOIN.ctas.map((c) => (
            <Button key={c.href} href={c.href} variant={c.primary ? "primary" : "ghost"} external={c.external}>
              <Bi ta={c.ta} en={c.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          ))}
        </div>
        <Bi as="p" ta={JOIN.ageTa} en={JOIN.ageEn} className="mt-6 flex flex-col gap-0.5 text-xs text-ivory-dim/80" />
      </motion.div>
    </Section>
  );
}

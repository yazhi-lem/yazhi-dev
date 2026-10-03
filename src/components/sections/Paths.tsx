"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { PATHS } from "@/lib/content";
import { toneStyle } from "@/bubble/tone";
import { fadeUp, stagger } from "@/lib/motionPresets";

/** Yazhi's services along the three paths — families, work, society.
    One line each and one action; details live on each project's page.
    Marutham (everyday work) governs it. */
export function Paths() {
  return (
    <Section id="paths">
      <Bi
        as="p" ta={PATHS.eyebrowTa} en={PATHS.eyebrowEn}
        className="flex gap-2 text-sm text-[color:var(--accent)]"
        separator={<span aria-hidden>·</span>}
      />
      <Bi
        as="h2" display ta={PATHS.titleTa} en={PATHS.titleEn}
        className="mt-2 flex flex-col gap-1"
        taClass="font-display text-[length:min(var(--text-4xl),calc((100vw_-_3rem)/10))] font-semibold"
        enClass="font-display text-[length:var(--text-xl)] text-ivory-dim"
      />

      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid gap-5 lg:grid-cols-3"
      >
        {PATHS.items.map((p) => (
          <motion.li
            key={p.key}
            variants={fadeUp}
            style={toneStyle(p.tone)}
            className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--tone)]/30 bg-night-2/70 p-6 backdrop-blur"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <Bi as="h3" ta={p.headTa} en={p.headEn} className="flex flex-col" taClass="font-display text-[length:var(--text-2xl)] font-semibold text-ivory" enClass="text-sm text-ivory-dim" />
              <Bi as="p" ta={p.statusTa} en={p.statusEn} className="flex flex-wrap gap-1 text-xs text-ivory-dim" separator={<span aria-hidden>·</span>} />
            </div>
            <Bi as="p" ta={p.nameTa} en={p.nameEn} className="ybi-tone-text flex gap-1.5 font-display text-lg" separator={<span aria-hidden>·</span>} />
            <Bi as="p" ta={p.bodyTa} en={p.bodyEn} className="flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
            <div className="mt-auto pt-2">
              <Button href={p.href} variant="ghost" external={p.external}>
                <Bi ta={p.ctaTa} en={p.ctaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
              </Button>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}

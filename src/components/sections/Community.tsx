"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { JOIN } from "@/lib/content";
import { fadeUp } from "@/lib/motionPresets";

/** The invitation — one line, three doors. Mullai (patience, loyalty)
    governs it: community. Section headings cap their size at
    (viewport − 3rem) / 10 so the longest Tamil word (உருவாக்குவோம்,
    9.65em) never runs past a phone's edge. */
export function Community() {
  return (
    <Section id="community">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto max-w-2xl text-center">
        <Bi
          as="h2" display ta={JOIN.titleTa} en={JOIN.titleEn}
          className="flex flex-col gap-1"
          taClass="font-display text-[length:min(var(--text-4xl),calc((100vw_-_3rem)/10))] font-semibold"
          enClass="font-display text-[length:var(--text-xl)] text-ivory-dim"
        />
        <Bi as="p" ta={JOIN.bodyTa} en={JOIN.bodyEn} className="mt-5 flex flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim" enClass="text-base" />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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

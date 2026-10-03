"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { VISION } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";

/** Yazhi 2030 — three lines and a promise, from the founder's note.
    Kurinji (new beginnings) governs it. */
export function Vision() {
  return (
    <Section id="vision">
      <Bi
        as="h2" display ta={VISION.titleTa} en={VISION.titleEn}
        className="flex flex-col gap-1"
        taClass="font-display text-[length:min(var(--text-4xl),calc((100vw_-_3rem)/10))] font-semibold"
        enClass="font-display text-[length:var(--text-xl)] text-ivory-dim"
      />

      <motion.ol
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid gap-10 lg:grid-cols-3"
      >
        {VISION.lines.map((l, i) => (
          <motion.li key={l.headEn} variants={fadeUp} className="border-t-2 border-[color:var(--accent)]/50 pt-5">
            <p aria-hidden className="font-display text-sm text-[color:var(--accent)]">{["௧", "௨", "௩"][i]}</p>
            <Bi
              as="h3" ta={l.headTa} en={l.headEn}
              className="mt-2 flex flex-col gap-0.5"
              taClass="font-display text-[length:var(--text-xl)] font-semibold text-ivory"
              enClass="text-sm text-ivory-dim"
            />
            <Bi as="p" ta={l.bodyTa} en={l.bodyEn} className="mt-3 flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
          </motion.li>
        ))}
      </motion.ol>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14">
        <Bi
          as="p" ta={VISION.closeTa} en={VISION.closeEn}
          className="flex flex-col gap-1"
          taClass="font-display text-[length:var(--text-2xl)] text-ivory"
          enClass="text-ivory-dim"
        />
      </motion.div>
    </Section>
  );
}

"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { THINAI_WORLD } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Yazhi's world — the five thinai as Yazhi's content system: each
    landscape sets the mood of one kind of work. Sits after Open Sangam,
    where the same five classify the poems. */
export function Thinai() {
  return (
    <Section id="thinai">
      <Bi
        as="p"
        ta={THINAI_WORLD.eyebrowTa}
        en={THINAI_WORLD.eyebrowEn}
        className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]"
        separator={<span aria-hidden>·</span>}
      />
      <Bi
        as="h2"
        ta={THINAI_WORLD.titleTa}
        en={THINAI_WORLD.titleEn}
        className="mt-3 flex flex-col gap-1 font-display text-[length:var(--text-3xl)] font-bold"
      />

      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
      >
        {THINAI_WORLD.landscapes.map((l) => (
          <motion.li
            key={l.key}
            variants={fadeUp}
            className="border-t-2 pt-4"
            style={{ borderColor: `var(--${l.key})` }}
          >
            <Bi
              ta={l.ta} en={l.en}
              className="flex flex-col gap-0.5"
              taClass="font-display text-xl font-semibold"
              enClass="font-display text-lg text-ivory-dim"
            />
            <div style={{ color: `var(--${l.key})` }}>
              <Bi as="p" ta={l.moodTa} en={l.moodEn} className="mt-2 flex flex-col gap-0.5 text-sm" />
            </div>
            <Bi as="p" ta={l.bodyTa} en={l.bodyEn} className="mt-2 flex flex-col gap-0.5 text-sm text-ivory-dim" />
          </motion.li>
        ))}
      </motion.ul>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10">
        <Bi as="p" ta={THINAI_WORLD.footTa} en={THINAI_WORLD.footEn} className="flex max-w-prose flex-col gap-2 text-sm text-ivory-dim/85" />
      </motion.div>
    </Section>
  );
}

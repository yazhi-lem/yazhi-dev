"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { THINAI_WORLD } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Yazh's world — the five thinai, straight from the deck (p5). Sangam
    poetry sorts the world into these five landscapes and Yazh's story
    library is organised the same way, so this sits after Open Sangam:
    the taxonomy is the bridge between the corpus and the stories a child
    actually hears. */
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
            <p className="mt-2 text-sm" style={{ color: `var(--${l.key})` }}>{l.moodEn}</p>
            <p lang="en" className="mt-2 text-sm text-ivory-dim">{l.bodyEn}</p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        lang="en"
        className="mt-10 max-w-prose text-sm text-ivory-dim/85"
      >
        {THINAI_WORLD.footEn}
      </motion.p>
    </Section>
  );
}

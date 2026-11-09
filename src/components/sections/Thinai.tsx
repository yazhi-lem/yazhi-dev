"use client";
import { motion } from "framer-motion";
import { TinaiMark } from "@yazhi/bubble";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { THINAI_WORLD, type ThinaiKey } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

/** Yazh's world — the five thinai, straight from the deck (p5). Sangam
    poetry sorts the world into these five landscapes and Yazh's story
    library is organised the same way, so this sits after Open Sangam:
    the taxonomy is the bridge between the corpus and the stories a child
    actually hears. */
export function Thinai() {
  const t = useSiteT();
  return (
    <Section id="thinai">
      <Bi
        as="p"
        ta={t("site.thinai.eyebrow")}
        en={t("site.thinai.eyebrow", undefined, { language: "en" })}
        className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]"
        separator={<span aria-hidden>·</span>}
      />
      <Bi
        as="h2"
        ta={t("site.thinai.title")}
        en={t("site.thinai.title", undefined, { language: "en" })}
        className="mt-3 flex flex-col gap-1 font-display text-[length:var(--text-3xl)] font-bold"
      />

      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
      >
        {THINAI_WORLD.landscapes.map((l, i) => (
          <motion.li
            key={l.key}
            variants={fadeUp}
            className="border-t border-ivory/15 pt-4"
          >
            <span
              aria-hidden
              className="mb-3 grid h-10 w-10 place-items-center rounded-full border"
              style={{ color: `var(--${l.key})`, borderColor: `color-mix(in oklab, var(--${l.key}) 45%, transparent)` }}
            >
              <TinaiMark tinai={l.key as ThinaiKey} size={18} />
            </span>
            <Bi
              ta={t(`site.thinai.landscape.${i}.name`)}
              en={t(`site.thinai.landscape.${i}.name`, undefined, { language: "en" })}
              className="flex flex-col gap-0.5"
              taClass="font-display text-xl font-semibold"
              enClass="font-display text-lg text-ivory-dim"
            />
            <p className="mt-2 text-sm" style={{ color: `var(--${l.key})` }}>{t(`site.thinai.landscape.${i}.mood`)}</p>
            <p className="mt-2 text-sm text-ivory-dim">{t(`site.thinai.landscape.${i}.body`)}</p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mt-10 max-w-prose text-sm text-ivory-dim/85"
      >
        {t("site.thinai.foot")}
      </motion.p>
    </Section>
  );
}

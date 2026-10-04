"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MOVEMENT } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";

const NUM = ["௧", "௨", "௩", "௪", "௫"];

function Sub({ ta, en }: { ta: string; en: string }) {
  return (
    <h3 className="mt-14">
      <Bi ta={ta} en={en} className="flex flex-wrap gap-x-2 text-sm text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
    </h3>
  );
}

/** Who Yazhi is: a people's movement — how it works, and the five rules
    (அறம்) it holds itself to — then Yazhi 2030 in one line. Kurinji
    (new beginnings) governs it. */
export function Movement() {
  return (
    <Section id="movement">
      <SectionTitle
        eyebrow={{ ta: MOVEMENT.eyebrowTa, en: MOVEMENT.eyebrowEn }}
        title={{ ta: MOVEMENT.titleTa, en: MOVEMENT.titleEn }}
        lead={{ ta: MOVEMENT.leadTa, en: MOVEMENT.leadEn }}
      />

      <Sub ta={MOVEMENT.howTa} en={MOVEMENT.howEn} />
      <motion.ul
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        {MOVEMENT.pillars.map((p) => (
          <motion.li key={p.headEn} variants={fadeUp} className="border-t-2 border-[color:var(--accent)]/50 pt-5">
            <h4>
              <Bi
                ta={p.headTa} en={p.headEn}
                className="flex flex-col gap-0.5"
                taClass="font-display text-[length:var(--text-xl)] font-semibold text-ivory"
                enClass="text-sm text-ivory-dim"
              />
            </h4>
            <Bi as="p" ta={p.bodyTa} en={p.bodyEn} className="mt-3 flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
          </motion.li>
        ))}
      </motion.ul>

      <Sub ta={MOVEMENT.aramTa} en={MOVEMENT.aramEn} />
      <motion.ol
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-5 flex flex-col divide-y divide-ivory/10 rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/60 backdrop-blur"
      >
        {MOVEMENT.aram.map((r, i) => (
          <motion.li key={r.nameEn} variants={fadeUp} className="grid grid-cols-[2rem_1fr] gap-x-3 gap-y-1 px-5 py-4 sm:grid-cols-[2rem_14rem_1fr] sm:items-baseline">
            <span aria-hidden className="font-display text-lg text-[color:var(--accent)]">{NUM[i]}</span>
            <Bi
              ta={r.nameTa} en={r.nameEn}
              className="flex flex-col"
              taClass="font-display text-lg font-semibold text-ivory"
              enClass="text-xs text-ivory-dim"
            />
            <Bi ta={r.ruleTa} en={r.ruleEn} className="col-start-2 flex flex-col gap-0.5 text-ivory-dim sm:col-start-3" enClass="text-sm" />
          </motion.li>
        ))}
      </motion.ol>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 rounded-full border border-[color:var(--accent)]/30 px-6 py-4 text-center">
        <Bi
          as="p" ta={MOVEMENT.visionTa} en={MOVEMENT.visionEn}
          className="flex flex-col gap-1"
          taClass="font-display text-[length:var(--text-lg)] text-ivory"
          enClass="text-sm text-ivory-dim"
        />
      </motion.div>
    </Section>
  );
}

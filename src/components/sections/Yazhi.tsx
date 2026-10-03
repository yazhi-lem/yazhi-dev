"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Bi } from "@/components/ui/Bi";
import { IDENTITY, LAUNCH_LINE, THINAI_HEADINGS, YAZHI_DEMO, YAZHI_SECTION } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { stagger, fadeUp } from "@/lib/motionPresets";

const H = THINAI_HEADINGS.kurinji;

/** A sample conversation with Avai, labelled as a sample: one sourced
    answer, then an honest "I don't know" — Aram rule 1 at work. */
function DemoChat() {
  const { lang } = useLang();
  return (
    <figure className="mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-ivory/12 bg-night-2/70 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-ivory/10 px-5 py-4">
        <div aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--accent)]/20 font-display text-sm font-semibold text-[color:var(--accent)]">
          அ
        </div>
        <div>
          <Bi as="p" ta={YAZHI_DEMO.agentTa} en={YAZHI_DEMO.agentEn} className="flex gap-1.5 font-display text-sm font-semibold text-ivory" separator={<span aria-hidden>·</span>} />
          <Bi as="p" ta={YAZHI_DEMO.labelTa} en={YAZHI_DEMO.labelEn} className="flex gap-1.5 text-xs text-ivory-dim" separator={<span aria-hidden>·</span>} />
        </div>
      </div>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-3 px-4 py-5"
      >
        {YAZHI_DEMO.messages.map((m, i) => (
          <motion.li key={i} variants={fadeUp} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.from === "user" ? "rounded-br-sm bg-[color:var(--accent)]/25 text-ivory" : "rounded-bl-sm bg-ivory/8 text-ivory"
              }`}
            >
              <span className="sr-only">{m.from === "user" ? "Question: " : `${YAZHI_DEMO.agentEn}: `}</span>
              <Bi as="p" ta={m.textTa} en={m.textEn} className="flex flex-col gap-0.5 text-sm" enClass={lang === "both" ? "text-[12px] text-ivory-dim" : ""} />
              {m.sourceTa && m.sourceEn && (
                <Bi as="p" ta={m.sourceTa} en={m.sourceEn} className="mt-2 flex flex-col gap-0.5 border-t border-ivory/10 pt-2 text-[11px] text-ivory-dim" />
              )}
            </div>
            {m.tool && (
              <span className="mt-1 rounded-full border border-ivory/15 px-2 py-0.5 font-mono text-[10px] text-ivory-dim">{m.tool}</span>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </figure>
  );
}

/** The 2026 launch line: date, what, tier, and the gate it must pass. */
function LaunchLine() {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-16">
      <Bi as="h3" ta={LAUNCH_LINE.titleTa} en={LAUNCH_LINE.titleEn} className="flex flex-col gap-1 font-display text-2xl font-semibold" />
      <Bi as="p" ta={LAUNCH_LINE.noteTa} en={LAUNCH_LINE.noteEn} className="mt-2 flex flex-col gap-0.5 text-sm text-ivory-dim" />
      <ol className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {LAUNCH_LINE.items.map((it) => (
          <li key={it.nameEn} className="border-t border-ivory/15 pt-3">
            <Bi as="p" ta={it.dateTa} en={it.dateEn} className="flex gap-1.5 text-xs text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
            <Bi as="p" ta={it.nameTa} en={it.nameEn} className="mt-1 flex flex-col font-display text-lg font-semibold text-ivory" enClass="text-sm font-normal text-ivory-dim" />
            <Bi as="p" ta={it.tierTa} en={it.tierEn} className="mt-1 flex flex-col text-sm text-ivory-dim" />
            <p className="mt-1 text-xs text-ivory-dim/85">
              <Bi ta={it.gateTa} en={it.gateEn} className="flex flex-col gap-0.5" />
            </p>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

/** Yazhi — the collective, and the first rule its agents keep. Kurinji
    (mountains · new beginnings) governs it: the launch section. */
export function Yazhi() {
  return (
    <Section id="yazhi">
      <SectionHeading
        thinaiTa={H.ta} thinaiEn={H.en} landscapeTa={H.landscapeTa} landscape={H.landscapeEn}
        titleTa={IDENTITY.nameTa} titleEn={IDENTITY.nameEn}
        subTa={YAZHI_SECTION.subTa} subEn={YAZHI_SECTION.subEn}
        plainTa={YAZHI_SECTION.plainTa} plainEn={YAZHI_SECTION.plainEn}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        <DemoChat />
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <Bi as="p" ta={YAZHI_SECTION.bodyTa} en={YAZHI_SECTION.bodyEn} className="mx-auto flex max-w-prose flex-col gap-3 text-center text-ivory-dim" />
      </motion.div>

      <LaunchLine />
    </Section>
  );
}

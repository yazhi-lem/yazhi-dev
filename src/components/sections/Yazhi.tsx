"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ADHAN_CHAT, IDENTITY, YAZHI_SECTION } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Yazhi itself, shown as a live conversation: one chat sliding between
    Tamil, Telugu and Hindi with no restart in between, reaching the tools
    a family already uses. This is the umbrella the three products sit
    under (deck p1) — Yazh, Adhan and Open Sangam each get their own
    section after it. */
function ChatSpace() {
  return (
    <div
      role="img"
      aria-label="A chat with Yazhi moving between Tamil, Telugu, and Hindi without restarting, including a corpus search and a WhatsApp send"
      className="mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-ivory/12 bg-night-2/70 shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b border-ivory/10 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--accent)]/20 font-display text-sm font-semibold text-[color:var(--accent)]">
          {IDENTITY.nameEn[0]}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ivory">{IDENTITY.nameEn}</p>
          <p className="flex items-center gap-1.5 text-xs text-ivory-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            online — 22+ languages
          </p>
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-3 px-4 py-5"
        aria-hidden
      >
        {ADHAN_CHAT.map((m, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                m.from === "user"
                  ? "rounded-br-sm bg-[color:var(--accent)]/25 text-ivory"
                  : "rounded-bl-sm bg-ivory/8 text-ivory"
              }`}
            >
              <p className="text-sm">{m.text}</p>
              <p className="mt-0.5 text-[11px] text-ivory-dim/80">{m.translationEn}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 px-1">
              <span className="text-[10px] uppercase tracking-widest text-ivory-dim/60">{m.lang}</span>
              {m.tool && (
                <span className="rounded-full border border-ivory/15 px-2 py-0.5 font-mono text-[10px] text-ivory-dim">
                  {m.tool}
                </span>
              )}
            </div>
          </motion.div>
        ))}
        <motion.div variants={fadeUp} className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-ivory/8 px-4 py-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-ivory-dim"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Yazhi() {
  return (
    <Section id="yazhi">
      <SectionHeading
        thinaiTa="குறிஞ்சி" thinaiEn="Kurinji" landscapeTa="மலை · புணர்தல்" landscape="Mountains · first meetings"
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
        <ChatSpace />
      </motion.div>

      <motion.p
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        lang="en"
        className="mx-auto max-w-prose text-center text-ivory-dim"
      >
        {YAZHI_SECTION.bodyEn}
      </motion.p>
    </Section>
  );
}

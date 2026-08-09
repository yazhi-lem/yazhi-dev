"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { Card } from "@/components/ui/Card";
import { ADHAN, ADHAN_CHAT, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** The chat space: one conversation sliding between Tamil, Telugu and
    Hindi with no restart in between, plus the tool calls (WhatsApp, corpus
    search) an agent built on Adhan actually reaches. A real chat mockup
    reads faster than a diagram — this is what "22+ languages" looks like
    from the seat of someone typing. */
function ChatSpace() {
  return (
    <div
      role="img"
      aria-label="A chat with Adhan moving between Tamil, Telugu, and Hindi without restarting, including a corpus search and a WhatsApp send"
      className="mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-ivory/12 bg-night-2/70 shadow-2xl"
    >
      {/* header */}
      <div className="flex items-center gap-3 border-b border-ivory/10 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--accent)]/20 font-display text-sm font-semibold text-[color:var(--accent)]">
          {ADHAN.nameEn[0]}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ivory">{ADHAN.nameEn}</p>
          <p className="flex items-center gap-1.5 text-xs text-ivory-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            online — 22+ languages
          </p>
        </div>
      </div>

      {/* messages */}
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
        {/* always-ready typing cue, closing the loop */}
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

/** Mullai (forest · waiting) governs Adhan: a model is grown patiently,
    like a forest — training as cultivation, not conquest. */
export function Adhan() {
  return (
    <Section id="adhan">
      <SectionHeading
        thinaiTa="முல்லை" thinaiEn="Mullai" landscapeTa="காடு · இருத்தல்" landscape="Forest · waiting"
        titleTa={ADHAN.nameTa} titleEn={ADHAN.nameEn}
        subTa={ADHAN.subTa} subEn={ADHAN.subEn}
        plainTa={ADHAN.plainTa} plainEn={ADHAN.plainEn}
      />

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.p variants={fadeUp} lang="en" className="max-w-prose text-ivory-dim">
            {ADHAN.bodyEn}
          </motion.p>
          <motion.dl variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4">
            {ADHAN.stats.map((s) => (
              <Card key={s.en} interactive={false} className="!p-4 text-center">
                <dd className="font-display text-3xl font-semibold text-[color:var(--accent)]">{s.value}</dd>
                <dt className="mt-1">
                  <Bi ta={s.ta} en={s.en} className="flex flex-col text-xs text-ivory-dim" />
                </dt>
              </Card>
            ))}
          </motion.dl>
          <motion.div variants={fadeUp} className="mt-8">
            <Button href={ADHAN.ctaHref} external><Bi ta={ADHAN.ctaTa} en={UI.adhanCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} /></Button>
          </motion.div>

          {/* Token tax — same sentence, wildly different token cost per
              language. The reason a from-scratch tokenizer matters. */}
          <motion.div variants={fadeUp} className="mt-10">
            <p className="text-xs uppercase tracking-widest text-ivory-dim">{ADHAN.tokenTax.labelEn}</p>
            <dl className="mt-3 space-y-2">
              {ADHAN.tokenTax.rows.map((r) => {
                const pct = (parseFloat(r.multiplier) / 4.5) * 100;
                return (
                  <div key={r.lang} className="flex items-center gap-3 text-sm">
                    <dt className="w-16 shrink-0 text-ivory-dim">{r.lang}</dt>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ivory/10">
                      <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                    <dd className="w-10 shrink-0 text-right text-ivory-dim">{r.multiplier}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-2 text-xs text-ivory-dim/70">{ADHAN.tokenTax.sourceEn}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ChatSpace />
        </motion.div>
      </div>
    </Section>
  );
}

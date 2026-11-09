"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ADHAN_CHAT } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

/** Yazhi itself, shown as a live conversation: one chat sliding between
    Tamil, Telugu and Hindi with no restart in between, reaching the tools
    a family already uses. This is the umbrella the three products sit
    under (deck p1) — Yazh, Adhan and Open Sangam each get their own
    section after it. */
function ChatSpace({ name, alt, preview }: { name: string; alt: string; preview: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-ivory/12 bg-night-2/70 shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b border-ivory/10 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--accent)]/20 font-display text-sm font-semibold text-[color:var(--accent)]">
          {name[0]}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ivory">{name}</p>
          {/* Preview state, labelled as such (ITERATION-1): the live /chat
              surface answers "not connected" until YAZHI_API_URL is set, so
              a green "online" dot here would be a claim the site can't back. */}
          <p className="flex items-center gap-1.5 text-xs text-ivory-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            {preview}
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
  const t = useSiteT();
  return (
    <Section id="yazhi">
      <SectionHeading
        thinaiKey="site.section.yazhi.thinai"
        landscapeKey="site.section.yazhi.landscape"
        titleKey="site.identity.name"
        subKey="site.yazhi.sub"
        plainKey="site.yazhi.plain"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        <ChatSpace
          name={t("site.identity.name")}
          alt={t("site.yazhi.chatAlt")}
          preview={t("site.yazhi.preview")}
        />
      </motion.div>

      <motion.p
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mx-auto max-w-prose text-center text-ivory-dim"
      >
        {t("site.yazhi.body")}
      </motion.p>
    </Section>
  );
}

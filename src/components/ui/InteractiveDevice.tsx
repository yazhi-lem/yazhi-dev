"use client";

import { motion } from "framer-motion";
import { ADHAN_CHAT } from "@/lib/content";
import { useSiteT, useLocale } from "@/lib/i18n";

export function InteractiveDevice() {
  const t = useSiteT();
  const { locale } = useLocale();

  const isTa = locale === "ta";
  // Display top 3 realistic dialogue turns
  const messages = ADHAN_CHAT.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[285px] sm:max-w-[305px] select-none"
    >
      {/* Phone chassis */}
      <div className="relative overflow-hidden rounded-[44px] border border-ivory/15 bg-night-2 p-2 shadow-2xl">
        {/* Screen OLED Surface */}
        <div className="relative flex w-full flex-col overflow-hidden rounded-[38px] border border-ivory/10 bg-night aspect-[9/18.5]">
          {/* Status Bar */}
          <div className="relative z-20 flex items-center justify-between px-5 pt-3 shrink-0">
            <span className="font-mono text-[11px] font-semibold text-ivory">11:11</span>
            {/* Dynamic Island */}
            <div className="h-4 w-20 rounded-full bg-black border border-ivory/10" />
            <div className="flex items-center gap-1">
              <span className="font-mono text-[9px] text-ivory-dim">5G</span>
              <div className="h-2 w-4 rounded-[2px] border border-ivory/50 p-0.5">
                <div className="h-full w-full bg-ivory-dim" />
              </div>
            </div>
          </div>

          {/* In-App Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-ivory/10 bg-night-2/90 px-4 py-2.5 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Yazhi Ivory Mark */}
              <div className="h-7 w-7 rounded-full bg-ivory/10 border border-ivory/20 flex items-center justify-center p-1">
                <svg viewBox="0 0 100 100" fill="currentColor" className="h-4 w-4 text-ivory" aria-hidden>
                  <circle cx="30.8" cy="30.6" r="12.3" />
                  <circle cx="65.2" cy="26.9" r="16.3" />
                  <circle cx="47.2" cy="67.4" r="22" />
                </svg>
              </div>
              <div>
                <p className="font-display text-xs font-semibold text-ivory">
                  {t("site.identity.name")}
                </p>
                <p className="flex items-center gap-1.5 text-[10px] text-ivory-dim font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {t("site.yazhi.preview")}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-1 flex-col gap-2.5 p-3.5 overflow-y-auto">
            {messages.map((m, i) => {
              const isUser = m.from === "user";
              const displayText = isTa ? m.text : m.translationEn;

              return (
                <div
                  key={i}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isUser
                        ? "rounded-br-sm bg-[color:var(--accent)]/20 border border-[color:var(--accent)]/30 text-ivory"
                        : "rounded-bl-sm bg-ivory/8 border border-ivory/10 text-ivory"
                    }`}
                  >
                    <p>{displayText}</p>
                    {m.tool && (
                      <span className="mt-1 block font-mono text-[9px] text-ivory-dim/60">
                        {m.tool}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts Footer */}
          <div className="shrink-0 border-t border-ivory/10 p-2.5 bg-night-2/50 flex flex-col gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              <span className="shrink-0 rounded-full border border-ivory/12 bg-ivory/5 px-2.5 py-1 text-[10px] text-ivory-dim font-sans">
                {isTa ? "கதை சொல்" : "Tell a story"}
              </span>
              <span className="shrink-0 rounded-full border border-ivory/12 bg-ivory/5 px-2.5 py-1 text-[10px] text-ivory-dim font-sans">
                {isTa ? "திருக்குறள்" : "Thirukkural"}
              </span>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="flex justify-center pt-1 pb-0.5">
              <div className="h-1 w-20 rounded-full bg-ivory/20" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GUARDIAN, LINKS } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { YazhiMascot } from "@/components/mascot/YazhiMascot";
import { useLang, useSiteT } from "@/lib/i18n";

const GREETINGS: Record<
  string,
  { name: string; main: string; sub: string; voiceLang: string }
> = {
  ta: {
    name: "தமிழ்",
    main: "“வணக்கம்! நான் யாழ்!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "ta-IN",
  },
  en: {
    name: "English",
    main: "“Hello! I am Yazh!”",
    sub: "“வணக்கம்! நான் யாழ்!”",
    voiceLang: "en-IN",
  },
  te: {
    name: "తెలుగు",
    main: "“నమస్కారం! నేను யாజ్!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "te-IN",
  },
  kn: {
    name: "ಕನ್ನಡ",
    main: "“ನಮಸ್ಕಾರ! ನಾನು யாజ్!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "kn-IN",
  },
  ml: {
    name: "മലയാളം",
    main: "“നമസ്കാരം! ഞാൻ யாழ்!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "ml-IN",
  },
};

export function Guardian() {
  const t = useSiteT();
  const { lang: siteLang } = useLang();
  const [selectedLang, setSelectedLang] = useState<string>("ta");
  const [showGreeting, setShowGreeting] = useState(false);

  // Sync initial language with display preference
  useEffect(() => {
    if (siteLang === "en") setSelectedLang("en");
    else setSelectedLang("ta");
  }, [siteLang]);

  // Auto-dismiss greeting after 10 seconds of inactivity
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [showGreeting, selectedLang]);

  const speakGreeting = useCallback((text: string, voiceCode: string) => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const cleanText = text.replace(/[“”"']/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = voiceCode;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio speech ignored if blocked by browser policy
    }
  }, []);

  const toggleMascotGreeting = useCallback(() => {
    setShowGreeting((prev) => {
      const next = !prev;
      if (next) {
        const active = GREETINGS[selectedLang] || GREETINGS.ta;
        speakGreeting(active.main, active.voiceLang);
      } else {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
      return next;
    });
  }, [selectedLang, speakGreeting]);

  const handleLanguageSelect = (targetLang: string) => {
    setSelectedLang(targetLang);
    setShowGreeting(true);
    const activeGreeting = GREETINGS[targetLang] || GREETINGS.ta;
    speakGreeting(activeGreeting.main, activeGreeting.voiceLang);
  };

  const currentGreeting = GREETINGS[selectedLang] || GREETINGS.ta;

  return (
    <Section id="guardian" className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Story, Voice Guardian Narrative & Dual CTAs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col justify-center lg:col-span-7"
        >
          <SectionHeading
            thinaiKey="site.section.guardian.thinai"
            landscapeKey="site.section.guardian.landscape"
            titleKey="site.yazh.name"
            subKey="site.yazh.sub"
            plainKey="site.yazh.plain"
          />

          <Bi
            as="p"
            ta={t("site.yazh.eyebrow")}
            en={t("site.yazh.eyebrow", undefined, { language: "en" })}
            className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)] font-mono"
            separator={<span aria-hidden>·</span>}
          />

          <motion.div variants={fadeUp}>
            <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-ivory-dim">
              {t("site.yazh.body")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={GUARDIAN.ctaHref}>
              <Bi
                ta={t("site.yazh.cta")}
                en={t("site.yazh.cta", undefined, { language: "en" })}
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
            <Button href={LINKS.whatsapp} variant="ghost" external>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.486 2 2.01 6.477 2.01 11.995c0 1.997.583 3.855 1.588 5.418L2 22l4.71-1.564a9.947 9.947 0 0 0 5.294 1.517h.004c5.518 0 9.994-4.477 9.994-9.995C21.998 6.477 17.522 2.001 12.004 2Zm0 18.16h-.003a8.15 8.15 0 0 1-4.163-1.14l-.298-.177-3.114 1.033 1.048-3.033-.194-.312a8.146 8.146 0 0 1-1.258-4.353c0-4.518 3.66-8.187 8.176-8.187 2.183 0 4.234.85 5.777 2.393a8.117 8.117 0 0 1 2.394 5.788c0 4.518-3.66 8.188-8.365 8.188Z" />
              </svg>
              <Bi
                ta={t("site.yazh.whatsappCta")}
                en={t("site.yazh.whatsappCta", undefined, { language: "en" })}
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-3.5 border-l border-white/15 pl-3">
            <Bi
              ta={t("site.yazh.whatsappNote")}
              en={t("site.yazh.whatsappNote", undefined, { language: "en" })}
              className="flex flex-col gap-0.5 text-[11px] text-ivory-dim/75"
            />
          </motion.div>
        </motion.div>

        {/* Right Column: Yazhi Animated Guardian Mascot on Ambient Stage */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative flex flex-col items-center justify-center lg:col-span-5"
        >
          {/* Subtle ambient spotlight backdrop behind mascot */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, color-mix(in oklab, var(--palai) 45%, transparent), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Pop-up Incoming Greeting Notification */}
            <AnimatePresence>
              {showGreeting && (
                <motion.div
                  key="mascot-greeting-popup"
                  initial={{ opacity: 0, y: 16, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="absolute -top-[185px] sm:-top-[195px] z-50 flex flex-col items-center select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex flex-col rounded-2xl border border-gold/60 bg-[#0a0a0f]/98 p-3.5 sm:p-4 shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(211,179,106,0.3)] backdrop-blur-2xl max-w-[295px] sm:max-w-[345px]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Yazhi brand logo avatar thumbnail */}
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/60 bg-[#141624] p-1.5 shadow-md flex items-center justify-center">
                        <Image
                          src="/logos/yazhi-mark.svg"
                          alt="Yazh Logo"
                          width={24}
                          height={24}
                          className="h-full w-full object-contain"
                        />
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                      </div>

                      {/* Message Bubble Content */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-display text-xs font-bold text-ivory tracking-wide">
                            {"யாழ் · Yazh"}
                          </span>
                          <span className="font-mono text-[9px] text-ivory-dim/60">
                            {"11:11 · now"}
                          </span>
                        </div>

                        {/* Incoming Greeting Text: Dynamically reflects selected language */}
                        <div className="mt-1 flex flex-col gap-0.5">
                          <p className="font-display text-sm sm:text-base font-bold text-gold tracking-tight leading-snug">
                            {currentGreeting.main}
                          </p>
                          <p className="font-display text-xs font-semibold text-ivory-dim/90 tracking-tight leading-snug">
                            {currentGreeting.sub}
                          </p>
                        </div>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-mono text-[9px] text-gold/85 uppercase tracking-wider">
                            {"குரல் நண்பன் · Voice AI"}
                          </span>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGreeting(false);
                          if (typeof window !== "undefined" && "speechSynthesis" in window) {
                            window.speechSynthesis.cancel();
                          }
                        }}
                        className="text-ivory-dim/40 hover:text-ivory transition-colors p-1"
                        aria-label="Close greeting"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Multi-language Selector Pills */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1 border-t border-white/10 pt-2">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-ivory-dim/50 mr-0.5">
                        {"மொழிகள்:"}
                      </span>
                      {Object.entries(GREETINGS).map(([code, g]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLanguageSelect(code);
                          }}
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-medium transition-all ${
                            selectedLang === code
                              ? "bg-gold text-night font-bold shadow-xs scale-105"
                              : "bg-white/[0.08] text-ivory-dim hover:text-ivory hover:bg-white/15"
                          }`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>

                    {/* Speech bubble notch */}
                    <div
                      aria-hidden
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-gold/60"
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 h-0 w-0 border-x-7 border-x-transparent border-t-7 border-t-[#0a0a0f]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap Me Hint Chip before clicked */}
            {!showGreeting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-8 z-20 flex items-center gap-1 rounded-full border border-gold/40 bg-black/80 px-2.5 py-0.5 font-mono text-[10px] text-gold/90 shadow-sm backdrop-blur-sm"
              >
                <span>✨</span>
                <Bi
                  as="span"
                  ta="தொட்டுப் பாருங்கள்"
                  en="Tap me"
                  separator={<span aria-hidden>·</span>}
                />
              </motion.div>
            )}

            {/* Interactive Clickable Mascot Container */}
            <div
              role="button"
              tabIndex={0}
              onClick={toggleMascotGreeting}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMascotGreeting();
                }
              }}
              aria-label={
                siteLang === "en"
                  ? "Tap Yazh to toggle greeting"
                  : siteLang === "ta"
                  ? "யாழ் வாழ்த்து பெற அல்லது மறைக்க தொடுக"
                  : "யாழ் வாழ்த்து பெற அல்லது மறைக்க தொடுக · Tap Yazh to toggle greeting"
              }
              className="group relative cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus:outline-none"
            >
              <YazhiMascot
                mode="video"
                size="lg"
                priority
                alt="Yazh — sovereign mythical temple guardian animation"
              />
            </div>

            {/* Soft contact floor shadow */}
            <div
              aria-hidden
              className="mt-1 h-3.5 w-44 rounded-full bg-black/50 blur-md"
            />
            <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-ivory-dim/70">
              <Bi
                ta="யாழ் · கோவில் காவலாளி"
                en="Yazh · Temple Guardian"
                separator={<span aria-hidden>·</span>}
              />
            </figcaption>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

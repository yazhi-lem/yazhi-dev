"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GUARDIAN, LINKS } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { YazhiMascot } from "@/components/mascot/YazhiMascot";
import { useLang } from "@/lib/i18n";

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
    main: "“నమస్కారం! నేను యాజ్!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "te-IN",
  },
  hi: {
    name: "हिन्दी",
    main: "“नमस्ते! मैं याज़ हूँ!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "hi-IN",
  },
  kn: {
    name: "ಕನ್ನಡ",
    main: "“ನಮಸ್ಕಾರ! ನಾನು ಯಾಜ್!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "kn-IN",
  },
  ml: {
    name: "മലയാളം",
    main: "“നമസ്കാരം! ഞാൻ യാഴ്!”",
    sub: "“Hello! I am Yazh!”",
    voiceLang: "ml-IN",
  },
};

export function Guardian() {
  const { lang: siteLang } = useLang();
  const [selectedLang, setSelectedLang] = useState<string>("ta");
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingKey, setGreetingKey] = useState(0);

  // Sync default greeting with site language toggle
  useEffect(() => {
    if (siteLang === "en") setSelectedLang("en");
    else if (siteLang === "ta" || siteLang === "both") setSelectedLang("ta");
  }, [siteLang]);

  // Auto-dismiss greeting after 8 seconds
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showGreeting, greetingKey]);

  const speakGreeting = (text: string, voiceCode: string) => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[“”"']/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = voiceCode;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio speech ignored if blocked by browser policy
    }
  };

  const toggleMascotGreeting = () => {
    if (showGreeting) {
      setShowGreeting(false);
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // Audio speech cancel ignored
      }
    } else {
      setShowGreeting(true);
      setGreetingKey((prev) => prev + 1);
      const activeGreeting = GREETINGS[selectedLang] || GREETINGS.ta;
      speakGreeting(activeGreeting.main, activeGreeting.voiceLang);
    }
  };

  const handleLanguageSelect = (targetLang: string) => {
    setSelectedLang(targetLang);
    setShowGreeting(true);
    setGreetingKey((prev) => prev + 1);
    const activeGreeting = GREETINGS[targetLang] || GREETINGS.ta;
    speakGreeting(activeGreeting.main, activeGreeting.voiceLang);
  };

  const currentGreeting = GREETINGS[selectedLang] || GREETINGS.ta;

  return (
    <Section id="guardian" fullHeight className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Story, Voice Guardian Narrative & Dual CTAs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="text-scrim flex flex-col justify-center lg:col-span-7"
        >
          <SectionHeading
            thinaiTa="பாலை"
            thinaiEn="Palai"
            landscapeTa="பாலைவனம் · பிரிதல்"
            landscape="Desert · hardship endured"
            titleTa={GUARDIAN.nameTa}
            titleEn={GUARDIAN.nameEn}
            subTa={GUARDIAN.subTa}
            subEn={GUARDIAN.subEn}
            plainTa={GUARDIAN.plainTa}
            plainEn={GUARDIAN.plainEn}
            className="mb-3.5"
          />

          <motion.div variants={fadeUp}>
            <Bi
              as="p"
              ta={GUARDIAN.bodyTa}
              en={GUARDIAN.bodyEn}
              className="max-w-3xl text-xs sm:text-sm leading-relaxed text-ivory-dim flex flex-col gap-1.5"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={GUARDIAN.ctaHref}>
              <Bi ta={GUARDIAN.ctaTa} en={GUARDIAN.ctaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
            <Button href={LINKS.whatsapp} variant="ghost" external>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.486 2 2.01 6.477 2.01 11.995c0 1.997.583 3.855 1.588 5.418L2 22l4.71-1.564a9.947 9.947 0 0 0 5.294 1.517h.004c5.518 0 9.994-4.477 9.994-9.995C21.998 6.477 17.522 2.001 12.004 2Zm0 18.16h-.003a8.15 8.15 0 0 1-4.163-1.14l-.298-.177-3.114 1.033 1.048-3.033-.194-.312a8.146 8.146 0 0 1-1.258-4.353c0-4.518 3.66-8.187 8.176-8.187 2.183 0 4.234.85 5.777 2.393a8.117 8.117 0 0 1 2.394 5.788c0 4.518-3.66 8.188-8.365 8.188Z" />
              </svg>
              <Bi ta={GUARDIAN.whatsappCtaTa} en={GUARDIAN.whatsappCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-3.5 border-l border-white/15 pl-3">
            <Bi ta={GUARDIAN.whatsappNoteTa} en={GUARDIAN.whatsappNoteEn} className="flex flex-col gap-0.5 text-[11px] text-ivory-dim/75" />
          </motion.div>
        </motion.div>

        {/* Right Column: Yazhi Animated Guardian Mascot on Ambient Pedestal Stage */}
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
            {/* Pop-up Incoming Text Message Notification */}
            <AnimatePresence>
              {showGreeting && (
                <motion.div
                  key={`msg-popup-${greetingKey}`}
                  initial={{ opacity: 0, y: 16, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="absolute -top-32 sm:-top-36 z-30 flex flex-col items-center select-none"
                >
                  <div className="relative flex flex-col rounded-2xl border border-gold/50 bg-[#0d0e12]/95 p-3 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(211,179,106,0.25)] backdrop-blur-xl max-w-[290px] sm:max-w-[340px]">
                    <div className="flex items-start gap-3">
                      {/* Yazhi DP avatar thumbnail */}
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/60 bg-night-2 p-0.5 shadow-md">
                        <Image
                          src="/images/mascot/yazhidp.png"
                          alt="Yazh"
                          width={36}
                          height={36}
                          className="h-full w-full rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                      </div>

                      {/* Message Bubble Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1.5">
                          <Bi
                            as="span"
                            ta="யாழ்"
                            en="Yazh"
                            className="font-display text-xs font-bold text-ivory tracking-wide"
                            separator=" · "
                          />
                          <Bi
                            as="span"
                            ta="11:11 · இப்போது"
                            en="11:11 · now"
                            className="font-mono text-[9px] text-ivory-dim/60"
                          />
                        </div>

                        {/* Incoming Greeting Text: Strictly respects language mode */}
                        {siteLang === "both" ? (
                          <div className="mt-1 flex flex-col gap-0.5">
                            <p className="font-display text-sm sm:text-base font-bold text-gold tracking-tight leading-snug">
                              “வணக்கம்! நான் யாழ்!”
                            </p>
                            <p className="font-display text-xs sm:text-sm font-semibold text-ivory-dim/95 tracking-tight leading-snug">
                              “Hello! I am Yazh!”
                            </p>
                          </div>
                        ) : siteLang === "en" ? (
                          <div className="mt-1">
                            <p className="font-display text-sm sm:text-base font-bold text-gold tracking-tight leading-snug">
                              “Hello! I am Yazh!”
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="font-display text-sm sm:text-base font-bold text-gold tracking-tight leading-snug">
                              {currentGreeting.main}
                            </p>
                          </div>
                        )}

                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <Bi
                            as="span"
                            ta="குரல் நண்பன்"
                            en="Voice AI Friend"
                            className="font-mono text-[9px] text-gold/85 uppercase tracking-wider"
                            separator=" · "
                          />
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGreeting(false);
                        }}
                        className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full text-ivory-dim/50 hover:text-ivory hover:bg-white/10 transition-colors"
                        aria-label="Dismiss greeting"
                      >
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Multi-language Selector Pills */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1 border-t border-white/10 pt-2">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-ivory-dim/50 mr-0.5">
                        {siteLang === "en" ? "Languages:" : "மொழிகள்:"}
                      </span>
                      {Object.entries(GREETINGS).map(([code, g]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLanguageSelect(code);
                          }}
                          className={`rounded-full px-2 py-0.5 text-[9px] font-medium transition-all ${
                            selectedLang === code
                              ? "bg-gold/25 text-gold border border-gold/45 shadow-xs"
                              : "bg-white/[0.04] text-ivory-dim/70 hover:text-ivory hover:bg-white/10"
                          }`}
                        >
                          {siteLang === "en" ? (code === "ta" ? "Tamil" : g.name) : g.name}
                        </button>
                      ))}
                    </div>

                    {/* Speech bubble notch pointing to the mascot */}
                    <div
                      aria-hidden
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-gold/50"
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 h-0 w-0 border-x-7 border-x-transparent border-t-7 border-t-[#0d0e12]"
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
                className="pointer-events-none absolute -top-8 z-20 flex items-center gap-1 rounded-full border border-gold/30 bg-black/60 px-2.5 py-0.5 font-mono text-[10px] text-gold/90 shadow-sm backdrop-blur-sm"
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

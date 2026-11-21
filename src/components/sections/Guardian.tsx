"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GUARDIAN, LINKS } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { YazhiVideoMascot } from "@/components/mascot/YazhiVideoMascot";
import { useLocale, useSiteT } from "@/lib/i18n";

export function Guardian() {
  const t = useSiteT();
  const { locale } = useLocale();
  const [showGreeting, setShowGreeting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const greetingText = t("site.yazh.greeting");

  const speakGreeting = useCallback((text: string, loc: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const voices = synth.getVoices();
      const langPrefix = loc === "ta" ? "ta" : loc === "hi" ? "hi" : "en";
      const hasLocalVoice = voices.some(
        (v) => v.lang.startsWith(langPrefix) && v.localService
      );
      if (!hasLocalVoice) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = loc === "ta" ? "ta-IN" : loc === "hi" ? "hi-IN" : "en-IN";
      synth.speak(utterance);
    } catch {
      // Ignored if browser policy denies audio
    }
  }, []);

  const handleMascotClick = () => {
    const nextShow = !showGreeting;
    setShowGreeting(nextShow);
    if (nextShow && !isMuted) {
      speakGreeting(greetingText, locale);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && showGreeting) {
      speakGreeting(greetingText, locale);
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <Section id="guardian">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (7 cols): Heading, Narrative & CTAs */}
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

          <motion.div variants={fadeUp}>
            <p className="text-sm sm:text-base leading-relaxed text-ivory-dim">
              {t("site.yazh.body")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
            <Button href={GUARDIAN.ctaHref}>
              {t("site.yazh.cta")}
            </Button>
            <Button href={LINKS.whatsapp} variant="ghost" external>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current mr-1.5 inline-block">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.486 2 2.01 6.477 2.01 11.995c0 1.997.583 3.855 1.588 5.418L2 22l4.71-1.564a9.947 9.947 0 0 0 5.294 1.517h.004c5.518 0 9.994-4.477 9.994-9.995C21.998 6.477 17.522 2.001 12.004 2Zm0 18.16h-.003a8.15 8.15 0 0 1-4.163-1.14l-.298-.177-3.114 1.033 1.048-3.033-.194-.312a8.146 8.146 0 0 1-1.258-4.353c0-4.518 3.66-8.187 8.176-8.187 2.183 0 4.234.85 5.777 2.393a8.117 8.117 0 0 1 2.394 5.788c0 4.518-3.66 8.188-8.365 8.188Z" />
              </svg>
              {t("site.yazh.whatsappCta")}
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 border-l border-ivory/15 pl-3">
            <p className="text-xs text-ivory-dim/75 leading-relaxed">
              {t("site.yazh.whatsappNote")}
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column (5 cols): Yazhi Animated Mascot */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative flex flex-col items-center justify-center lg:col-span-5"
        >
          {/* Pop-up Greeting Bubble */}
          <AnimatePresence>
            {showGreeting && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                role="status"
                aria-live="polite"
                className="absolute -top-14 z-30 flex items-center gap-2.5 rounded-full border border-gold/40 bg-night-2/95 px-4 py-2 shadow-xl backdrop-blur-md"
              >
                <span className="font-display text-sm font-semibold text-ivory">
                  {greetingText}
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                  className="rounded-full p-1 text-ivory-dim hover:text-ivory transition-colors"
                >
                  {isMuted ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Mascot Video */}
          <YazhiVideoMascot
            alt={t("site.yazh.artAlt")}
            onClick={handleMascotClick}
            className="w-full max-w-[280px] sm:max-w-[320px]"
          />

          <p className="mt-2 text-xs text-ivory-dim/60">
            {t("site.yazh.caption")}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

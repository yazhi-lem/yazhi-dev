"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { THINAI } from "@/lib/content";
import { useLang } from "@/lib/i18n";

const ORDERED = ["kurinji", "mullai", "marutham", "neytal", "palai"] as const;

/** Intro loader: the five landscapes pass in sequence before the hero,
    setting the site's emotional register (BRAND_AND_CONTENT §2 dual-use).
    Skips under reduced motion; plays once per session. */
export function ThinaiIntro() {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(true); // SSR-safe default: hidden

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("yazhi-intro");
    if (reduced || seen) return;
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= ORDERED.length) {
        window.clearInterval(id);
        window.sessionStorage.setItem("yazhi-intro", "1");
        setDone(true);
      } else {
        setStep(i);
      }
    }, 620);
    return () => window.clearInterval(id);
  }, []);

  const t = THINAI.find((x) => x.key === ORDERED[step])!;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="presentation"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-night"
          style={{ backgroundImage: `radial-gradient(700px 500px at 50% 50%, color-mix(in oklab, var(--${t.key}) 22%, transparent), transparent 70%)` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <p aria-hidden className="mb-3 text-4xl">{t.icon}</p>
              {lang !== "en" && (
                <p lang="ta" className="font-display text-4xl font-semibold" style={{ color: `var(--${t.key})` }}>
                  {t.ta}
                </p>
              )}
              {lang !== "ta" && (
                <p lang="en" className={lang === "en" ? "font-display text-3xl font-semibold" : "mt-1 text-sm uppercase tracking-[0.3em] text-ivory-dim"} style={lang === "en" ? { color: `var(--${t.key})` } : undefined}>
                  {lang === "en" ? t.en : `${t.en} · ${t.landscape}`}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={() => { window.sessionStorage.setItem("yazhi-intro", "1"); setDone(true); }}
            className="absolute bottom-8 text-xs uppercase tracking-widest text-ivory-dim hover:text-ivory"
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

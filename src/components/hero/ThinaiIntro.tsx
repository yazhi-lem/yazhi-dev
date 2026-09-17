"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/ui/LogoMark";
import { SunkenRuins } from "@/components/ui/SunkenRuins";
import { Bubbles } from "@/components/ui/Bubbles";
import { IDENTITY } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";

/** Intro loader: a generic, brand-only moment (no per-thinai carousel —
    that content lives in the site itself, not the loading screen) styled
    as a dive into deep water, echoing the footer's sunken-city motif. The
    mark drifts down and settles as the ocean gradient deepens around it,
    a few bubbles rise past it, and the sunken ruins sit faintly on the
    floor below. Skips under reduced motion; plays once per session. */
export function ThinaiIntro() {
  const [done, setDone] = useState(true); // SSR-safe default: hidden

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("yazhi-intro");
    if (reduced || seen) return;
    setDone(false);
    const id = window.setTimeout(() => {
      window.sessionStorage.setItem("yazhi-intro", "1");
      setDone(true);
    }, 2200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="presentation"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(to bottom," +
              " var(--ocean-shallow) 0%," +
              " color-mix(in oklab, var(--ocean-shallow), var(--ocean-mid)) 35%," +
              " var(--ocean-mid) 62%," +
              " var(--ocean-deep) 100%)",
          }}
        >
          {/* the trench floor, faint below the surface */}
          <SunkenRuins className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40" />
          {/* a few bubbles rising past the mark as it sinks into view */}
          <Bubbles density="rare" className="pointer-events-none absolute inset-0 overflow-hidden" />

          <motion.div
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeIn" }}
            className="relative text-center"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <LogoMark size={56} className="mx-auto drop-shadow-[0_0_18px_rgba(120,190,215,0.35)]" />
              <Bi
                ta={IDENTITY.nameTa}
                en={IDENTITY.nameEn}
                className="mt-4 flex items-baseline justify-center gap-2 font-serif text-2xl font-semibold tracking-wide text-ivory"
                separator={<span aria-hidden className="text-ivory-dim">•</span>}
              />
            </motion.div>
          </motion.div>

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

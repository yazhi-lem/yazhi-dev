"use client";
import { motion } from "framer-motion";
import { useLang, type Lang } from "@/lib/i18n";

import { useEffect, useState } from "react";

/** The fluid three-way language toggle with spring motion pill and language-aware labels */
export function LangToggle() {
  const { lang, setLang } = useLang();
  const [lastExplicitLang, setLastExplicitLang] = useState<"ta" | "en">(
    lang === "en" ? "en" : "ta"
  );

  useEffect(() => {
    if (lang === "ta" || lang === "en") {
      setLastExplicitLang(lang);
      try {
        window.localStorage.setItem("yazhi-last-single-lang", lang);
      } catch {
        // ignore
      }
    }
  }, [lang]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("yazhi-last-single-lang") as "ta" | "en" | null;
      if (saved === "ta" || saved === "en") {
        setLastExplicitLang(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // 1. Tamil is ALWAYS in Tamil script: "தமிழ்"
  // 2. English is ALWAYS in English script: "English"
  // 3. Both changes respectively:
  //    - In Tamil mode (or switched from Tamil): "இரண்டும்"
  //    - In English mode (or switched from English): "Both"
  const bothLabel =
    lang === "ta"
      ? "இரண்டும்"
      : lang === "en"
        ? "Both"
        : lastExplicitLang === "ta"
          ? "இரண்டும்"
          : "Both";

  const options: { value: Lang; label: string }[] = [
    { value: "ta", label: "தமிழ்" },
    { value: "en", label: "English" },
    { value: "both", label: bothLabel },
  ];

  const groupLabel =
    lang === "en"
      ? "Language selection"
      : lang === "ta"
        ? "மொழித் தேர்வு"
        : "Language / மொழித் தேர்வு";

  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className="relative flex items-center gap-0.5 rounded-full border border-ivory/15 bg-night-2/80 p-0.5 sm:p-1 backdrop-blur-md shadow-sm"
    >
      {options.map((o) => {
        const isActive = lang === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setLang(o.value)}
            className={`relative rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-colors duration-200 [text-shadow:none] cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-gold ${
              isActive
                ? "text-night font-semibold"
                : "text-ivory-dim/75 hover:text-ivory"
            }`}
          >
            {/* Fluid sliding spring pill indicator */}
            {isActive && (
              <motion.span
                layoutId="active-lang-pill"
                className="absolute inset-0 rounded-full bg-gold shadow-[0_0_12px_rgba(227,180,88,0.45)]"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 34,
                }}
              />
            )}
            <span className="relative z-10 block transition-all duration-200">
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

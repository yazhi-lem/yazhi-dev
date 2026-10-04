"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Three-way language mode — kept exactly as the live site's TAM/ENG/BOTH toggle. */
export type Lang = "ta" | "en" | "both";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ta",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Tamil-first: the site always starts in Tamil; ENG / both are opt-in and
  // a returning visitor's saved choice is restored below.
  const [lang, setLang] = useState<Lang>("ta");

  // persist preference
  useEffect(() => {
    const saved = window.localStorage.getItem("yazhi-lang") as Lang | null;
    if (saved === "ta" || saved === "en" || saved === "both") setLang(saved);
  }, []);
  const set = (l: Lang) => {
    if (l === lang) return;
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("lang-transitioning");
      document.documentElement.setAttribute("lang", l === "both" ? "ta" : l);
      setTimeout(() => {
        document.documentElement.classList.remove("lang-transitioning");
      }, 350);
    }
    setLang(l);
    window.localStorage.setItem("yazhi-lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang: set }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

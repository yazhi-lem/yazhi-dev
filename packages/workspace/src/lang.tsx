"use client";
import { useCallback } from "react";
import { Segmented } from "@yazhi/bubble";
import { useStored } from "./store";
import type { Bi, WsLang } from "./types";

/** One language choice for every workspace (PRD: "one shared toggle").
    Tamil is the default; a workspace that doesn't speak the chosen
    language falls back to Tamil, local language first. */
export const LANG_KEY = "yazhi-ws-lang";

export const LANG_NAMES: Record<WsLang, { label: string; name: string }> = {
  ta: { label: "த", name: "தமிழ்" },
  en: { label: "EN", name: "English" },
  te: { label: "తె", name: "తెలుగు" },
};

export function pick(b: Bi | string, lang: WsLang): string {
  if (typeof b === "string") return b;
  if (lang === "te") return b.te ?? b.en;
  return b[lang];
}

export function useWsLang(available: WsLang[]) {
  const [chosen, setLang] = useStored<WsLang>(LANG_KEY, "ta");
  const lang: WsLang = available.includes(chosen) ? chosen : "ta";
  const t = useCallback((b: Bi | string) => pick(b, lang), [lang]);
  return { lang, setLang, t };
}

/** த | EN (| తె) — switches every label in the workspace. */
export function LangToggle({ available, lang, onChange }: { available: WsLang[]; lang: WsLang; onChange: (l: WsLang) => void }) {
  return (
    <Segmented
      label="Language"
      value={lang}
      onChange={onChange}
      options={available.map((l) => ({ value: l, label: <span title={LANG_NAMES[l].name}>{LANG_NAMES[l].label}</span>, lang: l }))}
    />
  );
}

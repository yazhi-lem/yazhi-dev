import type { CSSProperties } from "react";

/** Tones are the only colour input a Bubble component takes. The five
    thinai hues are the brand layer; the four semantic tones map onto
    them so status colour stays inside the palette:
      ok → mullai (growth), warn → marutham (harvest gold),
      error → palai (ochre), info → neytal (sea). */
export type Thinai = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";
export type Tone = Thinai | "gold" | "neutral" | "ok" | "warn" | "error" | "info";

const TONE_VAR: Record<Tone, string> = {
  kurinji: "var(--kurinji)",
  mullai: "var(--mullai)",
  marutham: "var(--marutham)",
  neytal: "var(--neytal)",
  palai: "var(--palai)",
  gold: "var(--gold)",
  neutral: "var(--ivory-dim)",
  ok: "var(--mullai)",
  warn: "var(--marutham)",
  error: "var(--palai)",
  info: "var(--neytal)",
};

export function toneVar(tone: Tone = "neutral"): string {
  return TONE_VAR[tone];
}

/** Sets `--tone` for a subtree. Every `.ybi-*` class reads it. */
export function toneStyle(tone?: Tone, extra?: CSSProperties): CSSProperties {
  return { "--tone": toneVar(tone), ...extra } as CSSProperties;
}

/** Score → tone, used by meters and quality badges. */
export function scoreTone(score: number): Tone {
  if (score >= 85) return "ok";
  if (score >= 60) return "warn";
  return "error";
}

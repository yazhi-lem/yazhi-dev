import type { ReactNode } from "react";

export type Tone = "neutral" | "ok" | "warn" | "risk" | "info" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "border-ivory/20 text-ivory-dim",
  ok: "border-mullai/50 text-mullai",
  warn: "border-gold/50 text-gold",
  risk: "border-palai/60 text-palai",
  info: "border-neytal/60 text-neytal",
  accent: "border-[color:var(--accent)]/60 text-[color:var(--accent)]",
};

/** A small status label. Latin text gets tracked caps; pass `lang="ta"`
    for Tamil, which is never letter-spaced. */
export function Pill({
  children,
  tone = "neutral",
  lang,
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  lang?: "ta" | "en";
  title?: string;
}) {
  const type = lang === "ta" ? "text-[11px]" : "font-mono text-[10px] uppercase tracking-wider";
  return (
    <span lang={lang} title={title} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${type} ${TONES[tone]}`}>
      {children}
    </span>
  );
}

/** Where an answer was computed. Every AI surface shows one. */
export function RuntimeBadge({ runtime }: { runtime: "device" | "yazhi-api" | "offline" }) {
  if (runtime === "device") return <Pill tone="ok" title="Ran on this device — nothing left it">on-device</Pill>;
  if (runtime === "offline") return <Pill tone="warn" title="No network — on-device models only">offline</Pill>;
  return <Pill tone="info" title="Ran on Adhan through yazhi-api">yazhi-api</Pill>;
}

/** Marks Tamil copy that has not passed native-speaker review yet. */
export function DraftTag({ what = "Tamil copy" }: { what?: string }) {
  return (
    <Pill tone="warn" title={`${what} is a draft until a native speaker reviews it`}>
      draft · native review
    </Pill>
  );
}

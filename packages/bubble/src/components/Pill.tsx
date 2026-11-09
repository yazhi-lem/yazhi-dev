import type { ReactNode } from "react";
import { useBubbleT } from "../locales";

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
  // Tamil and Telugu are never letter-spaced or set in mono caps, whether
  // or not the caller remembered to pass lang
  const indic = lang === "ta" || (typeof children === "string" && /[\u0B80-\u0BFF\u0C00-\u0C7F]/.test(children));
  const type = indic ? "text-[11px]" : "font-mono text-[10px] uppercase tracking-wider";
  return (
    <span lang={lang} title={title} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${type} ${TONES[tone]}`}>
      {children}
    </span>
  );
}

/** Where an answer was computed. Every AI surface shows one. The words
    come from the locale catalogue (`bubble.pill.*`); the `runtime` values
    themselves are fixed identifiers, not copy. */
export function RuntimeBadge({ runtime }: { runtime: "device" | "yazhi-api" | "offline" }) {
  const t = useBubbleT("bubble.pill");
  if (runtime === "device") return <Pill tone="ok" title={t("onDeviceTitle")}>{t("onDevice")}</Pill>;
  if (runtime === "offline") return <Pill tone="warn" title={t("offlineTitle")}>{t("offline")}</Pill>;
  return <Pill tone="info" title={t("apiTitle")}>yazhi-api</Pill>;
}

/** Marks Tamil copy that has not passed native-speaker review yet. */
export function DraftTag({ what }: { what?: string }) {
  const t = useBubbleT("bubble.pill");
  // `what` stays an override; absent, the label is the localised default.
  const subject = what ?? t("draftWhat");
  return (
    <Pill tone="warn" title={t("draftTitle", { what: subject })}>
      {t("draft")}
    </Pill>
  );
}

import type { ReactNode } from "react";
import { useBubbleT } from "../locales";

/** The honest "I don't know". Aram rule 1: when no source supports an
    answer, the agent says so instead of guessing — and says what would
    help. */
export function IDontKnow({ reason, next }: { reason: ReactNode; next?: ReactNode }) {
  const t = useBubbleT("bubble.guardrails");
  return (
    <div role="note" className="rounded-xl border border-gold/40 bg-gold/5 p-3 text-sm">
      <p className="font-semibold text-ivory">
        {t("idontknow")}
      </p>
      <p className="mt-1 text-ivory-dim">{reason}</p>
      {next && <p className="mt-2 text-xs text-ivory-dim">{next}</p>}
    </div>
  );
}

type DisclaimerKind = "legal" | "sample" | "children";

/** The three notices as catalogue keys — the words live in `bubble.guardrails.*`
    so every locale says them the same way, while the tone stays here. */
const NOTICES: Record<DisclaimerKind, { title: string; body: string; tone: string }> = {
  legal: {
    title: "legalTitle",
    body: "legalBody",
    tone: "border-marutham/50 bg-marutham/5",
  },
  sample: {
    title: "sampleTitle",
    body: "sampleBody",
    tone: "border-ivory/20 bg-ivory/5",
  },
  children: {
    title: "childrenTitle",
    body: "childrenBody",
    tone: "border-neytal/50 bg-neytal/5",
  },
};

/** Standard notices, worded once so every app says them the same way. */
export function Disclaimer({ kind, children }: { kind: DisclaimerKind; children?: ReactNode }) {
  const t = useBubbleT("bubble.guardrails");
  const c = NOTICES[kind];
  return (
    <aside role="note" className={`rounded-xl border p-3 text-xs ${c.tone}`}>
      <p className="font-semibold text-ivory">{t(c.title)}</p>
      <p className="mt-1 leading-relaxed text-ivory-dim">{t(c.body)}</p>
      {children && <div className="mt-2 text-ivory-dim">{children}</div>}
    </aside>
  );
}

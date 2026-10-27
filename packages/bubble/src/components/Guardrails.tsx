import type { ReactNode } from "react";

/** The honest "I don't know". Aram rule 1: when no source supports an
    answer, the agent says so instead of guessing — and says what would
    help. */
export function IDontKnow({ reason, next }: { reason: ReactNode; next?: ReactNode }) {
  return (
    <div role="note" className="rounded-xl border border-gold/40 bg-gold/5 p-3 text-sm">
      <p className="font-semibold text-ivory">
        <span lang="ta">தெரியவில்லை</span> · I don&apos;t know
      </p>
      <p className="mt-1 text-ivory-dim">{reason}</p>
      {next && <p className="mt-2 text-xs text-ivory-dim">{next}</p>}
    </div>
  );
}

type DisclaimerKind = "legal" | "sample" | "children";

const COPY: Record<DisclaimerKind, { title: string; body: ReactNode; tone: string }> = {
  legal: {
    title: "Legal information, not legal advice",
    body: (
      <>
        This explains what the law says; it cannot advise you on your situation. For advice, contact your District Legal
        Services Authority (DLSA) — legal aid is free for many people — or a lawyer.
      </>
    ),
    tone: "border-marutham/50 bg-marutham/5",
  },
  sample: {
    title: "Sample data",
    body: "Everything on this screen is illustrative. It shows the layout, not real answers, citations, prices or people.",
    tone: "border-ivory/20 bg-ivory/5",
  },
  children: {
    title: "For parents and guardians",
    body: "Children use Yazh only after a parent gives verified consent. We keep a first name and an age band — nothing else.",
    tone: "border-neytal/50 bg-neytal/5",
  },
};

/** Standard notices, worded once so every app says them the same way. */
export function Disclaimer({ kind, children }: { kind: DisclaimerKind; children?: ReactNode }) {
  const c = COPY[kind];
  return (
    <aside role="note" className={`rounded-xl border p-3 text-xs ${c.tone}`}>
      <p className="font-semibold text-ivory">{c.title}</p>
      <p className="mt-1 leading-relaxed text-ivory-dim">{c.body}</p>
      {children && <div className="mt-2 text-ivory-dim">{children}</div>}
    </aside>
  );
}

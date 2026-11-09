"use client";
import { useState, type ReactNode } from "react";
import { Disclaimer } from "../components/Guardrails";
import { Panel } from "../components/Panel";
import { Pill } from "../components/Pill";
import { useBubbleT } from "../locales";

export interface PostureResult {
  posture: "context" | "reason" | "plan" | "respond" | "reflect";
  pass: boolean;
  note: string;
}

/** Posture → catalogue key. The posture ids are fixed API vocabulary; only
    their display names are translated (`bubble.trust.posture.*`). */
const NAMES: Record<PostureResult["posture"], string> = {
  context: "posture.context",
  reason: "posture.reason",
  plan: "posture.plan",
  respond: "posture.respond",
  reflect: "posture.reflect",
};

/** The Five-Posture Reasoning Kernel for one turn, as the Reflection agent
    graded it. Failures are what become training pairs. */
export function FivePostureTrace({ results }: { results: PostureResult[] }) {
  const t = useBubbleT("bubble.trust");
  const fails = results.filter((r) => !r.pass).length;
  return (
    <Panel
      title={t("traceTitle")}
      eyebrow={t("traceEyebrow")}
      actions={<Pill tone={fails ? "risk" : "ok"}>{fails ? t("failed", { count: fails }) : t("allPassed")}</Pill>}
    >
      <ol className="space-y-2">
        {results.map((r) => (
          <li key={r.posture} className="flex gap-3 text-sm">
            <span className={`mt-0.5 font-mono text-xs ${r.pass ? "text-mullai" : "text-palai"}`}>{r.pass ? "✓" : "✕"}</span>
            <div>
              <p className="text-ivory">
                {t(NAMES[r.posture])}
              </p>
              <p className="text-xs text-ivory-dim">{r.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** Yazh's admission gate, shown to the *parent*. Nothing behind it renders
    until consent is verified (a server-side check — this component only
    reflects it). Aram rule 4: children first. */
export function ConsentGate({ verified, children, onStart }: { verified: boolean; children: ReactNode; onStart?: () => void }) {
  const t = useBubbleT("bubble.trust");
  const [asked, setAsked] = useState(false);
  if (verified) return <>{children}</>;
  return (
    <Panel title={t("consentTitle")} eyebrow={t("consentEyebrow")}>
      <div className="space-y-3 text-sm">
        <Disclaimer kind="children" />
        <ul className="list-disc space-y-1 pl-5 text-ivory-dim">
          <li>{t("consentBullet1")}</li>
          <li>{t("consentBullet2")}</li>
          <li>{t("consentBullet3")}</li>
        </ul>
        {asked ? (
          <p className="rounded-lg border border-neytal/40 bg-neytal/5 p-2 text-xs text-ivory">
            {t("consentSent")}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setAsked(true);
              onStart?.();
            }}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-night hover:bg-bronze"
          >
            {t("consentCta")}
          </button>
        )}
      </div>
    </Panel>
  );
}

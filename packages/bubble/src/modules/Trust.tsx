"use client";
import { useState, type ReactNode } from "react";
import { Disclaimer } from "../components/Guardrails";
import { Panel } from "../components/Panel";
import { Pill } from "../components/Pill";

export interface PostureResult {
  posture: "context" | "reason" | "plan" | "respond" | "reflect";
  pass: boolean;
  note: string;
}

const NAMES: Record<PostureResult["posture"], string> = {
  context: "Context",
  reason: "Reason",
  plan: "Plan",
  respond: "Respond",
  reflect: "Reflect",
};

/** The Five-Posture Reasoning Kernel for one turn, as the Reflection agent
    graded it. Failures are what become training pairs. */
export function FivePostureTrace({ results }: { results: PostureResult[] }) {
  const fails = results.filter((r) => !r.pass).length;
  return (
    <Panel title="Reasoning trace" eyebrow="Five-Posture kernel" actions={<Pill tone={fails ? "risk" : "ok"}>{fails ? `${fails} failed` : "all passed"}</Pill>}>
      <ol className="space-y-2">
        {results.map((r) => (
          <li key={r.posture} className="flex gap-3 text-sm">
            <span className={`mt-0.5 font-mono text-xs ${r.pass ? "text-mullai" : "text-palai"}`}>{r.pass ? "✓" : "✕"}</span>
            <div>
              <p className="text-ivory">
                {NAMES[r.posture]}
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
  const [asked, setAsked] = useState(false);
  if (verified) return <>{children}</>;
  return (
    <Panel title="A parent's consent comes first" eyebrow="Yazh">
      <div className="space-y-3 text-sm">
        <Disclaimer kind="children" />
        <ul className="list-disc space-y-1 pl-5 text-ivory-dim">
          <li>We keep your child&apos;s first name and age band. Nothing else.</li>
          <li>A person reviews flagged conversations every day.</li>
          <li>You can see, pause or delete everything at any time.</li>
        </ul>
        {asked ? (
          <p className="rounded-lg border border-neytal/40 bg-neytal/5 p-2 text-xs text-ivory">
            We&apos;ve sent a verification step to the parent&apos;s phone. Yazh stays closed until it is completed.
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
            I&apos;m the parent — verify me
          </button>
        )}
      </div>
    </Panel>
  );
}

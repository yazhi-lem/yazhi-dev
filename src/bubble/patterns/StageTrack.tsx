import { Fragment } from "react";
import { toneStyle, type Tone } from "../tone";

export type StageState = "done" | "active" | "attention" | "pending" | "skipped";

export interface StageSpec {
  id: string;
  label: string;
  state: StageState;
  /** short note under the label, e.g. "12 failures" */
  note?: string;
}

const STATE_TONE: Record<StageState, Tone> = {
  done: "ok",
  active: "info",
  attention: "error",
  pending: "neutral",
  skipped: "neutral",
};

const STATE_LABEL: Record<StageState, string> = {
  done: "done",
  active: "running",
  attention: "needs attention",
  pending: "not started",
  skipped: "skipped",
};

/** A pipeline as a chain of stage bubbles — collect → audit → raw → enrich
    for YazhiFactory, or a domain's own stage CLI (fetch → parse → …).
    Wraps on narrow screens; every state has a text label, never colour
    alone. */
export function StageTrack({ stages, label }: { stages: StageSpec[]; label?: string }) {
  return (
    <ol aria-label={label ?? "Pipeline stages"} className="flex flex-wrap items-center gap-y-3">
      {stages.map((s, i) => {
        const tone = STATE_TONE[s.state];
        return (
          <Fragment key={s.id}>
            {i > 0 && <li aria-hidden className="ybi-stage-link mx-2" style={toneStyle(tone)} />}
            <li className="flex items-center gap-2" style={toneStyle(tone)}>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-mono ${
                  s.state === "pending" || s.state === "skipped"
                    ? "border-ivory/15 text-ivory-dim"
                    : "border-[color:var(--tone)]/60 bg-[color:var(--tone)]/15 text-ivory"
                }`}
                aria-hidden
              >
                {s.state === "done" ? "✓" : s.state === "attention" ? "!" : i + 1}
              </span>
              <span className="leading-tight">
                <span className="block text-sm text-ivory">{s.label}</span>
                <span className="block text-xs text-ivory-dim">
                  <span className="sr-only">{STATE_LABEL[s.state]}. </span>
                  {s.note ?? STATE_LABEL[s.state]}
                </span>
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

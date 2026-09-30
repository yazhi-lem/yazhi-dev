import type { Tone } from "../tone";
import { Bubble } from "../core/Bubble";
import { Meter } from "../core/Meter";
import { Pill } from "../core/Pill";
import { T, plain, type BiText } from "../core/Text";
import type { PillSpec } from "./PageHeader";

export interface BubbleCardProps {
  title: BiText;
  subtitle?: BiText;
  body?: BiText;
  tone?: Tone;
  href?: string;
  meter?: { value: number | null; label: string; caption?: string };
  pills?: PillSpec[];
  meta?: { label: string; value: string }[];
}

/** The standard entity card — a Foundry project, a pipeline, an agent.
    Title + meter across the top, pills, then a row of small facts. */
export function BubbleCard({ title, subtitle, body, tone = "neutral", href, meter, pills, meta }: BubbleCardProps) {
  return (
    <Bubble tone={tone} href={href} label={href ? plain(title) : undefined} className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl text-ivory [overflow-wrap:anywhere] sm:text-2xl">
            <T text={title} />
          </h3>
          {subtitle && (
            <p className="mt-0.5 font-mono text-xs text-[color:var(--tone)]">
              <T text={subtitle} />
            </p>
          )}
        </div>
        {meter && <Meter value={meter.value} label={meter.label} caption={meter.caption} size={56} />}
      </div>
      {body && (
        <p className="text-sm text-ivory-dim">
          <T text={body} />
        </p>
      )}
      {pills && pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <Pill key={p.label} {...p} />
          ))}
        </div>
      )}
      {meta && meta.length > 0 && (
        <dl className="mt-auto grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-3 border-t border-ivory/10 pt-3">
          {meta.map((m) => (
            <div key={m.label} className="min-w-0">
              <dt className="truncate text-[11px] uppercase tracking-[0.12em] text-ivory-dim">{m.label}</dt>
              <dd className="break-words font-mono text-sm text-ivory">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Bubble>
  );
}

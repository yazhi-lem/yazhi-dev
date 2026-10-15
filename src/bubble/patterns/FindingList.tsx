import { Pill } from "../core/Pill";
import type { Tone } from "../tone";

export interface FindingSpec {
  code: string;
  severity: "error" | "warning" | "info";
  title: string;
  detail?: string;
  count: number;
}

const SEVERITY_TONE: Record<FindingSpec["severity"], Tone> = {
  error: "error",
  warning: "warn",
  info: "info",
};

/** Quality findings, worst first. Mirrors yazhi.insight.v1.Finding. */
export function FindingList({ items, empty = "No findings." }: { items: FindingSpec[]; empty?: string }) {
  if (items.length === 0) return <p className="text-sm text-ivory-dim">{empty}</p>;
  const order = { error: 0, warning: 1, info: 2 } as const;
  const sorted = [...items].sort((a, b) => order[a.severity] - order[b.severity] || b.count - a.count);
  return (
    <ul className="divide-y divide-ivory/10">
      {sorted.map((f) => (
        <li key={f.code} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="sm:w-28 sm:shrink-0">
            <Pill label={f.severity} tone={SEVERITY_TONE[f.severity]} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ivory">
              {f.title} <span className="font-mono text-xs text-ivory-dim">{f.code}</span>
            </p>
            {f.detail && <p className="mt-1 text-sm text-ivory-dim">{f.detail}</p>}
          </div>
          <div className="font-mono text-sm text-ivory sm:text-right">
            {f.count.toLocaleString("en-IN")}
            <span className="ml-1 text-xs text-ivory-dim">records</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

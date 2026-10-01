import { toneStyle, type Tone } from "../tone";

/** Linear progress. `value / max` sets the fill; the label is required
    because a bar alone says nothing to a screen reader. */
export function Progress({
  value,
  max = 100,
  label,
  tone = "info",
  showValue = true,
}: {
  value: number;
  max?: number;
  label: string;
  tone?: Tone;
  showValue?: boolean;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div style={toneStyle(tone)} className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ivory">{label}</span>
        {showValue && <span className="font-mono text-xs text-ivory-dim">{Number(pct.toFixed(1))}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="ybi-track h-2.5 overflow-hidden rounded-full"
      >
        <div className="ybi-fill h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

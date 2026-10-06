import { scoreTone, toneStyle, type Tone } from "../tone";

/** Circular 0-100 meter. With no explicit tone, the score picks one
    (ok / warn / error). `value = null` renders an empty ring with the
    caption in the centre — for "no data yet" rather than a fake zero. */
export function Meter({
  value,
  size = 64,
  tone,
  caption,
  label,
}: {
  value: number | null;
  size?: number;
  tone?: Tone;
  /** text in the ring when value is null (e.g. "—") */
  caption?: string;
  /** accessible description, e.g. "Quality score" */
  label: string;
}) {
  const stroke = Math.max(4, Math.round(size / 12));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  const t = tone ?? (value === null ? "neutral" : scoreTone(v));
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value ?? undefined}
      aria-valuetext={value === null ? caption ?? "No data" : `${v} of 100`}
      className="relative inline-grid shrink-0 place-items-center"
      style={toneStyle(t, { width: size, height: size })}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          style={{ stroke: "color-mix(in srgb, var(--ivory) 12%, transparent)" }}
        />
        {value !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            style={{ stroke: "color-mix(in srgb, var(--tone) var(--ybi-tone-mix), var(--ivory))" }}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(v / 100) * c} ${c}`}
          />
        )}
      </svg>
      <span className="absolute font-mono text-sm text-ivory" aria-hidden>
        {value === null ? caption ?? "—" : v}
      </span>
    </div>
  );
}

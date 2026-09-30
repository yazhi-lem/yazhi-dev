import { toneStyle, type Tone } from "../tone";

/** Small status chip: tinted dot + label. `pulse` marks live states. */
export function Pill({
  label,
  tone = "neutral",
  pulse = false,
  mono = false,
}: {
  label: string;
  tone?: Tone;
  pulse?: boolean;
  mono?: boolean;
}) {
  return (
    <span
      style={toneStyle(tone)}
      className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--tone)]/30 bg-[color:var(--tone)]/10 px-2.5 py-0.5 text-xs text-ivory ${
        mono ? "font-mono" : ""
      }`}
    >
      <span className="ybi-dot" data-pulse={pulse ? "" : undefined} aria-hidden />
      {label}
    </span>
  );
}

import type { Tone } from "../tone";
import { Bubble } from "./Bubble";
import { T, type BiText } from "./Text";

/** One number worth looking at: label, value, optional hint. */
export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: BiText;
  value: string;
  hint?: BiText;
  tone?: Tone;
}) {
  return (
    <Bubble tone={tone} size="md">
      <div className="text-xs uppercase tracking-[0.14em] text-ivory-dim">
        <T text={label} />
      </div>
      <div className="mt-2 font-display text-3xl text-ivory">{value}</div>
      {hint && (
        <div className="mt-1 text-sm text-ivory-dim">
          <T text={hint} />
        </div>
      )}
    </Bubble>
  );
}

import { T } from "@/bubble";
import { toneStyle, type Tone } from "@/bubble/tone";
import type { BiString } from "@/lib/chat/types";

/** An agent's avatar: the Yazhi bubble mark (three circles, radius ratio
    1.00 : 0.74 : 0.56, equal gaps, never touching) inside a soft orb,
    filled in the agent's tinai tone. Decorative — the agent's name is
    always written beside it. */
export function AgentMark({ tone, size = 36 }: { tone: Tone; size?: number }) {
  return (
    <span
      aria-hidden
      style={toneStyle(tone, { width: size, height: size })}
      className="inline-grid shrink-0 place-items-center rounded-full border border-[color:var(--tone)]/30 bg-[color:var(--tone)]/15"
    >
      <svg viewBox="0 0 100 100" width={size * 0.66} height={size * 0.66}>
        <g style={{ fill: "color-mix(in srgb, var(--tone) var(--ybi-tone-mix), var(--ivory))" }}>
          <circle cx="30.8" cy="30.6" r="12.3" />
          <circle cx="65.2" cy="26.9" r="16.3" />
          <circle cx="47.2" cy="67.4" r="22" />
        </g>
      </svg>
    </span>
  );
}

/** An agent's release state as a quiet line with a dot — it wraps
    cleanly where a pill would break mid-phrase. */
export function StatusLine({ text }: { text: BiString }) {
  return (
    <p className="mt-0.5 flex items-start gap-1.5 text-xs text-ivory-dim" style={toneStyle("info")}>
      <span className="ybi-dot mt-1.5 shrink-0" aria-hidden />
      <span>
        <T text={text} />
      </span>
    </p>
  );
}

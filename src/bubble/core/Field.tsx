import type { InputHTMLAttributes } from "react";
import { toneStyle, type Tone } from "../tone";
import { T, type BiText } from "./Text";

/** Labelled text input. Uncontrolled and server-renderable; the label is
    always visible (placeholders are not labels) and the hint is wired up
    with aria-describedby. `id` defaults to `ybi-<name>`. */
export function Field({
  label,
  name,
  hint,
  tone = "kurinji",
  id,
  className = "",
  ...rest
}: {
  label: BiText;
  name: string;
  hint?: BiText;
  tone?: Tone;
  id?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "name" | "id">) {
  const inputId = id ?? `ybi-${name}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div style={toneStyle(tone)} className={`space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="block text-sm text-ivory">
        <T text={label} />
      </label>
      <input
        id={inputId}
        name={name}
        aria-describedby={hintId}
        className="ybi-field w-full rounded-2xl px-4 py-2.5 text-base"
        {...rest}
      />
      {hint && (
        <p id={hintId} className="text-xs text-ivory-dim">
          <T text={hint} />
        </p>
      )}
    </div>
  );
}

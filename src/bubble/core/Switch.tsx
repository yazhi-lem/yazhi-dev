"use client";
import { useState } from "react";
import { toneStyle, type Tone } from "../tone";

/** On/off switch (role="switch"). Uncontrolled by default; pass
    `onChange` to observe. The state is also spoken as text ("On"/"Off")
    so it never relies on knob position or colour alone. */
export function Switch({
  label,
  defaultChecked = false,
  tone = "ok",
  onChange,
}: {
  label: string;
  defaultChecked?: boolean;
  tone?: Tone;
  onChange?: (checked: boolean) => void;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      style={toneStyle(tone)}
      className="group inline-flex items-center gap-3 rounded-full text-sm text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--tone)]"
    >
      <span
        aria-hidden
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "ybi-fill" : "ybi-track"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-[color:var(--night-2)] shadow transition-[left] duration-200 ${
            on ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
      <span>{label}</span>
      <span className="font-mono text-xs text-ivory-dim">{on ? "On" : "Off"}</span>
    </button>
  );
}

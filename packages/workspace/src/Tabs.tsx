"use client";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

/** Tabs with the ARIA tabs pattern: one tab stop, arrow keys move between
    tabs, Home and End jump, the panel is labelled by its tab. Drawn as the
    mockups' underlined tabs. */
export function Tabs<V extends string>({
  label,
  tabs,
  value,
  onChange,
  children,
}: {
  label: string;
  tabs: { value: V; label: ReactNode }[];
  value: V;
  onChange: (v: V) => void;
  /** the selected tab's panel */
  children: ReactNode;
}) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.value === value);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const j = (next + tabs.length) % tabs.length;
    onChange(tabs[j].value);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[j]?.focus();
  };
  return (
    <div>
      <div ref={list} role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-4 overflow-x-auto border-b border-ivory/10">
        {tabs.map((t) => {
          const on = t.value === value;
          return (
            <button
              key={t.value}
              id={`${id}-tab-${t.value}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(t.value)}
              className={`-mb-px min-h-11 shrink-0 whitespace-nowrap border-b-2 px-1 text-sm transition ${
                on ? "border-[color:var(--accent)] font-semibold text-ivory" : "border-transparent text-ivory-dim hover:text-ivory"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${value}`} tabIndex={0} className="pt-4 focus:outline-none">
        {children}
      </div>
    </div>
  );
}

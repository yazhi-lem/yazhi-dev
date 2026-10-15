"use client";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { toneStyle, type Tone } from "../tone";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

/** WAI-ARIA tabs: roving tabindex, ←/→/Home/End move focus and select.
    Panels are Server-rendered children passed in as `content`. */
export function Tabs({ items, tone = "kurinji", label }: { items: TabItem[]; tone?: Tone; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function onKey(e: KeyboardEvent) {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div style={toneStyle(tone)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="ybi-track inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1"
      >
        {items.map((it, i) => (
          <button
            key={it.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${base}-tab-${it.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${it.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--tone)] ${
              i === active ? "ybi-solid font-semibold" : "text-ivory-dim hover:text-ivory"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <div
          key={it.id}
          role="tabpanel"
          id={`${base}-panel-${it.id}`}
          aria-labelledby={`${base}-tab-${it.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--tone)]"
        >
          {it.content}
        </div>
      ))}
    </div>
  );
}

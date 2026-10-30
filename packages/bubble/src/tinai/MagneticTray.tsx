"use client";
import { useEffect, useRef, useState } from "react";
import type { ThinaiKey } from "./keys";
import { firstGrapheme } from "../text";
import { ENV_BY_KEY } from "./environments";

export interface MagneticItem {
  id: string;
  label: string;
  /** Tamil name, shown under the bubble when it is lifted */
  ta?: string;
  glyph?: string;
  /** a small identity dot on the bubble's rim */
  accent?: string;
}

/** A row of bubbles that swell toward the pointer, each on its own spring
    from the tinai it sits in: heavy in Palai, buoyant in Kurinji, exact in
    Marutham, loose in Neytal. Choosing one sends a ring out to its
    neighbours, staggered by distance (Hairline rule 02).

    Hit areas never move: each button keeps its slot and only its drawn
    bubble scales (Hairline rule 01). Keyboard focus lifts a bubble the way
    the pointer does. Under reduced motion the scale is applied instantly.
    `vertical` stacks the tray in a column that swells sideways, for a rail. */
export function MagneticTray({
  items,
  tinai,
  activeId,
  onSelect,
  size = 44,
  reach = 2.2,
  vertical = false,
  label = "Bubbles",
}: {
  items: MagneticItem[];
  tinai: ThinaiKey;
  activeId?: string;
  onSelect?: (id: string) => void;
  /** resting diameter, px */
  size?: number;
  /** how far the swell reaches, in bubbles */
  reach?: number;
  vertical?: boolean;
  /** accessible name of the tray */
  label?: string;
}) {
  const rowRef = useRef<HTMLUListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [pulse, setPulse] = useState<{ from: number; n: number } | null>(null);
  const slot = size + 12;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const { k, c } = ENV_BY_KEY[tinai].spring;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sp = items.map(() => ({ x: 1, v: 0, t: 1 }));
    let raf = 0, last = 0;

    const aim = (px: number | null) => {
      sp.forEach((s, i) => {
        if (px === null) { s.t = 1; return; }
        const d = Math.abs(px - (i * slot + slot / 2)) / slot / reach;
        s.t = 1 + 0.55 * Math.max(0, 1 - d * d);
      });
      if (reduced) { sp.forEach((s) => (s.x = s.t)); apply(); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    const apply = () =>
      sp.forEach((s, i) => {
        const el = dotRefs.current[i];
        if (!el) return;
        const lift = ((s.x - 1) * size * 0.35).toFixed(2);
        el.style.transform = `${vertical ? `translateX(${lift}px)` : `translateY(-${lift}px)`} scale(${s.x.toFixed(4)})`;
      });
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;
      for (const s of sp) {
        const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
        for (let j = 0; j < n; j++) {
          s.v += (-k * (s.x - s.t) - c * s.v) * h;
          s.x += s.v * h;
        }
        if (Math.abs(s.x - s.t) > 0.0005 || Math.abs(s.v) > 0.0005) moving = true;
        else { s.x = s.t; s.v = 0; }
      }
      apply();
      raf = moving ? requestAnimationFrame(tick) : 0;
    }

    const local = (e: PointerEvent) => {
      const r = row.getBoundingClientRect();
      return vertical ? e.clientY - r.top : e.clientX - r.left;
    };
    const onMove = (e: PointerEvent) => aim(local(e));
    const onLeave = () => aim(null);
    const onFocus = (e: FocusEvent) => {
      const i = Number((e.target as HTMLElement).dataset.i);
      if (Number.isFinite(i)) aim(i * slot + slot / 2);
    };
    const onBlur = () => aim(null);
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", onLeave);
    row.addEventListener("focusin", onFocus);
    row.addEventListener("focusout", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
      row.removeEventListener("focusin", onFocus);
      row.removeEventListener("focusout", onBlur);
    };
  }, [items, tinai, slot, size, reach, vertical]);

  return (
    <ul
      ref={rowRef}
      aria-label={label}
      className={
        vertical
          ? "flex flex-col items-start py-2 pl-2"
          : "flex items-end overflow-x-auto overflow-y-visible px-2 pb-7 pt-10 [scrollbar-width:none]"
      }
      data-lenis-prevent
    >
      {items.map((b, i) => {
        const active = b.id === activeId;
        const delay = pulse ? Math.abs(i - pulse.from) * 45 : 0;
        return (
          <li key={b.id} className="relative shrink-0" style={vertical ? { width: size, height: slot } : { width: slot, height: size }}>
            <button
              type="button"
              data-i={i}
              aria-pressed={active}
              aria-label={b.label}
              onClick={() => {
                setPulse((p) => ({ from: i, n: (p?.n ?? 0) + 1 }));
                onSelect?.(b.id);
              }}
              className="group absolute inset-0 grid place-items-center rounded-full outline-none"
            >
              <span
                ref={(el) => { dotRefs.current[i] = el; }}
                className="relative grid place-items-center rounded-full will-change-transform"
                style={{
                  width: size,
                  height: size,
                  transformOrigin: vertical ? "0% 50%" : "50% 100%",
                  background: "var(--env-surface)",
                  border: `1px solid ${active ? "var(--env-hi)" : "color-mix(in oklab, var(--env-edge) 70%, transparent)"}`,
                }}
              >
                <span aria-hidden className="font-semibold" style={{ fontSize: size * 0.36, color: active ? "var(--env-hi)" : "var(--env-text-dim)" }}>
                  {b.glyph ?? firstGrapheme(b.ta ?? b.label)}
                </span>
                {/* the ring a choice sends out, reaching neighbours by distance */}
                {pulse && (
                  <span
                    key={pulse.n}
                    aria-hidden
                    className="tray-ring pointer-events-none absolute inset-[-5px] rounded-full"
                    style={{ animationDelay: `${delay}ms`, borderColor: i === pulse.from ? "var(--env-hi)" : "var(--env-edge)" }}
                  />
                )}
                <span className="absolute inset-[-4px] rounded-full ring-0 ring-[color:var(--env-hi)] group-focus-visible:ring-1" />
                {b.accent && (
                  <span aria-hidden className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[color:var(--env-ground)]" style={{ background: b.accent }} />
                )}
              </span>
              <span
                aria-hidden
                className={`pointer-events-none absolute z-10 whitespace-nowrap text-[10px] text-[color:var(--env-text-dim)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                  vertical
                    ? "left-full top-1/2 ml-5 -translate-y-1/2 rounded-full border bg-[color:var(--env-surface)] px-2 py-0.5 opacity-0 hair-lo"
                    : `-bottom-6 left-1/2 -translate-x-1/2 ${active ? "opacity-100" : "opacity-0"}`
                }`}
              >
                {b.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

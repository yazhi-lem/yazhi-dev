"use client";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

/** Small pieces the library page is set in: section, eyebrow, code,
    tables and an accessible tab list. All drawn in the --env-* ink, so
    they take whatever landscape and mode they sit in. */

export const HAIRLINE = "https://github.com/lucasmarkes/hairline";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--env-accent)]">{children}</p>;
}

export function Section({ id, eyebrow, title, intro, children, wide = false }: { id: string; eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <section id={id} data-toc={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t py-16 hair-lo first:border-t-0 sm:py-20 lg:scroll-mt-20">
      <div data-reveal className={wide ? "" : "max-w-3xl"}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-black sm:text-4xl">
          <a href={`#${id}`} className="hover:text-[color:var(--env-accent)]">
            {title}
          </a>
        </h2>
        {intro && <div className="mt-4 max-w-[68ch] text-[1.05rem] leading-relaxed text-[color:var(--env-text-dim)]">{intro}</div>}
      </div>
      <div data-reveal className="mt-10">
        {children}
      </div>
    </section>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-[color:color-mix(in_oklab,var(--env-text)_9%,transparent)] px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>;
}

export function Pre({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="mt-5 overflow-hidden rounded-xl border bg-[color:var(--env-surface)] hair-lo">
      {label && <figcaption className="border-b px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)] hair-lo">{label}</figcaption>}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed" data-lenis-prevent tabIndex={0}>
        {children}
      </pre>
    </figure>
  );
}

export function Table({ head, rows, min = "36rem" }: { head: string[]; rows: ReactNode[][]; min?: string }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border hair-lo" data-lenis-prevent tabIndex={0} role="region" aria-label={head.filter(Boolean).join(", ")}>
      <table className="w-full text-left text-sm" style={{ minWidth: min }}>
        <thead className="bg-[color:var(--env-surface)]">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[color:var(--env-text-dim)]">
          {rows.map((r, i) => (
            <tr key={i} className="border-t align-top hair-lo">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface TabItem {
  id: string;
  label: ReactNode;
  /** a colour dot before the label */
  swatch?: string;
}

/** A WAI-ARIA tab list: arrows, Home and End move between tabs, and the
    choice follows focus. Render the panel with TabPanel and the same `base`. */
export function Tabs({ items, value, onChange, label, base }: { items: TabItem[]; value: string; onChange: (id: string) => void; label: string; base: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = items.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onChange(items[to].id);
    refs.current[to]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" data-lenis-prevent>
      {items.map((t, i) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={on}
            aria-controls={`${base}-panel`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 ${
              on ? "bg-[color:var(--env-surface)] [border-color:var(--env-hi)]" : "text-[color:var(--env-text-dim)] hair-lo hover:text-[color:var(--env-text)]"
            }`}
          >
            {t.swatch && <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.swatch }} />}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ base, value, children, className = "" }: { base: string; value: string; children: ReactNode; className?: string }) {
  return (
    <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${value}`} className={className}>
      {children}
    </div>
  );
}

/** A stable id for a Tabs/TabPanel pair. */
export const useTabsId = () => useId().replace(/:/g, "");

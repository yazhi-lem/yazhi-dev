"use client";
/** <BubbleLauncher> — the tray of app bubbles.

    Every bubble the host knows, grouped as **agent bubbles** (the five
    starter manifests, plus whatever the registry published), **app page
    templates** (Avai first) and **workspaces** (Guru, Nyaya, Kural, Kadai).
    A language filter narrows the list; nothing else does.

    The primitive is `Bubble` from `@yazhi/bubble` — the host only composes:
    the tray is a `radiogroup` of bubble radios with **one** tab stop
    (roving tabindex); arrow keys move inside it (`BubbleAppHost`'s handler),
    Enter or Space opens, and `[` / `]` cycle from anywhere on the page.
    A compact "rail" view swaps the sizes for a narrower column; the choice is
    remembered per browser but is applied after mount, so the server's markup
    and the first client render always agree.
*/

import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { Bubble } from "@yazhi/bubble";
import { firstGrapheme } from "@yazhi/bubble/text";
import { LANGUAGE_FILTERS, TRAY_DIAMETER, matchesLanguage, type AppBubble, type LanguageFilter } from "./bubbles";
import type { AppKey } from "./copy";
import { useAppText } from "./useAppText";

const VIEW_KEY = "yazhi-app-tray-view";

/** The rail's single diameter: every bubble the same size, so a narrow column
    stays tidy whether a manifest asked for `s` or `l`. */
const RAIL_DIAMETER = 40;

/** The language filters' labels, by filter. */
const FILTER_KEYS: Record<LanguageFilter, AppKey> = {
  all: "app.filterAll",
  ta: "app.filterTamil",
  en: "app.filterEnglish",
  te: "app.filterTelugu",
};

function glyphOf(bubble: AppBubble): string {
  return firstGrapheme(bubble.taName ?? bubble.name);
}

const GROUP_ORDER: { kind: AppBubble["kind"]; key: AppKey }[] = [
  { kind: "agent", key: "app.groupAgents" },
  { kind: "template", key: "app.groupApp" },
  { kind: "workspace", key: "app.groupWorkspaces" },
];

export function BubbleLauncher({
  trayRef,
  bubbles,
  activeSlug,
  filter,
  onFilter,
  onOpen,
  onKeyDown,
  onHelp,
}: {
  trayRef: RefObject<HTMLElement | null>;
  bubbles: AppBubble[];
  activeSlug: string;
  filter: LanguageFilter;
  onFilter: (filter: LanguageFilter) => void;
  onOpen: (slug: string) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
  onHelp: () => void;
}) {
  const t = useAppText();
  const [view, setView] = useState<"packed" | "rail">("packed");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_KEY);
      if (saved === "rail" || saved === "packed") setView(saved);
    } catch {
      // private mode: the packed tray is fine
    }
  }, []);

  const shown = useMemo(() => bubbles.filter((b) => matchesLanguage(b, filter)), [bubbles, filter]);
  const groups = useMemo(
    () => GROUP_ORDER.map((g) => ({ ...g, items: shown.filter((b) => b.kind === g.kind) })).filter((g) => g.items.length),
    [shown]
  );

  // the roving tab stop: the selected bubble when it is in this tray, else
  // the first one — never zero tab stops and never all of them
  const tabstop = shown.some((b) => b.slug === activeSlug) ? activeSlug : shown[0]?.slug;

  const changeView = (next: "packed" | "rail") => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      // remember per tab, then
    }
  };

  return (
    <section
      ref={trayRef}
      aria-label={t("app.launcherTitle")}
      onKeyDown={onKeyDown}
      className="md:sticky md:top-3 md:w-[13.5rem] md:shrink-0"
    >
      <header className="mb-2 flex items-center justify-between gap-2 px-1">
        <h2 className="font-display text-base font-semibold">{t("app.launcherTitle")}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => changeView(view === "packed" ? "rail" : "packed")}
            aria-label={t("app.viewToggle")}
            title={t("app.viewToggle")}
            className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory-dim hover:border-ivory/40 hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              {view === "packed" ? (
                <>
                  <circle cx="8" cy="8" r="3" />
                  <circle cx="16" cy="8" r="3" />
                  <circle cx="8" cy="16" r="3" />
                  <circle cx="16" cy="16" r="3" />
                </>
              ) : (
                <path d="M4 7h11M4 12h16M4 17h8" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={onHelp}
            aria-label={t("app.keysShow")}
            title={t("app.keysHint")}
            className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 font-mono text-sm text-ivory-dim hover:border-ivory/40 hover:text-ivory"
          >
            ?
          </button>
        </div>
      </header>

      {/* language filter — a segmented control of real radio buttons */}
      <fieldset className="mb-3">
        <legend className="sr-only">{t("app.filterLabel")}</legend>
        <div className="flex flex-wrap gap-1 px-1">
          {LANGUAGE_FILTERS.map((f) => {
            const checked = filter === f;
            return (
              <label
                key={f}
                className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                  checked ? "border-gold/60 bg-gold/15 text-gold" : "border-ivory/15 text-ivory-dim hover:text-ivory"
                }`}
              >
                <input
                  type="radio"
                  name="app-lang-filter"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onFilter(f)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                    e.preventDefault();
                    const i = LANGUAGE_FILTERS.indexOf(f);
                    const next = LANGUAGE_FILTERS[(i + (e.key === "ArrowRight" ? 1 : -1) + LANGUAGE_FILTERS.length) % LANGUAGE_FILTERS.length];
                    onFilter(next);
                    const form = (e.target as HTMLElement).closest("fieldset");
                    form?.querySelectorAll<HTMLInputElement>("input")[LANGUAGE_FILTERS.indexOf(next)]?.focus();
                  }}
                />
                <span lang={f === "all" ? undefined : f}>{t(FILTER_KEYS[f])}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {!shown.length && (
        <p className="px-1 text-xs text-ivory-dim">
          {t("app.filterNoMatch")}{" "}
          <button type="button" className="underline decoration-gold/60 underline-offset-2 hover:text-ivory" onClick={() => onFilter("all")}>
            {t("app.filterNoMatch2")}
          </button>
          .
        </p>
      )}

{/* the tray: a radiogroup of bubble radios with ONE tab stop (roving
          tabindex — arrow keys move within it, see BubbleAppHost.onTrayKeyDown) */}
      <div role="radiogroup" aria-label={t("app.launcherTitle")} aria-describedby="app-tray-hint">
        {groups.map((group) => (
          <div key={group.kind} className="mb-3">
            <p className="px-1 pb-1 text-[11px] uppercase tracking-wider text-ivory-dim">{t(group.key)}</p>
            <ul className="flex flex-wrap items-center gap-2 border-l border-ivory/10 pl-2">
              {group.items.map((b) => (
                <li key={b.slug}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={b.slug === activeSlug}
                    aria-label={b.taName ? `${b.name} · ${b.taName}` : b.name}
                    title={b.summary}
                    data-slug={b.slug}
                    tabIndex={b.slug === tabstop ? 0 : -1}
                    onClick={() => onOpen(b.slug)}
                    className={`grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-night ${
                      view === "packed" ? "" : "transition-transform hover:scale-105"
                    }`}
                  >
                    {/* the bubble's own size wins in the packed tray; the rail
                        flattens every bubble to one diameter for a narrow column */}
                    <Bubble
                      accent={b.accent.startsWith("var(") ? `color-mix(in oklab, ${b.accent} 80%, white)` : b.accent}
                      label={b.name}
                      glyph={glyphOf(b)}
                      size={view === "packed" ? TRAY_DIAMETER[b.size] : RAIL_DIAMETER}
                      active={b.slug === activeSlug}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p id="app-tray-hint" className="px-1 text-[11px] leading-relaxed text-ivory-dim">
        {t("app.launcherHint")}
      </p>
    </section>
  );
}

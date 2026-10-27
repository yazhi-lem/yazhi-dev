"use client";
import { useEffect, useState } from "react";
import { TinaiMark } from "@yazhi/bubble";
import type { ThinaiKey } from "@/lib/content";
import { THINAI } from "@/lib/content";
import { useLang } from "@/lib/i18n";

/** Page sections in the order they appear on the page. THINAI (and the 3D
    world) list the landscapes in journey order, but the bubbles follow the
    page, so they are sorted by this scroll order. */
const SCROLL_ORDER = ["yazhi", "adhan", "guardian", "sangam", "community"];
const RAIL = [...THINAI].sort((a, b) => SCROLL_ORDER.indexOf(a.section) - SCROLL_ORDER.indexOf(b.section));

/** The five thinai as a tray of bubbles, each with its flat mark. The
    landscape on screen swells and takes its colour; the others rest as
    quiet rings. Desktop: down the left edge. Phones: along the bottom.
    Hit areas never move — only the drawing grows. */
export function ThinaiRail() {
  const { lang } = useLang();
  const [active, setActive] = useState<ThinaiKey>("kurinji");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = (e.target as HTMLElement).dataset.thinai as ThinaiKey | undefined;
            if (key) setActive(key);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    THINAI.forEach((t) => {
      const el = document.getElementById(t.section);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (section: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(section)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  return (
    <nav
      aria-label="ஐந்திணை / Five landscapes"
      className="fixed z-40 max-lg:bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:left-5 lg:top-1/2 lg:-translate-y-1/2"
    >
      <ul className="flex items-center gap-1 max-lg:rounded-full max-lg:border max-lg:border-ivory/10 max-lg:bg-night/70 max-lg:p-1 max-lg:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] max-lg:backdrop-blur-xl lg:flex-col">
        {RAIL.map((t) => {
          const on = active === t.key;
          const name = lang === "en" ? t.en : t.ta;
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => go(t.section)}
                aria-label={`${t.ta} · ${t.en} — ${t.landscape}`}
                aria-current={on ? "true" : undefined}
                className="group relative grid h-11 w-11 place-items-center rounded-full"
              >
                {/* the bubble: only this moves */}
                <span
                  aria-hidden
                  className={`grid place-items-center rounded-full border backdrop-blur-md transition-[width,height,background-color,border-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    on
                      ? "h-11 w-11 shadow-[0_8px_24px_-10px_var(--tone)]"
                      : "h-9 w-9 border-ivory/15 bg-night/60 text-ivory-dim group-hover:h-10 group-hover:w-10 group-hover:text-ivory group-focus-visible:h-10 group-focus-visible:w-10"
                  }`}
                  style={
                    {
                      "--tone": `var(--${t.key})`,
                      ...(on
                        ? {
                            borderColor: `color-mix(in oklab, var(--${t.key}) 70%, transparent)`,
                            background: `color-mix(in oklab, var(--${t.key}) 22%, rgba(10,10,10,0.7))`,
                            color: `color-mix(in oklab, var(--${t.key}) 45%, white)`,
                          }
                        : {}),
                    } as React.CSSProperties
                  }
                >
                  <TinaiMark tinai={t.key} size={on ? 22 : 17} />
                </span>
                <span
                  lang={lang === "en" ? "en" : "ta"}
                  className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full border border-ivory/10 bg-night/85 px-2.5 py-1 text-xs text-ivory opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
                >
                  {name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";
import { useEffect, useState } from "react";
import { THINAI } from "@/lib/content";
import { useLang, resolveIndic } from "@/lib/i18n";

/** The five thinai as literal site navigation. Desktop: fixed left rail.
    Mobile: bottom bar. Active landscape tracks scroll position. */
export function ThinaiRail() {
  const { mode, indic } = useLang();
  const [active, setActive] = useState("kurinji");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = (e.target as HTMLElement).dataset.thinai;
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
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="ஐந்திணை / Five landscapes"
      className="fixed z-40 max-lg:bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:left-6 lg:top-1/2 lg:-translate-y-1/2"
    >
      <ul className="flex gap-1.5 rounded-full border border-ivory/10 bg-night-2/80 p-1.5 backdrop-blur lg:flex-col lg:gap-2">
        {THINAI.map((t) => {
          const isActive = active === t.key;
          return (
            <li key={t.key}>
              <button
                onClick={() => go(t.section)}
                aria-label={mode === "en" ? `${t.en} — ${t.landscape.en}` : `${resolveIndic(t.name, indic).value} · ${t.en}`}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[color:var(--accent)]/20 ring-1 ring-[color:var(--accent)]/70 scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <span aria-hidden className="text-lg leading-none">{t.icon}</span>
                <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-night-2 px-2 py-1 text-xs text-ivory opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
                  {mode === "en" ? t.en : resolveIndic(t.name, indic).value}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

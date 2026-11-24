"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TinaiScope } from "@yazhi/bubble";
import { HairlineFigure } from "@yazhi/bubble/hairline/HairlineFigure";
import type { HairlineFigureDef } from "@yazhi/bubble/hairline/types";
import yazh from "@yazhi/bubble/hairline/figures/yazh.js";
import { useUiT } from "@/lib/i18n";

/** The Yazhi Awakening — the date the initiative wakes. The whole home
    screen is this countdown now; the timer reaches zero at the stroke of
    the new year. */
const AWAKENING = Date.UTC(2027, 0, 1, 0, 0, 0); // 2027-01-01

const pad = (n: number) => String(n).padStart(2, "0");

/** Full-screen countdown: a breathing pool of light, the yazh playing
    itself, and the four numbers. `now` starts null and is set only in an
    effect, so the server and first client render agree. */
export function AwakeningCountdown() {
  const t = useUiT();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now == null ? 0 : Math.max(0, AWAKENING - now);
  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const units = [
    { value: days, label: t("timer.days"), pad: false },
    { value: hours, label: t("timer.hours"), pad: true },
    { value: minutes, label: t("timer.minutes"), pad: true },
    { value: seconds, label: t("timer.seconds"), pad: true },
  ];

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center">
      {/* the breathing ground: a slow radial pulse and a ring out of phase */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="awakening-glow absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="awakening-ring absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(198,93,59,0.16),transparent_58%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem]">
          <TinaiScope
            tinai="kurinji"
            scheme="dark"
            ground={false}
            className="rounded-[2rem] border border-ivory/10 bg-night/40 p-4 backdrop-blur-md"
          >
            <HairlineFigure figure={yazh as HairlineFigureDef} play className="w-full" />
          </TinaiScope>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.35em] text-ivory-dim">
          {t("timer.until")}
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-none text-ivory sm:text-7xl lg:text-8xl">
          {t("timer.label")}
        </h1>
        <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-ivory-dim">
          {t("timer.date")}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="rounded-2xl border border-ivory/10 bg-ivory/[0.03] px-4 py-6 backdrop-blur-sm"
            >
              <div className="font-mono text-4xl tabular-nums text-ivory sm:text-5xl">
                {unit.pad ? pad(unit.value) : unit.value}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory-dim">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mx-auto mt-12 max-w-xl border-t border-ivory/10 pt-6">
          <p lang="ta" className="font-display text-lg text-ivory">
            {t("timer.quote", undefined, { language: "ta" })}
          </p>
          <p lang="en" className="mt-2 text-sm text-ivory-dim">
            {t("timer.quote", undefined, { language: "en" })}
          </p>
        </blockquote>

        <Link
          href="/about"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 bg-night/40 px-5 text-sm text-ivory backdrop-blur transition-colors hover:border-ivory/50"
        >
          {t("timer.manifestoLink")} →
        </Link>
      </div>
    </main>
  );
}

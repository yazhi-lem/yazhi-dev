"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

/** GTFI launch epoch — the site's own launch day. The timer counts up from
    here, so it reads 0 at launch and climbs every second thereafter. */
const LAUNCH = Date.UTC(2026, 6, 8, 0, 0, 0); // 2026-07-08 (month is 0-indexed)

const pad = (n: number) => String(n).padStart(2, "0");

/** Always-on elapsed-time counter since the GTFI launch. Fixed to the
    viewport so it stays on screen through the whole scroll. `now` starts
    null and is only set in an effect, so the server and first client render
    agree (0d 00:00:00) — no hydration mismatch — then it ticks live. */
export function LaunchTimer() {
  const { lang } = useLang();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = now == null ? 0 : Math.max(0, now - LAUNCH);
  const total = Math.floor(elapsed / 1000);
  const days = Math.floor(total / 86400);
  const hrs = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const label =
    lang === "en" ? "GTFI launch" : lang === "ta" ? "GTFI தொடக்கம்" : "GTFI தொடக்கம் · launch";

  return (
    <div
      role="timer"
      aria-label={`GTFI launch — ${days} days ${hrs} hours ${mins} minutes ${secs} seconds elapsed`}
      className="fixed right-3 top-16 z-40 flex items-center gap-2 rounded-full border border-ivory/15 bg-night-2/80 px-3 py-1.5 text-xs shadow-lg backdrop-blur lg:bottom-4 lg:right-4 lg:top-auto"
    >
      <span aria-hidden className="text-sm leading-none">🚀</span>
      <span className="hidden text-[color:var(--accent)] sm:inline">{label}</span>
      <span className="font-mono tabular-nums text-ivory">
        {days}
        <span className="text-ivory-dim">d</span> {pad(hrs)}:{pad(mins)}:{pad(secs)}
      </span>
    </div>
  );
}

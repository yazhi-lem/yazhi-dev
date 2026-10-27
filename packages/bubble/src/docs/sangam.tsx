"use client";
import { useState } from "react";
import type { ThinaiKey } from "../tinai/keys";
import { KARU_BY_KEY, KARU_CATEGORIES, KARU_SOURCES, KARUPPORUL, type Karu, type KaruCategory } from "../lib/karupporul";
import { ENV_BY_KEY, tone } from "../tinai/environments";
import { SANGAM_OBJECTS } from "../hairline/figures";
import { FigureWithDial } from "./parts";

const DRAFT_NOTE = "Draft — compiled from Tolkāppiyam and its standard teaching summaries; awaiting a Tamil scholar's review.";

/** A few of a landscape's karu, as a strip of chips under its chapter. */
export function KaruStrip({ tinai }: { tinai: ThinaiKey }) {
  const t = KARU_BY_KEY[tinai];
  const pick: KaruCategory[] = ["bird", "beast", "flower", "tree", "drum", "yazh"];
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">
          Karupporul — native things
        </h3>
        <a href="#sangam" className="text-[11px] text-[color:var(--env-text-dim)] underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-text)]">
          the full atlas
        </a>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border hair-lo sm:grid-cols-3" style={{ background: "color-mix(in oklab, var(--env-edge) 20%, transparent)" }}>
        {pick.map((c) => {
          const cat = KARU_CATEGORIES.find((k) => k.key === c)!;
          return (
            <div key={c} className="bg-[color:var(--env-ground)] px-3 py-2.5">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-accent)]">{cat.en}</dt>
              <dd className="mt-1 text-sm leading-snug">
                {t.karu[c].map((k) => k.en).join(", ")}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-2 text-[11px] text-[color:var(--env-text-dim)]">
        {t.time.en[0].toUpperCase() + t.time.en.slice(1)}, {t.season.en}; the feeling is {t.uri.en}.
      </p>
    </div>
  );
}

function Cell({ items }: { items: Karu[] }) {
  return (
    <ul className="space-y-1">
      {items.map((k) => (
        <li key={k.ta} className="leading-snug">
          {k.en}
        </li>
      ))}
    </ul>
  );
}

/** Every karu of every tinai in one table: categories down, landscapes across. */
export function KarupporulAtlas({ active, onGo }: { active: ThinaiKey; onGo: (k: ThinaiKey) => void }) {
  const [hover, setHover] = useState<ThinaiKey | null>(null);
  const hot = hover ?? active;
  const mutal: { key: "land" | "season" | "time" | "uri"; en: string }[] = [
    { key: "land", en: "Land" },
    { key: "season", en: "Season" },
    { key: "time", en: "Hour" },
    { key: "uri", en: "Feeling" },
  ];
  const colStyle = (k: ThinaiKey) =>
    k === hot ? { background: `color-mix(in oklab, ${tone(k, "accent")} 10%, transparent)` } : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-xs text-[color:var(--env-text-dim)]">{DRAFT_NOTE}</p>
      </div>
      <div className="-mx-4 mt-5 overflow-x-auto px-4" data-lenis-prevent>
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm" onMouseLeave={() => setHover(null)}>
          <thead>
            <tr className="border-b hair-lo">
              <th scope="col" className="sticky left-0 z-10 w-32 bg-[color:var(--env-ground)] py-3 pr-3 font-mono text-[10px] font-normal uppercase tracking-wider text-[color:var(--env-text-dim)]">
                Karu
              </th>
              {KARUPPORUL.map((t) => {
                const e = ENV_BY_KEY[t.key];
                return (
                  <th key={t.key} scope="col" className="px-3 py-3 align-bottom font-normal transition-colors duration-300" style={colStyle(t.key)} onMouseEnter={() => setHover(t.key)}>
                    <button type="button" onClick={() => onGo(t.key)} className="flex items-center gap-2 text-left">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: tone(t.key, "accent") }} />
                      <span>
                        <span className="block font-display text-base">{e.en}</span>
                        <span className="block text-[11px] text-[color:var(--env-text-dim)]">{e.landscape}</span>
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {mutal.map((m) => (
              <tr key={m.key} className="border-b align-top hair-lo">
                <th scope="row" className="sticky left-0 z-10 bg-[color:var(--env-ground)] py-2.5 pr-3 font-normal">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-text-dim)]">{m.en}</span>
                </th>
                {KARUPPORUL.map((t) => (
                  <td key={t.key} className="px-3 py-2.5 transition-colors duration-300" style={colStyle(t.key)} onMouseEnter={() => setHover(t.key)}>
                    <Cell items={[t[m.key]]} />
                  </td>
                ))}
              </tr>
            ))}
            {KARU_CATEGORIES.map((c) => (
              <tr key={c.key} className="border-b align-top hair-lo">
                <th scope="row" className="sticky left-0 z-10 bg-[color:var(--env-ground)] py-2.5 pr-3 font-normal">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-accent)]">{c.en}</span>
                </th>
                {KARUPPORUL.map((t) => (
                  <td key={t.key} className="px-3 py-2.5 transition-colors duration-300" style={colStyle(t.key)} onMouseEnter={() => setHover(t.key)}>
                    <Cell items={t.karu[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <blockquote className="rounded-2xl border p-5 hair-lo">
          <p lang="ta" className="font-display text-lg" style={{ lineHeight: "var(--leading-tamil)" }}>
            தெய்வம் உணாவே மாமரம் புள் பறை
            <br />
            செய்தி யாழின் பகுதியொடு தொகைஇ
            <br />
            அவ்வகை பிறவும் கருவென மொழிப
          </p>
          <footer className="mt-3 text-xs text-[color:var(--env-text-dim)]">
            Tolkāppiyam, Akattiṇaiyiyal — deity, food, beast, tree, bird, drum, occupation and the yazh: these, and things of their kind, are called karu.
          </footer>
        </blockquote>
        <div className="text-xs text-[color:var(--env-text-dim)]">
          <p className="font-mono text-[10px] uppercase tracking-wider">Checked against</p>
          <ul className="mt-2 space-y-1.5">
            {KARU_SOURCES.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a href={s.href} className="underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-text)]">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Also exported as data, with every Tamil name: <code className="font-mono">{'import { KARUPPORUL } from "@yazhi/bubble"'}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

/** The Sangam objects, each a Hairline figure with its own dial. */
export function ObjectsGallery() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {SANGAM_OBJECTS.map((o) => (
        <li key={o.key} className="group rounded-3xl border p-4 transition-[border-color] duration-500 hair-lo hover:[border-color:color-mix(in_oklab,var(--env-edge)_75%,transparent)] sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3>
              <span className="font-display text-2xl">{o.en}</span>
            </h3>
            {o.karu && (
              <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] text-[color:var(--env-accent)] hair-lo">karu · {o.karu}</span>
            )}
          </div>
          <FigureWithDial figure={o.figure} dial={o.dial} className="mt-2" />
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{o.note}</p>
        </li>
      ))}
    </ul>
  );
}

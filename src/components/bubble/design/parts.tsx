"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Environment, Spring } from "@/ui/tinai/environments";
import { HairlineFigure } from "@/ui/hairline/HairlineFigure";
import { FIGURE_DIAL, TINAI_FIGURES } from "@/ui/hairline/figures";
import type { ThinaiKey } from "@/lib/content";

/** Step response of a spring (mass 1) from 0 to 1, sampled for a chart. */
function stepResponse({ k, c }: Spring, seconds = 1.6, samples = 96) {
  const out: number[] = [];
  let x = 0, v = 0;
  const per = seconds / samples, sub = 20, h = per / sub;
  for (let i = 0; i <= samples; i++) {
    out.push(x);
    for (let j = 0; j < sub; j++) {
      v += (-k * (x - 1) - c * v) * h;
      x += v * h;
    }
  }
  return out;
}

/** The landscape's spring, drawn: how far it overshoots and how late it settles. */
export function SpringCurve({ spring, className = "" }: { spring: Spring; className?: string }) {
  const pts = useMemo(() => stepResponse(spring), [spring]);
  const W = 240, H = 90, top = 14, base = H - 12;
  const y = (v: number) => base - (base - top) * (v / 1.25);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * W).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const peak = Math.max(...pts);
  const zeta = spring.c / (2 * Math.sqrt(spring.k));
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Spring response: stiffness ${spring.k}, damping ${spring.c}, overshoot ${Math.round((peak - 1) * 100)} percent`}>
        <line x1={0} x2={W} y1={y(1)} y2={y(1)} stroke="var(--env-lo)" strokeDasharray="1 3" vectorEffect="non-scaling-stroke" />
        <line x1={0} x2={W} y1={base} y2={base} stroke="var(--env-lo)" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--env-hi)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[color:var(--env-text-dim)]">
        <span>k {spring.k}</span>
        <span>c {spring.c}</span>
        <span>ζ {zeta.toFixed(2)}</span>
        <span>overshoot {Math.max(0, Math.round((peak - 1) * 100))}%</span>
      </figcaption>
    </figure>
  );
}

/** A puck on a rail that springs to whichever end you send it, on the
    landscape's own spring. Feel the difference between Palai and Kurinji. */
export function SpringPlayground({ spring, label }: { spring: Spring; label: string }) {
  const puck = useRef<HTMLSpanElement>(null);
  const state = useRef({ x: 0, v: 0, t: 0, raf: 0, last: 0 });
  const [right, setRight] = useState(false);

  useEffect(() => {
    const s = state.current;
    const el = puck.current;
    if (!el) return;
    s.t = right ? 1 : 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.x = s.t;
      el.style.left = `${s.x * 100}%`;
      return;
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
      for (let i = 0; i < n; i++) {
        s.v += (-spring.k * (s.x - s.t) - spring.c * s.v) * h;
        s.x += s.v * h;
      }
      el.style.left = `${s.x * 100}%`;
      if (Math.abs(s.x - s.t) > 0.0005 || Math.abs(s.v) > 0.0005) s.raf = requestAnimationFrame(tick);
      else { s.x = s.t; s.v = 0; el.style.left = `${s.x * 100}%`; s.raf = 0; }
    };
    cancelAnimationFrame(s.raf);
    s.last = performance.now();
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [right, spring]);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setRight((r) => !r)}
        className="shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors hair hover:bg-[color:var(--env-surface)]"
        aria-label={`Send the puck to the other end on the ${label} spring`}
      >
        Send it
      </button>
      <div className="relative h-8 flex-1">
        <span className="absolute inset-x-0 top-1/2 border-t hair-lo" />
        <span className="absolute inset-x-3">
          <span ref={puck} className="absolute top-4 block h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--env-hi)] bg-[color:var(--env-surface)]" style={{ left: "0%" }} />
        </span>
      </div>
    </div>
  );
}

const ROLES: { key: keyof Environment["palette"]; role: string }[] = [
  { key: "ground", role: "page ground" },
  { key: "surface", role: "raised surface" },
  { key: "hi", role: "the one bright stroke" },
  { key: "edge", role: "silhouettes, rules" },
  { key: "mid", role: "ordinary strokes" },
  { key: "lo", role: "receding strokes" },
  { key: "accent", role: "the tinai hue" },
  { key: "text", role: "text" },
  { key: "textDim", role: "secondary text" },
];

/** The nine colours of an environment, each a button that copies its hex. */
export function Swatches({ env }: { env: Environment }) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-9">
        {ROLES.map(({ key, role }) => {
          const hex = env.palette[key];
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(hex).then(() => setCopied(`${key} ${hex}`), () => {});
                }}
                className="group w-full text-left"
                aria-label={`${key}, ${role}, ${hex}. Copy`}
              >
                <span className="block aspect-[4/3] rounded-lg border hair-lo transition-transform duration-300 group-hover:-translate-y-0.5" style={{ background: hex }} />
                <span className="mt-1.5 block truncate font-mono text-[11px] text-[color:var(--env-text)]" title={`--env-${key === "textDim" ? "text-dim" : key}`}>
                  {key === "textDim" ? "text-dim" : key}
                </span>
                <span className="block font-mono text-[10px] uppercase text-[color:var(--env-text-dim)]">{hex}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {copied ? `Copied ${copied}` : ""}
      </p>
    </div>
  );
}

/** A Hairline figure with its dial and read-out, in the landscape's ink. */
export function FigurePanel({ tinai, play = false, className = "" }: { tinai: ThinaiKey; play?: boolean; className?: string }) {
  const [intensity, setIntensity] = useState(0.5);
  const fig = TINAI_FIGURES[tinai];
  return (
    <div className={className}>
      <HairlineFigure figure={fig} intensity={intensity} play={play} className="w-full" />
      <label className="mt-2 flex items-center gap-3 font-mono text-[11px] text-[color:var(--env-text-dim)]">
        <span className="w-20 shrink-0">{FIGURE_DIAL[tinai]}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="book-range min-w-0 flex-1"
        />
      </label>
    </div>
  );
}

/** A slice of the Bubble UI dressed in one environment: tray, a cited
    answer and the composer, built only from --env-* tokens. */
export function EnvPreview({ env }: { env: Environment }) {
  return (
    <div className="overflow-hidden rounded-2xl border hair-lo bg-[color:var(--env-surface)]">
      <div className="flex items-center justify-between border-b px-4 py-2.5 hair-lo">
        <span className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--env-accent)" }} />
          {env.apps[0]}
        </span>
        <span className="flex gap-1.5">
          <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] text-[color:var(--env-text-dim)] hair-lo">sample</span>
          <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] text-[color:var(--env-text-dim)] hair-lo">on device</span>
        </span>
      </div>
      <div className="flex">
        <ul className="flex flex-col items-center gap-2 border-r p-3 hair-lo" aria-label="Bubbles">
          {[38, 28, 21, 28].map((r, i) => (
            <li
              key={i}
              className="grid place-items-center rounded-full border"
              style={{
                width: r,
                height: r,
                borderColor: i === 0 ? "var(--env-hi)" : "color-mix(in oklab, var(--env-edge) 60%, transparent)",
                background: "var(--env-ground)",
              }}
            />
          ))}
        </ul>
        <div className="min-w-0 flex-1 space-y-3 p-4 text-sm">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[color:var(--env-ground)] px-3 py-2 text-[color:var(--env-text)]">
            {env.key === "neytal" ? "How do I say “grandmother” in Tamil?" : env.key === "marutham" ? "Do I need a lawyer for a rent dispute?" : env.key === "palai" ? "Why did the deploy fail?" : env.key === "mullai" ? "Hint, not the answer, please." : "Where do I start?"}
          </p>
          <div className="max-w-[92%] text-[color:var(--env-text-dim)]">
            <p>
              {env.key === "marutham"
                ? "Here is what the tenancy Act says, with the section it says it in"
                : env.key === "neytal"
                  ? "பாட்டி (paati) is the everyday word"
                  : env.key === "palai"
                    ? "The health check timed out after the migration step"
                    : env.key === "mullai"
                      ? "Look at what the loop does on its last pass"
                      : "Pick one landscape and build one bubble"}
              <sup className="ml-0.5 font-mono text-[10px] text-[color:var(--env-accent)]">[1]</sup>.
            </p>
            <p className="mt-2 flex items-center gap-2 font-mono text-[10px]">
              <span className="h-px w-4 bg-[color:var(--env-edge)]" /> 1 · source shown with every claim
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 hair">
            <span className="flex-1 truncate text-[color:var(--env-text-dim)]">Ask {env.apps[0]}…</span>
            <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] text-[color:var(--env-ground)]" style={{ background: "var(--env-accent)" }} aria-hidden>
              ↑
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

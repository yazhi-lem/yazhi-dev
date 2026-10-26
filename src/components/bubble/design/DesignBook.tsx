"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ThinaiKey } from "@/lib/content";
import { ENVIRONMENTS, ENV_BY_KEY, type Environment } from "@/ui/tinai/environments";
import { TinaiScope } from "@/ui/tinai/TinaiScope";
import { TinaiAmbient } from "@/ui/tinai/TinaiAmbient";
import { MagneticTray, type MagneticItem } from "@/ui/tinai/MagneticTray";
import { EnvPreview, FigurePanel, SpringCurve, SpringPlayground, Swatches } from "./parts";

const HAIRLINE = "https://github.com/lucasmarkes/hairline";

const APPS: MagneticItem[] = [
  { id: "avai", label: "Avai", ta: "அவை" },
  { id: "nyaya", label: "Nyaya", ta: "நியாயம்" },
  { id: "kural", label: "Kural Desk", ta: "குறள்" },
  { id: "guru", label: "Guru", ta: "குரு" },
  { id: "kadai", label: "Kadai", ta: "கடை" },
  { id: "sangam", label: "Open Sangam", ta: "சங்கம்" },
  { id: "yazh", label: "Yazh", ta: "யாழ்" },
];

/** The Bubble UI design book: one long page that changes landscape as you
    read. The outer scope follows whichever tinai chapter is on screen, so
    the ground cross-fades between chapters; each chapter carries its own
    ink, ambient field and Hairline figure. */
export function DesignBook() {
  const [active, setActive] = useState<ThinaiKey>("kurinji");
  const chapters = useRef<Partial<Record<ThinaiKey, HTMLElement | null>>>({});

  // whichever chapter fills the middle of the viewport sets the landscape
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.chapter as ThinaiKey);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.values(chapters.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (k: ThinaiKey) => chapters.current[k]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <TinaiScope tinai={active} as="main" className="relative">
      <Rail active={active} onGo={go} />
      <Cover active={active} onPick={setActive} />
      <Principles />
      <Overview onGo={go} />
      {ENVIRONMENTS.map((env, i) => (
        <section
          key={env.key}
          id={env.key}
          data-chapter={env.key}
          ref={(el) => { chapters.current[env.key] = el; }}
          aria-labelledby={`${env.key}-title`}
          className="scroll-mt-14"
        >
          <Chapter env={env} n={i + 3} />
        </section>
      ))}
      <Foundations />
      <Motion />
      <Access />
      <DoDont />
      <Credits />
    </TinaiScope>
  );
}

/* ------------------------------------------------------------------ */

function Rail({ active, onGo }: { active: ThinaiKey; onGo: (k: ThinaiKey) => void }) {
  return (
    <nav aria-label="Landscapes" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col gap-3">
        {ENVIRONMENTS.map((e) => (
          <li key={e.key}>
            <button
              type="button"
              onClick={() => onGo(e.key)}
              aria-current={active === e.key ? "true" : undefined}
              className="group flex items-center justify-end gap-2"
            >
              <span
                className={`text-xs transition-opacity duration-500 ${active === e.key ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}
                style={{ color: "var(--env-text-dim)" }}
              >
                <span lang="ta">{e.ta}</span> · {e.en}
              </span>
              <span
                className="block h-2.5 w-2.5 rounded-full border transition-transform duration-500"
                style={{
                  borderColor: e.palette.accent,
                  background: active === e.key ? e.palette.accent : "transparent",
                  transform: active === e.key ? "scale(1.25)" : "scale(1)",
                }}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--env-accent)]">{children}</p>;
}

function Section({ id, n, title, ta, children, intro }: { id: string; n: number; title: string; ta: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl scroll-mt-14 px-4 py-20 sm:py-28 lg:px-8">
      <Eyebrow>{String(n).padStart(2, "0")}</Eyebrow>
      <h2 id={`${id}-title`} className="display mt-2 font-display text-3xl font-black sm:text-4xl">
        {title} <span lang="ta" className="font-normal text-[color:var(--env-text-dim)]">· {ta}</span>
      </h2>
      {intro && <div className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-[color:var(--env-text-dim)]">{intro}</div>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Cover({ active, onPick }: { active: ThinaiKey; onPick: (k: ThinaiKey) => void }) {
  const env = ENV_BY_KEY[active];
  const [app, setApp] = useState("avai");
  return (
    <header className="relative overflow-hidden border-b hair-lo">
      <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <TinaiAmbient key={active} tinai={active} className="book-fade" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="min-w-0">
          <Eyebrow>Bubble UI · Design Book</Eyebrow>
          <h1 className="display mt-3 font-display text-4xl font-black leading-[1.05] sm:text-6xl">
            Five landscapes.
            <br />
            One interface.
          </h1>
          <p lang="ta" className="mt-3 font-display text-2xl text-[color:var(--env-text-dim)]" style={{ lineHeight: "var(--leading-tamil-display)" }}>
            ஐந்திணை
          </p>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[color:var(--env-text-dim)]">
            Sangam poetry sorts the world into five tinai, each a landscape with its own mood. The Bubble UI gives each one
            a whole environment: a ground and an ink, a way of moving, a living background and a figure that answers your
            hand. A Yazhi app should feel like where it belongs before a word is read.
          </p>
          <div role="radiogroup" aria-label="Preview a landscape" className="mt-8 flex flex-wrap gap-2">
            {ENVIRONMENTS.map((e) => (
              <button
                key={e.key}
                type="button"
                role="radio"
                aria-checked={active === e.key}
                onClick={() => onPick(e.key)}
                className="rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-500"
                style={{
                  borderColor: active === e.key ? e.palette.accent : "color-mix(in oklab, var(--env-edge) 40%, transparent)",
                  background: active === e.key ? `color-mix(in oklab, ${e.palette.accent} 18%, transparent)` : "transparent",
                }}
              >
                <span lang="ta">{e.ta}</span>
                <span className="text-[color:var(--env-text-dim)]"> · {e.en}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[color:var(--env-text-dim)]">
            <span className="text-[color:var(--env-text)]">{env.signature}.</span> {env.pointerWords}
          </p>
          <div className="mt-8 max-w-full">
            <MagneticTray items={APPS} tinai={active} activeId={app} onSelect={setApp} />
          </div>
        </div>
        <div className="min-w-0 self-center">
          <FigurePanel key={active} tinai={active} play />
          <p className="mt-2 text-xs text-[color:var(--env-text-dim)]">
            Move over the figure. Hairline figures after{" "}
            <a href={HAIRLINE} className="underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-text)]">
              Hairline
            </a>{" "}
            by Lucas Marques (MIT).
          </p>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

const PRINCIPLES: { aram: string; ta: string; ui: string }[] = [
  { aram: "No claim without a source", ta: "சான்றின்றி சொல்லேல்", ui: "Every answer carries its citations inline. If there is no source, the bubble says “I don’t know” and offers where to look." },
  { aram: "Data stays home", ta: "தரவு வீட்டிலேயே", ui: "A runtime badge always shows where the model is running. On-device is the default; the cloud is a visible choice." },
  { aram: "Think, then act", ta: "சிந்தித்து செயல்", ui: "Nothing changes a system without a confirm gate that names exactly what will happen, in words, before it happens." },
  { aram: "Children first", ta: "குழந்தைகள் முதலில்", ui: "Child-facing screens are held until counsel signs off. Parents see everything a child’s bubble does." },
  { aram: "Ship what we said", ta: "சொன்னதைச் செய்", ui: "Drafts are marked as drafts — including Tamil copy awaiting a native reviewer. Nothing pretends to be finished." },
  { aram: "Tamil is first-class", ta: "தமிழ் முதன்மை", ui: "Tamil gets its own line height, is never letter-spaced and is never cut mid-letter. Labels are bilingual by default." },
];

const HAIRLINE_RULES = [
  "Hit areas never move: test against the rest pose.",
  "Stagger by distance from where the change started.",
  "Clamp reach; let falloff keep a floor.",
  "Stroke is the only highlight: no fills, no glows.",
  "Design the rest pose; one bright mark.",
  "Honest construction, painted back to front.",
  "Loops sleep offscreen.",
  "Two clocks: a tween for choices, springs for the pointer.",
  "Rounded solids are a silhouette and one crease.",
  "No words in the figure; the read-out names the part.",
];

function Principles() {
  return (
    <Section
      id="principles"
      n={1}
      title="Principles"
      ta="அறம்"
      intro={
        <p>
          The interface is where Yazhi&apos;s Aram rules become visible. Each rule below has a component that enforces it,
          so following the design book is following the rules.
        </p>
      }
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border hair-lo sm:grid-cols-2 lg:grid-cols-3" style={{ background: "color-mix(in oklab, var(--env-edge) 22%, transparent)" }}>
        {PRINCIPLES.map((p) => (
          <li key={p.aram} className="bg-[color:var(--env-ground)] p-6 transition-colors duration-500 hover:bg-[color:var(--env-surface)]">
            <p className="font-display text-lg font-semibold">{p.aram}</p>
            <p lang="ta" className="mt-1 text-sm text-[color:var(--env-accent)]" style={{ lineHeight: "var(--leading-tamil)" }}>
              {p.ta}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{p.ui}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[color:var(--env-text-dim)]">Tamil phrasing above is a draft pending native review.</p>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h3 className="font-display text-2xl font-bold">The hairline doctrine</h3>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
            Our figures and motion follow the ten rules of{" "}
            <a href={HAIRLINE} className="underline decoration-[color:var(--env-edge)] underline-offset-2">
              Hairline
            </a>{" "}
            by Lucas Marques: isometric line drawings that answer the pointer. We vendor its MIT-licensed kernel and draw
            our own figures, one per landscape, to its rules. The same rules govern every animated surface in the Bubble
            UI.
          </p>
        </div>
        <ol className="grid gap-x-6 sm:grid-cols-2">
          {HAIRLINE_RULES.map((r, i) => (
            <li key={r} className="flex gap-3 border-t py-3 text-sm hair-lo">
              <span className="font-mono text-[11px] text-[color:var(--env-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[color:var(--env-text-dim)]">{r}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Overview({ onGo }: { onGo: (k: ThinaiKey) => void }) {
  return (
    <Section
      id="tinai"
      n={2}
      title="The tinai system"
      ta="திணை"
      intro={
        <p>
          Every environment keeps the brand&apos;s spine — an ink ground, cream text, one accent — and changes the temperature
          of the ink, the accent hue and the way things move. Wrap any subtree in <code className="font-mono text-[0.9em]">{"<TinaiScope tinai=\"…\">"}</code>{" "}
          and everything inside takes the landscape; change it and every surface and stroke cross-fades.
        </p>
      }
    >
      <div className="-mx-4 overflow-x-auto px-4" data-lenis-prevent>
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">
            <tr className="border-b hair-lo">
              <th className="py-2 pr-4 font-normal">Tinai</th>
              <th className="py-2 pr-4 font-normal">Signature</th>
              <th className="py-2 pr-4 font-normal">Motion</th>
              <th className="py-2 pr-4 font-normal">Use for</th>
              <th className="py-2 font-normal">Apps</th>
            </tr>
          </thead>
          <tbody>
            {ENVIRONMENTS.map((e) => (
              <tr key={e.key} className="border-b align-top hair-lo">
                <td className="py-3 pr-4">
                  <button type="button" onClick={() => onGo(e.key)} className="flex items-center gap-2 text-left hover:underline">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.palette.accent }} />
                    <span>
                      <span lang="ta">{e.ta}</span> <span className="text-[color:var(--env-text-dim)]">{e.en}</span>
                    </span>
                  </button>
                </td>
                <td className="py-3 pr-4">{e.signature}</td>
                <td className="py-3 pr-4 text-[color:var(--env-text-dim)]">{e.motionWords.split(".")[0]}.</td>
                <td className="py-3 pr-4 text-[color:var(--env-text-dim)]">{e.useFor}</td>
                <td className="py-3 text-[color:var(--env-text-dim)]">{e.apps.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Chapter({ env, n }: { env: Environment; n: number }) {
  return (
    <TinaiScope tinai={env.key} ground={false} className="relative border-t hair-lo">
      <div className="absolute inset-x-0 top-0 h-[36rem] opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
        <TinaiAmbient tinai={env.key} />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <Eyebrow>
              {String(n).padStart(2, "0")} · {env.landscape}
            </Eyebrow>
            <h2 id={`${env.key}-title`} className="mt-3">
              <span lang="ta" className="block font-display text-5xl font-black sm:text-7xl" style={{ lineHeight: "var(--leading-tamil-display)" }}>
                {env.ta}
              </span>
              <span className="mt-1 block font-display text-2xl text-[color:var(--env-text-dim)]">{env.en}</span>
            </h2>
            <p className="mt-6 font-display text-xl">{env.signature}.</p>
            <p className="mt-2 max-w-md leading-relaxed text-[color:var(--env-text-dim)]">{env.mood}.</p>
            <dl className="mt-8 grid max-w-md gap-4 text-sm">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-accent)]">Light</dt>
                <dd className="mt-1 text-[color:var(--env-text-dim)]">{env.light}.</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-accent)]">Pointer</dt>
                <dd className="mt-1 text-[color:var(--env-text-dim)]">{env.pointerWords}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-accent)]">Use for</dt>
                <dd className="mt-1 text-[color:var(--env-text-dim)]">
                  {env.useFor}.{" "}
                  <span className="text-[color:var(--env-text)]">Default home of {env.apps.join(" and ")}.</span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0 self-center rounded-3xl border p-4 hair-lo sm:p-6" style={{ background: "color-mix(in oklab, var(--env-ground) 82%, transparent)" }}>
            <FigurePanel tinai={env.key} />
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Palette · click to copy</h3>
            <div className="mt-4">
              <Swatches env={env} />
            </div>
            <h3 className="mt-12 font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Motion personality</h3>
            <p className="mt-3 max-w-md text-sm text-[color:var(--env-text)]">{env.motionWords}</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <SpringCurve spring={env.spring} />
              <div className="space-y-3 text-[11px] text-[color:var(--env-text-dim)]">
                <SpringPlayground spring={env.spring} label={env.en} />
                <p className="font-mono">
                  settle {env.settle}ms · ambient pace ×{env.pace}
                </p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">In the Bubble UI</h3>
            <div className="mt-4">
              <EnvPreview env={env} />
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl border p-3 font-mono text-[11px] leading-relaxed text-[color:var(--env-text-dim)] hair-lo" data-lenis-prevent>
              {`<TinaiScope tinai="${env.key}">\n  <TinaiAmbient tinai="${env.key}" />\n  <AppFrame app={…} />\n</TinaiScope>`}
            </pre>
          </div>
        </div>
      </div>
    </TinaiScope>
  );
}

/* ------------------------------------------------------------------ */

const TOKENS: [string, string][] = [
  ["--env-ground", "Page ground. Five near-blacks, each tinted toward its landscape."],
  ["--env-surface", "Raised surfaces: panels, composer, the tray. One step up from ground; never a shadow."],
  ["--env-hi", "The one bright stroke. One per view at rest: the active bubble, the chosen part."],
  ["--env-edge", "Silhouettes and rules. The .hair and .hair-lo borders mix it down."],
  ["--env-mid / --env-lo", "Ordinary and receding strokes, for depth without fills."],
  ["--env-accent", "The tinai hue, also exposed as --accent for the existing library."],
  ["--env-text / --env-text-dim", "Cream text, warmed or cooled toward the landscape."],
  ["--hairline-*", "Mapped onto the same values so Hairline figures sit in the landscape's ink."],
];

function Foundations() {
  return (
    <Section
      id="foundations"
      n={8}
      title="Foundations"
      ta="அடித்தளம்"
      intro={<p>Small set, strictly used. Everything on this page is built from these and nothing else.</p>}
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-bold">Tokens</h3>
          <dl className="mt-4 divide-y divide-[color:color-mix(in_oklab,var(--env-edge)_25%,transparent)] text-sm">
            {TOKENS.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                <dt className="font-mono text-[12px] text-[color:var(--env-text)]">{k}</dt>
                <dd className="text-[color:var(--env-text-dim)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-10">
          <div>
            <h3 className="font-display text-xl font-bold">Type</h3>
            <div className="mt-4 space-y-3 rounded-2xl border p-5 hair-lo">
              <p className="font-display text-3xl font-black leading-tight">Display, for names and moments</p>
              <p lang="ta" className="font-display text-2xl" style={{ lineHeight: "var(--leading-tamil-display)" }}>
                யாமறிந்த மொழிகளிலே
              </p>
              <p className="text-sm leading-relaxed text-[color:var(--env-text-dim)]">
                Body, for reading. Latin leading 1.55; Tamil 1.75 in text and 1.35 in display, because kombu and the vowel
                signs need the room.
              </p>
              <p className="font-mono text-xs text-[color:var(--env-text-dim)]">Mono, for tokens, read-outs and numbers · 0123456789</p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Line and shape</h3>
            <div className="mt-4 grid grid-cols-3 items-end gap-4 rounded-2xl border p-5 hair-lo">
              {[38, 28, 21].map((r, i) => (
                <div key={r} className="text-center">
                  <span
                    className="mx-auto block rounded-full border"
                    style={{ width: r * 2, height: r * 2, borderColor: i === 0 ? "var(--env-hi)" : "var(--env-edge)" }}
                  />
                  <span className="mt-2 block font-mono text-[11px] text-[color:var(--env-text-dim)]">
                    {["l", "m", "s"][i]} · r{r}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
              Bubbles come in three sizes, 1 : 0.74 : 0.55, sized by how much work lives behind them. One stroke weight
              everywhere: a 1px hairline in the landscape&apos;s edge colour. No drop shadows, no glows — depth comes from
              ground, surface and stroke.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Motion() {
  return (
    <Section
      id="motion"
      n={9}
      title="Motion"
      ta="இயக்கம்"
      intro={<p>Two clocks, and a landscape to set their character.</p>}
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border hair-lo md:grid-cols-3" style={{ background: "color-mix(in oklab, var(--env-edge) 22%, transparent)" }}>
        {[
          ["A tween for choices", "Anything you choose — a tab, a bubble, a step — moves on one 700ms curve, cubic-bezier(.32,.72,0,1). Calm, decisive, the same everywhere."],
          ["Springs for the pointer", "Anything that follows the hand rides a spring, and the spring belongs to the tinai: heavy in Palai, buoyant in Kurinji, exact in Marutham, loose in Neytal."],
          ["Stagger by distance", "When one change spreads, it starts where you acted and reaches neighbours in order of distance, 30–60ms apart. Try the tray on the cover."],
        ].map(([t, d]) => (
          <div key={t} className="bg-[color:var(--env-ground)] p-6">
            <p className="font-display text-lg font-semibold">{t}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ENVIRONMENTS.map((e) => (
          <TinaiScope key={e.key} tinai={e.key} className="rounded-2xl border p-4 hair-lo">
            <p className="text-sm">
              <span lang="ta">{e.ta}</span> <span className="text-[color:var(--env-text-dim)]">{e.en}</span>
            </p>
            <SpringCurve spring={e.spring} className="mt-3" />
          </TinaiScope>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--env-text-dim)]">
        With reduced motion, springs and tweens jump to their end, ambient fields draw one still frame and colour changes
        are instant. Nothing is lost: every state is still reachable and labelled.
      </p>
    </Section>
  );
}

function Access() {
  const rows = [
    ["Hit areas stay put", "Only the drawing moves. A bubble that swells keeps its button exactly where it was, so the pointer never chases a target."],
    ["Everything has a name", "Figures are role=img with a sentence of meaning; their read-out is a polite live region. Ambient canvases are aria-hidden."],
    ["Keyboard is a pointer", "Focus lifts a bubble the way hover does. Focus rings use the bright stroke, never colour alone."],
    ["Tamil, whole", "Never letter-spaced. Text is cut by grapheme (Intl.Segmenter), so கு is never torn into க and ு."],
    ["Contrast", "Text and the bright stroke stay above WCAG AA on every ground; accents carry meaning only alongside a word."],
    ["Sleep", "Every animated surface sleeps when offscreen or when the tab is hidden. Batteries are a resource of the person, not of the app."],
  ];
  return (
    <Section id="access" n={10} title="Access and Tamil" ta="அணுகல்">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {rows.map(([t, d]) => (
          <div key={t} className="border-t pt-4 hair-lo">
            <dt className="font-display text-lg font-semibold">{t}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{d}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function DoDont() {
  const pairs = [
    ["Pick the tinai from what the app is for.", "Pick a tinai because you like its colour."],
    ["One bright mark at rest.", "Light up everything that is interactive."],
    ["Let the landscape move the ambient field.", "Put text or controls on the ambient field."],
    ["Mark a draft as a draft.", "Ship Tamil copy no native speaker has read as final."],
    ["Change landscape across whole sections.", "Mix two tinai inside one card."],
  ];
  return (
    <Section id="do" n={11} title="Do and don’t" ta="செய் · செய்யாதே">
      <ul className="grid gap-3">
        {pairs.map(([d, n]) => (
          <li key={d} className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border p-4 text-sm hair">
              <span className="mr-2 font-mono text-[11px] text-[color:var(--env-accent)]">DO</span>
              {d}
            </p>
            <p className="rounded-xl border border-dashed p-4 text-sm text-[color:var(--env-text-dim)] hair-lo">
              <span className="mr-2 font-mono text-[11px]">DON&apos;T</span>
              {n}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Credits() {
  return (
    <footer className="mx-auto max-w-6xl border-t px-4 py-16 text-sm text-[color:var(--env-text-dim)] hair-lo lg:px-8">
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-semibold text-[color:var(--env-text)]">Use it</p>
          <pre className="mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed" data-lenis-prevent>{`import { TinaiScope, TinaiAmbient,\n  MagneticTray, HairlineFigure,\n  TINAI_FIGURES } from "@/ui";`}</pre>
        </div>
        <div>
          <p className="font-display text-base font-semibold text-[color:var(--env-text)]">Library</p>
          <ul className="mt-3 space-y-1">
            <li><Link href="/bubble/components" className="hover:text-[color:var(--env-text)]">Components</Link></li>
            <li><Link href="/bubble/modules" className="hover:text-[color:var(--env-text)]">Modules</Link></li>
            <li><Link href="/bubble/pages" className="hover:text-[color:var(--env-text)]">Pages</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-base font-semibold text-[color:var(--env-text)]">Credits</p>
          <p className="mt-3 leading-relaxed">
            Hairline kernel and rules ©{" "}
            <a href={HAIRLINE} className="underline decoration-[color:var(--env-edge)] underline-offset-2">Lucas Marques</a>, MIT
            licence, vendored in <code className="font-mono text-[11px]">src/ui/hairline</code>. Tinai moods from the
            Sangam landscape tradition as written up on yazhi.dev.
          </p>
        </div>
      </div>
    </footer>
  );
}

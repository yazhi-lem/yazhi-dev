"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { ThinaiKey } from "../tinai/keys";
import { ENVIRONMENTS, ENV_BY_KEY } from "../tinai/environments";
import { TinaiScope } from "../tinai/TinaiScope";
import { YAZHI_AGENTS } from "../lib/agents";
import { PAGE_TEMPLATES, type TemplateSlug } from "../pages/catalog";
import { Code, HAIRLINE, Section, TabPanel, Tabs, useTabsId } from "./kit";
import { SpringCurve } from "./parts";
import { KarupporulAtlas, ObjectsGallery } from "./sangam";
import { Demo, TemplatePreview } from "./Demos";
import type { CatalogEntry } from "./catalog";

/* ------------------------------------------------------------------ */

const TOKENS: [string, string][] = [
  ["--env-ground", "Page ground: five near-blacks by night, five papers by day, each tinted toward its landscape."],
  ["--env-surface", "Raised surfaces: panels, composer, the tray. One step from ground; never a shadow."],
  ["--env-hi", "The one bright stroke. One per view at rest: the active bubble, the chosen part."],
  ["--env-edge", "Silhouettes and rules. The .hair and .hair-lo borders mix it down."],
  ["--env-mid / --env-lo", "Ordinary and receding strokes, for depth without fills."],
  ["--env-accent", "The tinai hue, also exposed as --accent."],
  ["--env-text / --env-text-dim", "Text, warmed or cooled toward the landscape."],
  ["--night / --ivory / --gold", "The brand: ground, text and gold. Inside a TinaiScope they follow the landscape."],
];

export function Foundations() {
  return (
    <Section id="foundations" eyebrow="Design" title="Foundations" wide intro={<p>Small set, strictly used. Everything on this page is built from these and nothing else.</p>}>
      <div className="grid gap-12 xl:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-bold">Light and dark</h3>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
            Every colour is a pair, written once with CSS <Code>light-dark()</Code>. Bubble surfaces sit in <Code>.bubble-root</Code> and follow the
            system; <Code>{'data-mode="light"'}</Code> or <Code>{'"dark"'}</Code> on <Code>{"<html>"}</Code> pins a choice, and{" "}
            <Code>{"<TinaiScope scheme=\"light\">"}</Code> pins one subtree. By night the ground is ink and the text is cream; by day the ground is
            paper and the landscape’s ink becomes the text. Text stays at 15:1 or more, secondary text at 6.9:1 or more and accents at 5:1 or more
            on every ground, in both modes.
          </p>
          <h3 className="mt-10 font-display text-xl font-bold">Tokens</h3>
          <dl className="mt-4 divide-y divide-[color:color-mix(in_oklab,var(--env-edge)_25%,transparent)] text-sm">
            {TOKENS.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="font-mono text-[12px]">{k}</dt>
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
                Body, for reading. Latin leading 1.55; Tamil 1.75 in text and 1.35 in display, because kombu and the vowel signs need the room.
              </p>
              <p className="font-mono text-xs text-[color:var(--env-text-dim)]">Mono, for tokens, read-outs and numbers · 0123456789</p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Line and shape</h3>
            <div className="mt-4 grid grid-cols-3 items-end gap-4 rounded-2xl border p-5 hair-lo">
              {[38, 28, 21].map((r, i) => (
                <div key={r} className="text-center">
                  <span className="mx-auto block rounded-full border" style={{ width: r * 2, height: r * 2, borderColor: i === 0 ? "var(--env-hi)" : "var(--env-edge)" }} />
                  <span className="mt-2 block font-mono text-[11px] text-[color:var(--env-text-dim)]">
                    {["l", "m", "s"][i]} · r{r}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
              Bubbles come in three sizes, 1 : 0.74 : 0.55, sized by how much work lives behind them. One stroke weight everywhere: a 1px hairline in
              the landscape’s edge colour. No drop shadows, no glows — depth comes from ground, surface and stroke.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Motion() {
  return (
    <Section id="motion" eyebrow="Design" title="Motion" wide intro={<p>Two clocks, and a landscape to set their character.</p>}>
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
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ENVIRONMENTS.map((e) => (
          <TinaiScope key={e.key} tinai={e.key} className="rounded-2xl border p-4 hair-lo">
            <p className="text-sm">{e.en}</p>
            <SpringCurve spring={e.spring} className="mt-3" />
          </TinaiScope>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--env-text-dim)]">
        With reduced motion, springs and tweens jump to their end, ambient fields draw one still frame and colour changes are instant. Nothing is
        lost: every state is still reachable and labelled.
      </p>
    </Section>
  );
}

export function Access() {
  const rows = [
    ["Hit areas stay put", "Only the drawing moves. A bubble that swells keeps its button exactly where it was, so the pointer never chases a target."],
    ["Everything has a name", "Figures are role=img with a sentence of meaning; ambient canvases are aria-hidden. Tabs, menus and panels follow the WAI-ARIA patterns."],
    ["Keyboard is a pointer", "Focus lifts a bubble the way hover does. Focus rings use the bright stroke, never colour alone. Escape closes panels."],
    ["Targets", "At least 44px. The composer never sends while an input method is composing — Tamil keyboards confirm letters with Enter."],
    ["Tamil, whole", "Never letter-spaced. Text is cut by grapheme (Intl.Segmenter), so கு is never torn into க and ு."],
    ["Light, dark, system", "Both themes meet WCAG AA everywhere; the choice is always one press away, signed in or not."],
    ["Announce once", "A streaming reply is announced when it finishes, not token by token."],
    ["Sleep", "Every animated surface sleeps when offscreen or when the tab is hidden."],
  ];
  return (
    <Section id="access" eyebrow="Design" title="Access" wide>
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

export function Sangam({ tinai, onPick }: { tinai: ThinaiKey; onPick: (k: ThinaiKey) => void }) {
  return (
    <Section
      id="sangam"
      eyebrow="Design"
      title="Sangam atlas"
      wide
      intro={
        <p>
          The things native to each landscape — its god, birds and beasts, flowers and trees, food, water, drum, yazh and melody, work and
          settlement — are the raw material for each theme’s icons, sounds and illustrations. Choose a landscape in the table to dress the page in
          it. Below, Sangam objects drawn as Hairline figures: they take whatever ink they are placed in.
        </p>
      }
    >
      <KarupporulAtlas active={tinai} onGo={onPick} />
      <div className="mt-14">
        <ObjectsGallery />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function EntryCard({ entry }: { entry: CatalogEntry }) {
  return (
    <article id={entry.slug} className="scroll-mt-28 rounded-2xl border bg-[color:var(--env-surface)] p-4 hair-lo sm:p-5 lg:scroll-mt-20">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-mono text-base font-medium">
            <a href={`#${entry.slug}`} className="hover:text-[color:var(--env-accent)]">
              {entry.name}
            </a>
          </h3>
          <p className="mt-1 max-w-prose text-sm text-[color:var(--env-text-dim)]">{entry.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-1" aria-label="Used in">
          {entry.apps.map((a) => (
            <li key={a} className="rounded-full border px-2 py-0.5 text-[11px] text-[color:var(--env-text-dim)] hair-lo">
              {a}
            </li>
          ))}
        </ul>
      </header>
      {entry.rule && (
        <p className="mt-2 text-xs text-[color:var(--env-accent)]">
          <span className="font-semibold">Enforces:</span> {entry.rule}
        </p>
      )}
      <div className="mt-4">
        <Demo slug={entry.slug} />
      </div>
      <details className="group mt-3">
        <summary className="cursor-pointer py-1 text-xs text-[color:var(--env-text-dim)] hover:text-[color:var(--env-text)]">Usage</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-[color:var(--env-ground)] p-3 font-mono text-[12px] leading-relaxed" data-lenis-prevent tabIndex={0}>
          {entry.usage}
        </pre>
      </details>
    </article>
  );
}

/** One layer of the library: its entries, each with a live demo and usage. */
export function Gallery({ id, title, eyebrow, entries, names, children }: { id: string; title: string; eyebrow: string; entries: CatalogEntry[]; names: string; children: ReactNode }) {
  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      title={title}
      wide
      intro={
        <>
          {children}
          <p className="mt-4 overflow-x-auto rounded-lg border bg-[color:var(--env-surface)] px-3 py-2 font-mono text-[12.5px] text-[color:var(--env-text)] hair-lo">
            {`import { ${names} } from "@yazhi/bubble";`}
          </p>
        </>
      }
    >
      <nav aria-label={`${title} index`} className="mb-6">
        <ul className="flex flex-wrap gap-1.5">
          {entries.map((e) => (
            <li key={e.slug}>
              <a href={`#${e.slug}`} className="block rounded-full border px-3 py-1.5 font-mono text-[12px] text-[color:var(--env-text-dim)] hair-lo hover:text-[color:var(--env-text)]">
                {e.name.split(" · ")[0]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid gap-6 2xl:grid-cols-2">
        {entries.map((e) => (
          <EntryCard key={e.slug} entry={e} />
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Every app screen in one viewer; ?template=slug opens one directly. */
export function Templates() {
  const base = useTabsId();
  const [slug, setSlug] = useState<TemplateSlug>(PAGE_TEMPLATES[0].slug as TemplateSlug);
  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get("template");
    if (want && PAGE_TEMPLATES.some((t) => t.slug === want)) queueMicrotask(() => setSlug(want as TemplateSlug));
  }, []);
  const t = PAGE_TEMPLATES.find((p) => p.slug === slug)!;
  return (
    <Section
      id="templates"
      eyebrow="Library · layer 3"
      title="Templates"
      wide
      intro={
        <p>
          Complete screens for each Yazhi app, composed from modules inside one <Code>AppFrame</Code>, running on sample data. Start a new app by
          copying the closest one.
        </p>
      }
    >
      <Tabs base={base} label="Templates" value={slug} onChange={(id) => setSlug(id as TemplateSlug)} items={PAGE_TEMPLATES.map((p) => ({ id: p.slug, label: p.app.name, swatch: p.app.accent }))} />
      <TabPanel base={base} value={slug} className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="max-w-2xl text-sm text-[color:var(--env-text-dim)]">
            {t.summary} <span className="whitespace-nowrap">{t.app.runtime === "device" ? "Runs on-device." : "Runs on yazhi-api."}</span>
          </p>
          <p className="font-mono text-[11px] text-[color:var(--env-text-dim)]">{t.modules.join(" · ")}</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border hair">
          <TemplatePreview key={slug} slug={slug} />
        </div>
      </TabPanel>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Yazhi's own agents, as people meet them in Yazhi Chat. */
export function Agents({ chatHref }: { chatHref: string }) {
  return (
    <Section
      id="agents"
      eyebrow="Library"
      title="Agents"
      wide
      intro={
        <p>
          Yazhi’s own agents, from the Aram harness. They run on Adhan through yazhi-api, and every turn passes the Five-Posture Reasoning Kernel.
          Each lives in one landscape and keeps one rule it never breaks. Samples are illustrative, and their Tamil is a draft.
        </p>
      }
    >
      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {YAZHI_AGENTS.map((a) => {
          const env = ENV_BY_KEY[a.tinai];
          return (
            <li key={a.id}>
              <TinaiScope tinai={a.tinai} as="article" className="flex h-full flex-col rounded-2xl border p-5 hair-lo">
                <header className="flex items-center gap-3">
                  <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full border text-sm font-semibold" style={{ borderColor: "var(--env-hi)", color: "var(--env-hi)" }}>
                    {a.glyph}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold">{a.name}</h3>
                    <p className="text-xs text-[color:var(--env-text-dim)]">
                      {a.home} · {env.en}
                    </p>
                  </div>
                </header>
                <p className="mt-4 text-sm leading-relaxed">{a.persona}</p>
                {a.rule && (
                  <p className="mt-3 text-xs text-[color:var(--env-text-dim)]">
                    <span className="font-mono uppercase tracking-wider text-[color:var(--env-accent)]">Rule</span> {a.rule}
                  </p>
                )}
                {a.status && <p className="mt-2 font-mono text-[11px] text-[color:var(--env-text-dim)]">{a.status}</p>}
                {a.sample && (
                  <details className="mt-4 rounded-xl border hair-lo">
                    <summary className="cursor-pointer px-3 py-2.5 text-sm">See a sample</summary>
                    <div className="space-y-3 border-t px-3 pb-3 pt-3 text-sm hair-lo">
                      <p className="whitespace-pre-wrap rounded-xl bg-[color:var(--env-surface)] px-3 py-2">{a.sample.q}</p>
                      <p className="whitespace-pre-wrap text-[color:var(--env-text-dim)]">{a.sample.a.replace(/^> /gm, "").replace(/_/g, "")}</p>
                    </div>
                  </details>
                )}
                <a href={chatHref} className="mt-auto inline-flex min-h-11 items-center gap-1 pt-4 text-sm underline decoration-[color:var(--env-edge)] underline-offset-4 hover:text-[color:var(--env-accent)]">
                  Talk to {a.name} in Yazhi Chat <span aria-hidden>→</span>
                </a>
              </TinaiScope>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 max-w-3xl text-sm text-[color:var(--env-text-dim)]">
        Held back on purpose: the Orchestrator and Reflection agents work behind yazhi-api, not in a chat; Guard-kid and the Yazh agents for
        children stay out of every public screen until counsel sign-off and verified parental consent.
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

export function DoDont() {
  const pairs = [
    ["Pick the theme from what the app is for.", "Pick a theme because you like its colour."],
    ["One bright mark at rest.", "Light up everything that is interactive."],
    ["Let the landscape move the ambient field.", "Put text or controls on the ambient field."],
    ["Check every screen in light and in dark.", "Hard-code a colour that only works on one ground."],
    ["Mark a draft as a draft.", "Ship Tamil copy no native speaker has read as final."],
    ["Change landscape across whole sections.", "Mix two themes inside one card."],
  ];
  return (
    <Section id="do" eyebrow="Library" title="Do and don’t" wide>
      <ul className="grid gap-3">
        {pairs.map(([d, n]) => (
          <li key={d} className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border p-4 text-sm hair">
              <span className="mr-2 font-mono text-[11px] text-[color:var(--env-accent)]">DO</span>
              {d}
            </p>
            <p className="rounded-xl border border-dashed p-4 text-sm text-[color:var(--env-text-dim)] hair-lo">
              <span className="mr-2 font-mono text-[11px]">DON’T</span>
              {n}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Credits() {
  return (
    <footer className="mt-8 grid gap-8 border-t py-14 text-sm text-[color:var(--env-text-dim)] hair-lo sm:grid-cols-3">
      <div>
        <p className="font-display text-base font-semibold text-[color:var(--env-text)]">Use it</p>
        <pre className="mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed" data-lenis-prevent tabIndex={0}>{`import "@yazhi/bubble/styles/bubble.css";
import { TinaiScope, MissionControl,
  CitedAnswer, AppFrame } from "@yazhi/bubble";`}</pre>
      </div>
      <div>
        <p className="font-display text-base font-semibold text-[color:var(--env-text)]">In the repository</p>
        <p className="mt-3 leading-relaxed">
          Everything on this page lives in <Code>packages/bubble</Code>: source, theme files with their personas, design PDFs and docs.
        </p>
      </div>
      <div>
        <p className="font-display text-base font-semibold text-[color:var(--env-text)]">Credits</p>
        <p className="mt-3 leading-relaxed">
          Hairline kernel and rules ©{" "}
          <a href={HAIRLINE} className="underline decoration-[color:var(--env-edge)] underline-offset-2">
            Lucas Marques
          </a>
          , MIT licence. Tinai moods from the Sangam landscape tradition as written up on yazhi.dev.
        </p>
      </div>
    </footer>
  );
}


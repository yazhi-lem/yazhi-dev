"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ThinaiKey } from "../tinai/keys";
import { ENVIRONMENTS, ENV_BY_KEY, tone } from "../tinai/environments";
import { TinaiScope } from "../tinai/TinaiScope";
import { TinaiAmbient } from "../tinai/TinaiAmbient";
import { MagneticTray, type MagneticItem } from "../tinai/MagneticTray";
import { MarkBubble } from "../mission/MarkBubble";
import { ModeSwitch } from "../mission/ModeSwitch";
import { Eyebrow, HAIRLINE, Pre, Section } from "./kit";
import { FigurePanel } from "./parts";
import { Themes } from "./themes";
import { Access, Agents, Credits, DoDont, Foundations, Gallery, Motion, Sangam, Templates } from "./sections";
import { COMPONENTS, MODULES } from "./catalog";

export interface TocGroup {
  group: string;
  items: [id: string, label: string][];
}

const TOC: TocGroup[] = [
  { group: "Start", items: [["overview", "Overview"], ["principles", "Principles"], ["mission", "Mission Control"]] },
  { group: "Design", items: [["themes", "Themes"], ["foundations", "Foundations"], ["motion", "Motion"], ["access", "Access"], ["sangam", "Sangam atlas"]] },
  { group: "Library", items: [["components", "Components"], ["modules", "Modules"], ["templates", "Templates"], ["agents", "Agents"], ["do", "Do and don’t"]] },
];

const APPS: MagneticItem[] = [
  { id: "avai", label: "Avai", ta: "அவை" },
  { id: "nyaya", label: "Nyaya", ta: "நியாயம்" },
  { id: "kural", label: "Kural Desk", ta: "குறள்" },
  { id: "guru", label: "Guru", ta: "குரு" },
  { id: "kadai", label: "Kadai", ta: "கடை" },
  { id: "sangam", label: "Open Sangam", ta: "சங்கம்" },
  { id: "yazh", label: "Yazh", ta: "யாழ்" },
];

/** The Bubble UI library on one page: the design system (themes in light
    and dark, foundations, motion, access), every component, module and
    page template live, Yazhi's agents and Mission Control. The whole page
    wears one landscape at a time; pick it on the cover or in Themes.

    `build` adds the host's own sections after the library (yazhi.dev puts
    its builder docs there), listed under `buildToc`. */
export function Library({ build, buildToc, chatHref = "/chat" }: { build?: ReactNode; buildToc?: TocGroup; chatHref?: string }) {
  const [tinai, setTinai] = useState<ThinaiKey>("kurinji");
  const toc = buildToc ? [...TOC, buildToc] : TOC;

  // sections rise into place as they arrive; without script everything is simply shown
  useEffect(() => {
    const el = document.getElementById("library");
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("book-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    el.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <TinaiScope tinai={tinai} as="main" className="relative" id="library">
      <Progress />
      <Cover tinai={tinai} onPick={setTinai} chatHref={chatHref} />
      <MobileToc toc={toc} />
      {/* print drops the contents column (print-hide), so the grid becomes one column */}
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 lg:grid-cols-[13rem_minmax(0,1fr)] lg:px-8 print:block">
        <Toc toc={toc} />
        <div className="min-w-0 pb-16">
          <Principles />
          <MissionDoc />
          <Themes tinai={tinai} onPick={setTinai} />
          <Foundations />
          <Motion />
          <Access />
          <Sangam tinai={tinai} onPick={setTinai} />
          <Gallery id="components" title="Components" eyebrow="Library · layer 1" entries={COMPONENTS} names="Bubble, Pill, Panel, CitationMark, IDontKnow, ConfirmGate, Composer">
            <p>
              The primitives every Yazhi app shares. Several exist to enforce a rule in the interface itself: a citation for every claim, an
              honest “I don’t know”, a person in front of every system change. Compose them into modules.
            </p>
          </Gallery>
          <Gallery id="modules" title="Modules" eyebrow="Library · layer 2" entries={MODULES} names="CitedAnswer, HintLadder, RunbookPanel, VerseReader, ConsentGate">
            <p>
              App blocks built only from components: cited answers, runbooks, the hint ladder, the verse reader, orders and consent. Reach for a
              component only when no module fits.
            </p>
          </Gallery>
          <Templates />
          <Agents chatHref={chatHref} />
          <DoDont />
          {build}
          <Credits />
        </div>
      </div>
    </TinaiScope>
  );
}

/* ------------------------------------------------------------------ */

/** A hairline under the header that fills as you read, in the landscape's accent. */
function Progress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div aria-hidden className="print-hide pointer-events-none fixed inset-x-0 top-14 z-30 h-px">
      <span ref={bar} className="block h-full origin-left bg-[color:var(--env-accent)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/** Which section is in the middle of the screen. */
function useCurrent(ids: string[]) {
  const [current, setCurrent] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).dataset.toc!);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    key.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);
  return current;
}

function Toc({ toc }: { toc: TocGroup[] }) {
  const current = useCurrent(toc.flatMap((g) => g.items.map(([id]) => id)));
  return (
    <nav aria-label="On this page" className="print-hide hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-8 pt-16 [scrollbar-width:thin]" data-lenis-prevent>
        {toc.map((g) => (
          <div key={g.group} className="mb-5">
            <p className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--env-accent)]">{g.group}</p>
            <ul className="space-y-0.5 text-sm">
              {g.items.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={current === id ? "location" : undefined}
                    className={`block rounded-lg px-2 py-1 transition-colors ${
                      current === id ? "bg-[color:var(--env-surface)] text-[color:var(--env-text)]" : "text-[color:var(--env-text-dim)] hover:text-[color:var(--env-text)]"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

/** Phones and tablets: the same contents as a row that scrolls sideways. */
function MobileToc({ toc }: { toc: TocGroup[] }) {
  return (
    <nav aria-label="Sections" className="print-hide sticky top-14 z-20 border-y hair-lo lg:hidden" style={{ background: "color-mix(in oklab, var(--env-ground) 88%, transparent)" }}>
      <ul className="flex gap-1 overflow-x-auto px-4 py-2 text-sm [scrollbar-width:none]" data-lenis-prevent>
        {toc.flatMap((g) => g.items).map(([id, label]) => (
          <li key={id} className="shrink-0">
            <a href={`#${id}`} className="block whitespace-nowrap rounded-full px-3 py-1.5 text-[color:var(--env-text-dim)] hover:text-[color:var(--env-text)]">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

function Cover({ tinai, onPick, chatHref }: { tinai: ThinaiKey; onPick: (k: ThinaiKey) => void; chatHref: string }) {
  const env = ENV_BY_KEY[tinai];
  const [app, setApp] = useState("avai");
  return (
    <header id="overview" data-toc="overview" className="relative scroll-mt-14 overflow-hidden border-b hair-lo">
      <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <TinaiAmbient key={tinai} tinai={tinai} className="book-fade" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="min-w-0">
          <Eyebrow>Yazhi · Bubble UI · v0.1</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] sm:text-6xl">
            One interface.
            <br />
            Five landscapes.
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[color:var(--env-text-dim)]">
            Bubble UI is the surface every Yazhi app lives in: a conversation, a tray of bubbles and Mission Control. This page is the whole
            library — design system, components, modules, page templates and agents — live, in light and dark, and in each of the five Sangam
            landscapes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#components" className="inline-flex min-h-11 items-center rounded-full bg-[color:var(--env-text)] px-5 text-sm font-semibold text-[color:var(--env-ground)] transition-opacity hover:opacity-90">
              Browse components
            </a>
            <a href={chatHref} className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm transition-colors hair hover:bg-[color:var(--env-surface)]">
              Open Yazhi Chat
            </a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-2" role="group" aria-label="Landscape for this page">
            {ENVIRONMENTS.map((e) => (
              <button
                key={e.key}
                type="button"
                aria-pressed={tinai === e.key}
                onClick={() => onPick(e.key)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-500"
                style={{
                  borderColor: tinai === e.key ? tone(e.key, "accent") : "color-mix(in oklab, var(--env-edge) 40%, transparent)",
                  background: tinai === e.key ? `color-mix(in oklab, ${tone(e.key, "accent")} 16%, transparent)` : "transparent",
                }}
              >
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: tone(e.key, "accent") }} />
                {e.en}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[color:var(--env-text-dim)]">
            <span className="text-[color:var(--env-text)]">{env.signature}.</span> {env.pointerWords}
          </p>
          <div className="mt-6 max-w-full">
            <MagneticTray items={APPS} tinai={tinai} activeId={app} onSelect={setApp} />
          </div>
        </div>
        <div className="min-w-0 self-center">
          <FigurePanel key={tinai} tinai={tinai} play />
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

const PRINCIPLES: { rule: string; ui: string }[] = [
  { rule: "No claim without a source", ui: "Every answer carries its citations inline. With no source, the bubble says “I don’t know” and offers where to look." },
  { rule: "Data stays home", ui: "A runtime badge always shows where the model runs. On-device is the default; the cloud is a visible choice." },
  { rule: "Think, then act", ui: "Nothing changes a system without a confirm gate that names exactly what will happen, in words, before it happens." },
  { rule: "Children first", ui: "Child-facing screens are held until counsel signs off. Parents see everything a child’s bubble does." },
  { rule: "Ship what we said", ui: "Drafts are marked as drafts — including Tamil copy awaiting a native reviewer. Nothing pretends to be finished." },
  { rule: "Tamil is first-class", ui: "Tamil gets its own line height, is never letter-spaced and is never cut mid-letter." },
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
      eyebrow="Start"
      title="Principles"
      wide
      intro={<p>The interface is where Yazhi’s Aram rules become visible. Each rule has a component that enforces it, so following this library is following the rules.</p>}
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border hair-lo sm:grid-cols-2 xl:grid-cols-3" style={{ background: "color-mix(in oklab, var(--env-edge) 22%, transparent)" }}>
        {PRINCIPLES.map((p) => (
          <li key={p.rule} className="bg-[color:var(--env-ground)] p-6 transition-colors duration-500 hover:bg-[color:var(--env-surface)]">
            <p className="font-display text-lg font-semibold">{p.rule}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{p.ui}</p>
          </li>
        ))}
      </ul>
      <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_1.4fr]">
        <div>
          <h3 className="font-display text-2xl font-bold">The hairline doctrine</h3>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
            Figures and motion follow the ten rules of{" "}
            <a href={HAIRLINE} className="underline decoration-[color:var(--env-edge)] underline-offset-2">
              Hairline
            </a>{" "}
            by Lucas Marques: isometric line drawings that answer the pointer. We vendor its MIT-licensed kernel and draw our own figures to its
            rules. The same rules govern every animated surface in Bubble UI.
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

function MissionDoc() {
  const [awake, setAwake] = useState(true);
  return (
    <Section
      id="mission"
      eyebrow="Start"
      title="Mission Control"
      wide
      intro={
        <p>
          The Yazhi mark — three bubbles — held inside a bubble. It leads every composer and header, and it is the one place a person controls
          Yazhi from: their Circle account, the theme, the landscape a chat wears and where its replies run. It wakes once a Circle account is
          signed in; until then it sleeps, and pressing it asks you to sign in or join.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border p-6 hair-lo">
          <div className="flex items-center justify-around gap-6">
            {[false, true].map((a) => (
              <figure key={String(a)} className="text-center">
                <MarkBubble size={72} awake={a} />
                <figcaption className="mt-3 text-sm">{a ? "Awake" : "Asleep"}</figcaption>
                <p className="text-xs text-[color:var(--env-text-dim)]">{a ? "Signed in · opens the panel" : "No account · opens sign-in"}</p>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4 hair-lo">
            <span className="text-sm text-[color:var(--env-text-dim)]">Try the wake</span>
            <button
              type="button"
              onClick={() => setAwake((a) => !a)}
              aria-label={awake ? "Mission Control demo, awake. Put it to sleep" : "Mission Control demo, asleep. Wake it"}
              className="grid h-12 w-12 place-items-center rounded-full"
            >
              <MarkBubble size={44} awake={awake} className={awake ? "mission-wake" : ""} />
            </button>
          </div>
        </div>
        <div className="min-w-0 space-y-5 text-sm leading-relaxed text-[color:var(--env-text-dim)]">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Account", "Who is signed in with Circle, and sign out. The browser never sees a token."],
              ["Theme", "Light, dark or the system’s choice — also always available beside it, signed in or not."],
              ["Chat", "In Yazhi Chat it adds the room’s landscape and where replies come from: yazhi-api or this device."],
              ["Places", "The way between Yazhi Chat and this library."],
            ].map(([t, d]) => (
              <div key={t} className="border-t pt-3 hair-lo">
                <dt className="font-semibold text-[color:var(--env-text)]">{t}</dt>
                <dd className="mt-1">{d}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border p-4 hair-lo">
            <span className="text-[color:var(--env-text)]">Theme</span>
            <ModeSwitch className="w-full max-w-sm" />
          </div>
          <Pre label="use it">{`<Composer
  leading={<MissionControl active={signedIn} who={name} onPress={open} />}
  onSend={send}
/>`}</Pre>
        </div>
      </div>
    </Section>
  );
}

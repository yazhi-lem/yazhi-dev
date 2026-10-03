import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  Avatar,
  Bubble,
  BubbleCard,
  BubbleView,
  Button,
  DataTable,
  EmptyState,
  Field,
  FindingList,
  KeyValue,
  MUGIL,
  MUGIL_PALETTE,
  Meter,
  Notice,
  PageHeader,
  Pill,
  Progress,
  StageTrack,
  Stat,
  Switch,
  Tabs,
  T,
  contrast,
  grade,
  mix,
  type Block,
  type BiText,
  type Tone,
  type YazhMood,
} from "@/bubble";

export const metadata: Metadata = {
  title: "முகில் • Yazhi Bubble Interface",
  description: "The Yazhi Bubble Interface component library in Mugil — Yazh's dreamy pastel clouds.",
};

const TONES: Tone[] = ["kurinji", "mullai", "marutham", "neytal", "palai", "gold"];
const MOODS: YazhMood[] = ["waving", "thinking", "surprised", "sleepy"];

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: BiText; intro: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl text-ivory sm:text-4xl">
          <T text={title} separator=" · " />
        </h2>
        <p className="mt-2 max-w-2xl text-ivory-dim">{intro}</p>
      </div>
      {children}
    </section>
  );
}

function Demo({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <Bubble size="lg" className={className}>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ivory-dim">{label}</p>
      {children}
    </Bubble>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="ybi-field max-h-96 overflow-auto rounded-2xl p-4 font-mono text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

/* ── palette: every ratio below is computed at render from palette.ts ── */
function Swatch({ c }: { c: (typeof MUGIL_PALETTE)[number] }) {
  const glow = mix(c.tone, MUGIL.bubble, MUGIL.glow);
  const text = mix(c.tone, MUGIL.ink, MUGIL.toneMix);
  const rows = [
    { what: "mark on glow", ratio: contrast(c.tone, glow), need: 3 },
    { what: "tone text on glow", ratio: contrast(text, glow), need: 4.5 },
    { what: "solid button label", ratio: contrast(MUGIL.ground, text), need: 4.5 },
  ];
  return (
    <Bubble tone={c.key} size="md" className="flex flex-col gap-4">
      <div className="relative h-28 overflow-hidden rounded-2xl" style={{ background: c.pastel }}>
        <span className="absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-70" style={{ background: c.sampled }} />
        <span className="absolute bottom-3 left-3 h-10 w-10 rounded-full shadow-md" style={{ background: c.tone }} />
        <span className="absolute bottom-4 left-16 font-display text-xl" style={{ color: text }}>
          {c.name.ta}
        </span>
      </div>
      <div>
        <p className="font-display text-xl text-ivory">{c.name.en}</p>
        <p className="text-sm text-ivory-dim">{c.source} · <span className="font-mono">--{c.key}</span></p>
      </div>
      <dl className="grid grid-cols-3 gap-2 font-mono text-xs">
        {[
          ["sampled", c.sampled],
          ["pastel", c.pastel],
          ["tone", c.tone],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-ivory-dim">{k}</dt>
            <dd className="text-ivory">{v}</dd>
          </div>
        ))}
      </dl>
      <ul aria-label="Contrast in Mugil" className="space-y-1 border-t border-ivory/10 pt-3 text-xs">
        <li className="font-mono text-[10px] uppercase tracking-[0.14em] text-ivory-dim">contrast · Mugil</li>
        {rows.map((r) => (
          <li key={r.what} className="flex items-center justify-between gap-2">
            <span className="text-ivory-dim">{r.what}</span>
            <span className="font-mono text-ivory">
              {r.ratio.toFixed(2)}:1{" "}
              <Pill label={r.ratio >= r.need ? grade(r.ratio) : "fail"} tone={r.ratio >= r.need ? "ok" : "error"} />
            </span>
          </li>
        ))}
      </ul>
    </Bubble>
  );
}

const SPEC: Block[] = [
  {
    kind: "stats",
    items: [
      { label: { ta: "மேகங்கள்", en: "Clouds" }, value: "5", tone: "kurinji" },
      { label: { ta: "நிறங்கள்", en: "Tones" }, value: "6", tone: "palai" },
    ],
  },
  {
    kind: "stages",
    label: "Dream to ship",
    stages: [
      { id: "dream", label: "dream", state: "done" },
      { id: "draw", label: "draw", state: "done" },
      { id: "build", label: "build", state: "active" },
      { id: "ship", label: "ship", state: "pending" },
    ],
  },
];

export default function YbiLibraryPage() {
  return (
    <div className="space-y-20">
      {/* ── hero ── */}
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Yazhi Bubble Interface · Library"
            title={{ ta: "முகில்", en: "Mugil" }}
            tone="kurinji"
            description={{
              ta: "யாழின் மென்னிற மேகங்கள் — ஒவ்வொரு கூறும் ஒரு குமிழி.",
              en: "Yazh's dreamy pastel clouds. Every component is a bubble; every colour is sampled from Yazh.",
            }}
            pills={[
              { label: "Server-first", tone: "mullai" },
              { label: "WCAG AA, computed", tone: "neytal" },
              { label: "Tamil · English", tone: "palai" },
            ]}
          />
          <div className="flex flex-wrap gap-3">
            <Button href="#palette" tone="kurinji">Explore the palette</Button>
            <Button href="#controls" tone="palai" variant="soft">See the controls</Button>
            <Button href="/foundry" tone="mullai" variant="ghost">Foundry, in Ink →</Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-6 rounded-full bg-[color:var(--mugil-lilac)] blur-3xl" aria-hidden />
          <Image
            src="/yazh/cutout/yazhi.webp"
            alt="Yazh, the Yazhi guardian, waving"
            width={900}
            height={832}
            priority
            className="floaty relative w-full drop-shadow-[0_30px_40px_rgba(126,111,198,0.25)]"
            style={{ animationDuration: "7s" }}
          />
        </div>
      </section>

      {/* ── palette ── */}
      <Section
        id="palette"
        eyebrow="01 · Palette"
        title={{ ta: "நிறங்கள்", en: "Colours from Yazh" }}
        intro="Each colour was sampled from the Yazhi art, then split into a pastel for clouds and surfaces and a deeper tone for marks and text. The contrast ratios on each card are computed as the page renders."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MUGIL_PALETTE.map((c) => (
            <Swatch key={c.key} c={c} />
          ))}
        </div>
        <Demo label="Text on the bubble body">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <p className="text-ivory">
              Plum ink <span className="font-mono text-xs">{MUGIL.ink}</span> · {contrast(MUGIL.ink, MUGIL.bubble).toFixed(2)}:1 ({grade(contrast(MUGIL.ink, MUGIL.bubble))})
            </p>
            <p className="text-ivory-dim">
              Dusk <span className="font-mono text-xs">{MUGIL.dusk}</span> · {contrast(MUGIL.dusk, MUGIL.bubble).toFixed(2)}:1 ({grade(contrast(MUGIL.dusk, MUGIL.bubble))})
            </p>
          </div>
        </Demo>
      </Section>

      {/* ── primitives ── */}
      <Section
        id="primitives"
        eyebrow="02 · Primitives"
        title={{ ta: "அடிப்படைகள்", en: "Primitives" }}
        intro="Bubble, Pill, Meter, Stat and Avatar. Each one takes a tone instead of a colour, and none of them ships client JavaScript."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Demo label="Bubble · card / pill / orb">
            <div className="flex flex-wrap items-center gap-3">
              <Bubble tone="kurinji" size="sm" className="w-36 text-sm text-ivory">card</Bubble>
              <Bubble tone="palai" shape="pill" className="text-sm text-ivory">pill</Bubble>
              {TONES.slice(0, 4).map((t) => (
                <Bubble key={t} tone={t} shape="orb" size="sm" className="w-16 font-mono text-[10px] text-ivory-dim">
                  {t.slice(0, 4)}
                </Bubble>
              ))}
            </div>
          </Demo>
          <Demo label="Pill · every tone, live pulse">
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <Pill key={t} label={t} tone={t} />
              ))}
              <Pill label="live" tone="ok" pulse />
              <Pill label="warn" tone="warn" />
              <Pill label="error" tone="error" />
            </div>
          </Demo>
          <Demo label="Meter · null, 18, 54, 77, 100">
            <div className="flex flex-wrap items-center gap-4">
              <Meter value={null} label="No data" caption="—" />
              <Meter value={18} label="Score 18" />
              <Meter value={54} label="Score 54" />
              <Meter value={77} label="Score 77" />
              <Meter value={100} label="Score 100" />
            </div>
          </Demo>
          <Demo label="Avatar · Yazh's moods">
            <div className="flex flex-wrap items-center gap-4">
              {MOODS.map((m, i) => (
                <div key={m} className="flex flex-col items-center gap-1">
                  <Avatar mood={m} size={64} tone={TONES[i]} label={`Yazh ${m}`} />
                  <span className="font-mono text-[11px] text-ivory-dim">{m}</span>
                </div>
              ))}
            </div>
          </Demo>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label={{ ta: "அடிப்படைகள்", en: "Primitives" }} value="10" hint="+ 9 patterns, 3 shell parts" tone="kurinji" />
          <Stat label={{ ta: "கிளையன்ட் JS", en: "Client islands" }} value="4" hint="YBI-owned: nav, switch, tabs, theme" tone="mullai" />
          <Stat label={{ ta: "குறைந்த மாறுபாடு", en: "Worst text contrast" }} value="5.15" hint="marutham, Mugil" tone="marutham" />
          <Stat label={{ ta: "மொழிகள்", en: "Scripts" }} value="2" hint="தமிழ் · English" tone="palai" />
        </div>
      </Section>

      {/* ── controls ── */}
      <Section
        id="controls"
        eyebrow="03 · Controls"
        title={{ ta: "கட்டுப்பாடுகள்", en: "Controls" }}
        intro="Buttons, fields, switches, progress bars and tabs. Solid fills reuse the tone-to-text mix with the page ground as the label colour, so they meet AA in both themes."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Demo label="Button · solid / soft / ghost">
            <div className="space-y-3">
              {(["solid", "soft", "ghost"] as const).map((v) => (
                <div key={v} className="flex flex-wrap gap-2">
                  {(["kurinji", "palai", "mullai", "neytal"] as Tone[]).map((t) => (
                    <Button key={t} tone={t} variant={v} size="sm">
                      {v} {t}
                    </Button>
                  ))}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button tone="marutham" size="lg">Large</Button>
                <Button tone="marutham">Medium</Button>
                <Button tone="marutham" size="sm">Small</Button>
                <Button tone="marutham" disabled>Disabled</Button>
              </div>
            </div>
          </Demo>
          <Demo label="Field · labelled, with hints">
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" action="#">
              <Field label={{ ta: "யாழ் பெயர்", en: "Yazh name" }} name="yazhName" placeholder="Mugil" tone="kurinji" />
              <Field
                label={{ ta: "மின்னஞ்சல்", en: "Email" }}
                name="email"
                type="email"
                placeholder="you@yazhi.dev"
                hint="We only use it for your Circle key."
                tone="neytal"
              />
              <Field label="Disabled" name="locked" defaultValue="read-only" disabled tone="mullai" className="sm:col-span-2" />
            </form>
          </Demo>
          <Demo label="Switch · role=switch, state as text">
            <div className="flex flex-col gap-3">
              <Switch label="Cloud drift" defaultChecked tone="kurinji" />
              <Switch label="Tamil first" defaultChecked tone="palai" />
              <Switch label="Quiet hours" tone="neytal" />
            </div>
          </Demo>
          <Demo label="Progress">
            <div className="space-y-4">
              <Progress label="Legal validated" value={4} max={153} tone="palai" />
              <Progress label="Education validated" value={21} max={21} tone="mullai" />
              <Progress label="Dreaming" value={62} tone="kurinji" />
            </div>
          </Demo>
        </div>
        <Demo label="Tabs · ←/→/Home/End">
          <Tabs
            label="Yazh's day"
            tone="kurinji"
            items={[
              {
                id: "morning",
                label: "Morning",
                content: <p className="text-ivory">Yazh wakes in a lilac sky and counts the clouds.</p>,
              },
              {
                id: "noon",
                label: "Noon",
                content: <Progress label="Curiosity" value={88} tone="marutham" />,
              },
              {
                id: "night",
                label: "Night",
                content: (
                  <div className="flex items-center gap-3">
                    <Avatar mood="sleepy" size={56} tone="neytal" label="Yazh asleep" />
                    <p className="text-ivory-dim">Quiet hours, 21:00–06:30.</p>
                  </div>
                ),
              },
            ]}
          />
        </Demo>
      </Section>

      {/* ── patterns ── */}
      <Section
        id="patterns"
        eyebrow="04 · Patterns"
        title={{ ta: "வடிவங்கள்", en: "Patterns" }}
        intro="Patterns are built from the primitives above. These are the same ones that run the Foundry pages, shown here in Mugil."
      >
        <Demo label="PageHeader">
          <PageHeader
            crumbs={[{ label: "Library", href: "/ybi" }, { label: "Patterns" }]}
            eyebrow="sample · header"
            title={{ ta: "மேகக் கோட்டை", en: "Cloud fort" }}
            description="A bilingual title, an eyebrow, breadcrumbs and pills."
            tone="neytal"
            pills={[{ label: "Live", tone: "ok", pulse: true }, { label: "v0.1", tone: "neutral" }]}
          />
        </Demo>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <BubbleCard
            title={{ ta: "கல்வி", en: "Education" }}
            subtitle="education · yazh"
            body="Samacheer Kalvi textbooks, Tamil medium first."
            tone="mullai"
            href="/foundry/education"
            meter={{ value: 100, label: "Education score" }}
            pills={[{ label: "Corpus", tone: "ok" }]}
            meta={[{ label: "Records", value: "21" }, { label: "Pipelines", value: "2" }, { label: "Coverage", value: "100%" }]}
          />
          <BubbleCard
            title={{ ta: "சட்டம்", en: "Legal" }}
            subtitle="legal · yazh"
            body="Central acts from India Code."
            tone="palai"
            href="/foundry/legal"
            meter={{ value: 54, label: "Legal score" }}
            pills={[{ label: "Corpus", tone: "ok" }, { label: "Retriever", tone: "info" }]}
            meta={[{ label: "Records", value: "5,609" }, { label: "Pipelines", value: "1" }, { label: "Coverage", value: "2.6%" }]}
          />
          <BubbleCard
            title={{ ta: "தற்சார்பு", en: "Sovereign" }}
            subtitle="sovereign · yazh"
            body="Constitutional ground truth."
            tone="kurinji"
            meter={{ value: null, label: "No corpus", caption: "—" }}
            pills={[{ label: "No corpus", tone: "neutral" }]}
            meta={[{ label: "Records", value: "0" }, { label: "Pipelines", value: "1" }, { label: "Coverage", value: "—" }]}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Demo label="StageTrack · all five states">
            <StageTrack
              stages={[
                { id: "a", label: "fetch", state: "done" },
                { id: "b", label: "parse", state: "active" },
                { id: "c", label: "validate", state: "attention", note: "4 / 153" },
                { id: "d", label: "embed", state: "pending" },
                { id: "e", label: "store", state: "skipped" },
              ]}
            />
          </Demo>
          <Demo label="Notice">
            <div className="space-y-3">
              <Notice tone="ok" badge="Live" title="Live from yazhi-api." body="YazhiInsight, just now." />
              <Notice tone="warn" badge="Sample" title="Sample data." body="Set YAZHI_RPC_URL for live data." />
            </div>
          </Demo>
          <Demo label="FindingList">
            <FindingList
              items={[
                { code: "PROVENANCE_STUB", severity: "error", title: "Placeholder provenance URL", count: 5595 },
                { code: "VALIDATION_MISSING", severity: "warning", title: "Never validated", count: 149 },
                { code: "ACQUISITION_GAP", severity: "info", title: "Discovered but not collected", count: 12 },
              ]}
            />
          </Demo>
          <Demo label="KeyValue + DataTable">
            <div className="space-y-5">
              <KeyValue
                items={[
                  { label: "Run one pass", value: "yz factory -d legal --once", mono: true },
                  { label: "Theme", value: "data-ybi-theme=\"mugil\"", mono: true },
                ]}
              />
              <DataTable
                caption="Tones"
                columns={["Tone", "Yazh", "Hex"]}
                rows={MUGIL_PALETTE.slice(0, 3).map((c) => [c.key, c.name.en, c.tone])}
              />
            </div>
          </Demo>
        </div>
        <EmptyState
          title={{ ta: "இன்னும் கனவு காண்கிறது", en: "Still dreaming" }}
          body="Empty states are said honestly, and Yazh keeps them company."
          art="sleepy"
        />
      </Section>

      {/* ── blocks ── */}
      <Section
        id="blocks"
        eyebrow="05 · Blocks"
        title={{ ta: "தொகுதிகள்", en: "Pages as JSON" }}
        intro="A page is a list of plain JSON blocks. A developer, a scaffolder or an agent can write the list on the left, and <BubbleView> renders it as the page on the right."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Code>{JSON.stringify(SPEC, null, 2)}</Code>
          <Bubble size="lg">
            <BubbleView blocks={SPEC} />
          </Bubble>
        </div>
      </Section>
    </div>
  );
}

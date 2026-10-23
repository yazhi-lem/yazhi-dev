"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Bubble } from "../components/Bubble";
import { CitationMark, SourceCard } from "../components/Citation";
import { Composer } from "../components/Composer";
import { ConfirmGate } from "../components/ConfirmGate";
import { Disclaimer, IDontKnow } from "../components/Guardrails";
import { MessageBubble } from "../components/Message";
import { EmptyState, Panel } from "../components/Panel";
import { DraftTag, Pill, RuntimeBadge } from "../components/Pill";
import { KuralQuote, Stepper } from "../components/Verse";
import { CitedAnswer, LegalAnswerCard, SourcesPanel } from "../modules/Answer";
import { BubbleTray } from "../modules/BubbleTray";
import { ChatThread } from "../modules/ChatThread";
import { PaymentIntentCard, ProductCard, type CartLine } from "../modules/Commerce";
import { HintLadder } from "../modules/HintLadder";
import { RunbookPanel, TicketCard } from "../modules/Support";
import { ConsentGate, FivePostureTrace } from "../modules/Trust";
import { VerseReader } from "../modules/VerseReader";
import { PAGE_COMPONENTS } from "../pages/AppPages";
import type { TemplateSlug } from "../pages/catalog";
import { KURALS, SAMPLE_LEGAL_SOURCES, SAMPLE_PROBLEM, SAMPLE_PRODUCTS, SAMPLE_RUNBOOK, SAMPLE_TICKETS, kuralSource } from "../samples";
import { CircleButton } from "@/components/circle/CircleButton";

const k423 = KURALS[1];
const src423 = kuralSource(k423);

const TRAY = [
  { id: "avai", label: "Avai", glyph: "அ", accent: "#8b7ae0", size: "l" as const },
  { id: "nyaya", label: "Nyaya", glyph: "நி", accent: "#b7a03c", size: "m" as const },
  { id: "kural", label: "Kural", glyph: "கு", accent: "#c25b3c", size: "m" as const },
  { id: "guru", label: "Guru", glyph: "கு", accent: "#4f9d6b", size: "s" as const },
  { id: "kadai", label: "Kadai", glyph: "க", accent: "#d3b36a", size: "s" as const },
  { id: "sangam", label: "Open Sangam", glyph: "ச", accent: "#4a8ab5", size: "m" as const },
];

function TrayDemo() {
  const [active, setActive] = useState("avai");
  return <BubbleTray items={TRAY} activeId={active} onSelect={setActive} />;
}

function ComposerDemo() {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <Composer leading={<CircleButton size={36} />} onSend={(t) => setSent((s) => [...s, t])} placeholder="Message Avai…" />
      {sent.length > 0 && <p className="text-xs text-ivory-dim">Sent: {sent.join(" · ")}</p>}
    </div>
  );
}

function CommerceDemo() {
  const [lines, setLines] = useState<CartLine[]>([]);
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_14rem] [&>*]:min-w-0">
      <div className="space-y-2">
        {SAMPLE_PRODUCTS.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={(x) =>
              setLines((ls) =>
                ls.some((l) => l.product.id === x.id) ? ls.map((l) => (l.product.id === x.id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { product: x, qty: 1 }]
              )
            }
          />
        ))}
      </div>
      <PaymentIntentCard lines={lines} onRemove={(id) => setLines((ls) => ls.filter((l) => l.product.id !== id))} />
    </div>
  );
}

function TicketsDemo() {
  const [sel, setSel] = useState(SAMPLE_TICKETS[0].id);
  return (
    <div className="grid gap-3 md:grid-cols-[14rem_1fr] [&>*]:min-w-0">
      <div className="space-y-2">
        {SAMPLE_TICKETS.slice(0, 2).map((t) => (
          <TicketCard key={t.id} ticket={t} selected={t.id === sel} onSelect={() => setSel(t.id)} />
        ))}
      </div>
      <RunbookPanel title="Printer unreachable" steps={SAMPLE_RUNBOOK.slice(1, 3)} />
    </div>
  );
}

const DEMOS: Record<string, () => ReactNode> = {
  bubble: () => (
    <div className="flex items-end gap-4">
      <Bubble accent="#8b7ae0" label="Avai" glyph="அ" size={56} />
      <Bubble accent="#b7a03c" label="Nyaya" glyph="நி" size={42} active />
      <Bubble accent="#4a8ab5" label="Open Sangam" glyph="ச" size={32} onSelect={() => {}} />
    </div>
  ),
  pill: () => (
    <div className="flex flex-wrap gap-2">
      <Pill tone="ok">published</Pill>
      <Pill tone="warn">in review</Pill>
      <Pill tone="risk">blocked</Pill>
      <Pill tone="info">beta</Pill>
      <RuntimeBadge runtime="device" />
      <RuntimeBadge runtime="yazhi-api" />
      <RuntimeBadge runtime="offline" />
      <DraftTag />
    </div>
  ),
  panel: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel eyebrow="Queue" title="Open tickets" accentEdge actions={<Pill>3</Pill>}>
        <p className="text-sm text-ivory-dim">Panel body.</p>
      </Panel>
      <EmptyState title="No bubbles yet" hint="Bubbles you install appear here." />
    </div>
  ),
  citation: () => (
    <div className="space-y-3">
      <p className="text-sm text-ivory">
        Wisdom is finding the truth in what you hear, whoever says it.
        <CitationMark n={1} source={src423} />
      </p>
      <SourceCard n={1} source={src423} />
    </div>
  ),
  idontknow: () => (
    <IDontKnow
      reason="Scholars propose different dates, and no stored source settles a single year."
      next="I can show what each dating argument rests on."
    />
  ),
  disclaimer: () => (
    <div className="grid gap-2 sm:grid-cols-3">
      <Disclaimer kind="legal" />
      <Disclaimer kind="sample" />
      <Disclaimer kind="children" />
    </div>
  ),
  "confirm-gate": () => (
    <ConfirmGate
      action="Re-assign the printer a fixed address on the office router"
      impact="Router configuration for the front office"
      rollback="Restore the router config saved before the change"
      confirmWord="ROUTER"
    />
  ),
  message: () => (
    <div className="space-y-3">
      <MessageBubble role="user">What does couplet 423 say?</MessageBubble>
      <MessageBubble role="assistant" runtime="yazhi-api" footer={<CitationMark n={1} source={src423} />}>
        Wisdom is finding the truth in what you hear, whoever says it.
      </MessageBubble>
      <MessageBubble role="assistant" pending />
    </div>
  ),
  composer: () => <ComposerDemo />,
  "kural-quote": () => <KuralQuote number={k423.number} lines={k423.lines} gloss={k423.gloss} />,
  stepper: () => <Stepper steps={["Read", "Try", "Hints", "Check"]} current={2} />,

  "bubble-tray": () => <TrayDemo />,
  "chat-thread": () => (
    <ChatThread
      turns={[
        { id: "1", role: "user", content: "அரிசி ஒரு மூட்டை வேணும்" },
        { id: "2", role: "assistant", runtime: "yazhi-api", content: "Here's what the shop has — add what you need." },
        { id: "3", role: "assistant", pending: true, content: null },
      ]}
    />
  ),
  "cited-answer": () => (
    <div className="grid gap-3 md:grid-cols-[1fr_16rem] [&>*]:min-w-0">
      <div className="space-y-3">
        <CitedAnswer sources={[src423]} parts={[{ text: "Couplet 423 says wisdom is finding the truth in what you hear.", cite: 0 }]} />
        <CitedAnswer sources={[]} parts={[]} />
      </div>
      <SourcesPanel sources={[src423]} />
    </div>
  ),
  "legal-answer": () => (
    <LegalAnswerCard
      question="[Sample question]"
      validity={0.97}
      sources={SAMPLE_LEGAL_SOURCES.slice(0, 1)}
      parts={[{ text: "[Plain-language explanation of the provision.]", cite: 0 }]}
    />
  ),
  "hint-ladder": () => <HintLadder prompt={SAMPLE_PROBLEM.prompt} hints={SAMPLE_PROBLEM.hints} handBack={SAMPLE_PROBLEM.handBack} />,
  runbook: () => <TicketsDemo />,
  "verse-reader": () => <VerseReader title="Thirukkural — sample" verses={KURALS} />,
  commerce: () => <CommerceDemo />,
  "five-posture": () => (
    <FivePostureTrace
      results={[
        { posture: "context", pass: true, note: "Tamil question; reply Tamil-first." },
        { posture: "reason", pass: false, note: "Claimed a date with no stored source." },
        { posture: "plan", pass: true, note: "No step needs a human." },
        { posture: "respond", pass: true, note: "Register matched." },
        { posture: "reflect", pass: false, note: "Should have declined — becomes a training pair." },
      ]}
    />
  ),
  "consent-gate": () => (
    <ConsentGate verified={false}>
      <p>Hidden until consent is verified.</p>
    </ConsentGate>
  ),
};

/** Live preview of one catalog entry, with an app accent for context. */
export function Demo({ slug, accent = "var(--kurinji)" }: { slug: string; accent?: string }) {
  const render = DEMOS[slug];
  return (
    <div className="rounded-xl border border-ivory/10 bg-night p-4" style={{ "--accent": accent } as CSSProperties}>
      {render ? render() : <p className="text-xs text-ivory-dim">No demo.</p>}
    </div>
  );
}

/** A full app page template, rendered live. */
export function TemplatePreview({ slug }: { slug: TemplateSlug }) {
  const Page = PAGE_COMPONENTS[slug];
  return <Page account={<CircleButton size={32} />} />;
}

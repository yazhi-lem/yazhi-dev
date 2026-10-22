/** What the library docs list: every component and module, the apps that
    use it, the Aram rule it enforces (if any) and a usage snippet. Plain
    data — the live demos are in Demos.tsx, keyed by the same slug. */

export type App = "Bubble UI" | "Avai" | "Nyaya" | "Kural" | "Guru" | "Kadai" | "Open Sangam" | "Yazh" | "All apps";

export interface CatalogEntry {
  slug: string;
  name: string;
  kind: "component" | "module";
  summary: string;
  apps: App[];
  /** the Aram rule this piece enforces in the UI */
  rule?: string;
  usage: string;
}

export const COMPONENTS: CatalogEntry[] = [
  {
    slug: "bubble",
    name: "Bubble",
    kind: "component",
    summary: "An app, agent or tool as a lit sphere with its first glyph. Button when given onSelect.",
    apps: ["All apps"],
    usage: `<Bubble accent="var(--kurinji)" label="Avai" glyph="அ" size={44} onSelect={open} />`,
  },
  {
    slug: "pill",
    name: "Pill · RuntimeBadge · DraftTag",
    kind: "component",
    summary: "Status labels. RuntimeBadge says where an answer ran; DraftTag marks unreviewed Tamil.",
    apps: ["All apps"],
    rule: "Ship what we said — drafts are marked as drafts",
    usage: `<Pill tone="ok">published</Pill>
<RuntimeBadge runtime="device" />
<DraftTag />`,
  },
  {
    slug: "panel",
    name: "Panel · EmptyState",
    kind: "component",
    summary: "The raised surface every module sits on, and the empty view for lists.",
    apps: ["All apps"],
    usage: `<Panel eyebrow="Queue" title="Open tickets" accentEdge actions={<Pill>3</Pill>}>
  …
</Panel>`,
  },
  {
    slug: "citation",
    name: "CitationMark · SourceCard",
    kind: "component",
    summary: "Numbered inline citation and the card it points to, with a verified / unverified state.",
    apps: ["Avai", "Nyaya", "Guru"],
    rule: "No claim without a source",
    usage: `Wisdom is finding the truth in what you hear<CitationMark n={1} source={src} />
<SourceCard n={1} source={src} />`,
  },
  {
    slug: "idontknow",
    name: "IDontKnow",
    kind: "component",
    summary: "The honest decline — தெரியவில்லை — with why, and what would help.",
    apps: ["Avai", "Nyaya", "Kural", "Guru"],
    rule: "No claim without a source",
    usage: `<IDontKnow reason="No stored source settles this." next="Name the verse you mean." />`,
  },
  {
    slug: "disclaimer",
    name: "Disclaimer",
    kind: "component",
    summary: "Standard notices worded once: legal information, sample data, children.",
    apps: ["Nyaya", "Yazh", "All apps"],
    usage: `<Disclaimer kind="legal" />`,
  },
  {
    slug: "confirm-gate",
    name: "ConfirmGate",
    kind: "component",
    summary: "A person confirms any system-changing action; impact and rollback are stated first.",
    apps: ["Kural"],
    rule: "Think, then act — runbook and human confirm",
    usage: `<ConfirmGate
  action="Restart the print spooler"
  impact="Queued jobs are cancelled"
  rollback="Start the service again"
  confirmWord="RESTART"
  onConfirm={run}
/>`,
  },
  {
    slug: "message",
    name: "MessageBubble · TypingDots",
    kind: "component",
    summary: "One conversation turn with its runtime badge and footer.",
    apps: ["Bubble UI", "Avai", "Kadai"],
    usage: `<MessageBubble role="assistant" runtime="yazhi-api">…</MessageBubble>`,
  },
  {
    slug: "composer",
    name: "Composer",
    kind: "component",
    summary: "The message bar from the sketch: Circle slot, input, ▷ send / ■ stop.",
    apps: ["Bubble UI", "Avai", "Nyaya"],
    usage: `<Composer leading={<CircleButton />} onSend={send} onStop={stop} streaming={busy} />`,
  },
  {
    slug: "kural-quote",
    name: "KuralQuote",
    kind: "component",
    summary: "A couplet with its number and an English gloss marked as a draft until reviewed.",
    apps: ["Avai", "Open Sangam"],
    usage: `<KuralQuote number={423} lines={[l1, l2]} gloss="…" />`,
  },
  {
    slug: "stepper",
    name: "Stepper",
    kind: "component",
    summary: "Numbered steps with the current position — lessons, onboarding, wizards.",
    apps: ["Guru", "Yazh"],
    usage: `<Stepper steps={["Read", "Try", "Hints", "Check"]} current={2} />`,
  },
];

export const MODULES: CatalogEntry[] = [
  {
    slug: "bubble-tray",
    name: "BubbleTray",
    kind: "module",
    summary: "The packed column of bubbles that never touch; a scrolling row on phones.",
    apps: ["Bubble UI"],
    usage: `<BubbleTray items={apps} activeId={current} onSelect={setCurrent} />`,
  },
  {
    slug: "chat-thread",
    name: "ChatThread",
    kind: "module",
    summary: "A scrolling conversation whose turns can hold any node — answers, cards, gates.",
    apps: ["Bubble UI", "Avai", "Kadai"],
    usage: `<ChatThread turns={[{ id, role: "user", content: "…" }, …]} />`,
  },
  {
    slug: "cited-answer",
    name: "CitedAnswer · SourcesPanel",
    kind: "module",
    summary: "An answer where every sentence carries a citation — or IDontKnow when nothing supports it.",
    apps: ["Avai", "Nyaya", "Guru"],
    rule: "No claim without a source",
    usage: `<CitedAnswer parts={[{ text: "…", cite: 0 }]} sources={sources} />
<SourcesPanel sources={sources} />`,
  },
  {
    slug: "legal-answer",
    name: "LegalAnswerCard",
    kind: "module",
    summary: "Nyaya's answer: question, cited explanation, the provisions, match score and the legal notice.",
    apps: ["Nyaya"],
    rule: "Information, never advice; citation validity ≥95%",
    usage: `<LegalAnswerCard question="…" parts={parts} sources={sections} validity={0.97} />`,
  },
  {
    slug: "hint-ladder",
    name: "HintLadder",
    kind: "module",
    summary: "Hints one rung at a time; the last rung hands the work back. Never the answer.",
    apps: ["Guru"],
    rule: "Hint ladder — never hand over homework",
    usage: `<HintLadder prompt="Solve 3x + 5 = 20" hints={hints} handBack="Do the last step yourself." />`,
  },
  {
    slug: "runbook",
    name: "RunbookPanel · TicketCard",
    kind: "module",
    summary: "Help-desk tickets and runbooks; system-changing steps sit behind ConfirmGates.",
    apps: ["Kural"],
    rule: "Think, then act — runbook and human confirm",
    usage: `<TicketCard ticket={t} selected onSelect={pick} />
<RunbookPanel title="Printer offline" steps={steps} />`,
  },
  {
    slug: "verse-reader",
    name: "VerseReader",
    kind: "module",
    summary: "Line-numbered classical text with glosses and the scholar review state.",
    apps: ["Open Sangam", "Avai"],
    rule: "Scholar-verified text only",
    usage: `<VerseReader title="Maduraikanchi" verses={lines} reviewed={false} />`,
  },
  {
    slug: "commerce",
    name: "ProductCard · PaymentIntentCard",
    kind: "module",
    summary: "Bilingual products and an order that records a payment intent — no money moves.",
    apps: ["Kadai"],
    rule: "Payment intent only in v1",
    usage: `<ProductCard product={p} onAdd={add} />
<PaymentIntentCard lines={cart} onRemove={remove} />`,
  },
  {
    slug: "five-posture",
    name: "FivePostureTrace",
    kind: "module",
    summary: "One turn graded against the Five-Posture kernel; failures become training pairs.",
    apps: ["All apps"],
    usage: `<FivePostureTrace results={[{ posture: "reason", pass: true, note: "…" }, …]} />`,
  },
  {
    slug: "consent-gate",
    name: "ConsentGate",
    kind: "module",
    summary: "The parent-facing gate in front of Yazh. Reflects a server-side consent check.",
    apps: ["Yazh"],
    rule: "Children first — verified parental consent",
    usage: `<ConsentGate verified={consent.verified}>…</ConsentGate>`,
  },
];

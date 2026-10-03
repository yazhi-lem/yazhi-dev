"use client";
import { useState, type ReactNode } from "react";
import { Composer } from "../components/Composer";
import { IDontKnow } from "../components/Guardrails";
import { Panel } from "../components/Panel";
import { Pill } from "../components/Pill";
import { KuralQuote, Stepper } from "../components/Verse";
import { CitedAnswer, LegalAnswerCard, SourcesPanel } from "../modules/Answer";
import { ChatThread, type ThreadTurn } from "../modules/ChatThread";
import { PaymentIntentCard, ProductCard, type CartLine } from "../modules/Commerce";
import { HintLadder } from "../modules/HintLadder";
import { RunbookPanel, TicketCard } from "../modules/Support";
import { ConsentGate, FivePostureTrace } from "../modules/Trust";
import { VerseReader } from "../modules/VerseReader";
import {
  KURALS,
  SAMPLE_LEGAL_SOURCES,
  SAMPLE_PROBLEM,
  SAMPLE_PRODUCTS,
  SAMPLE_RUNBOOK,
  SAMPLE_TICKETS,
  kuralSource,
} from "../samples";
import { AppFrame } from "./AppFrame";
import { AVAI, GURU, KADAI, KURAL_DESK, NYAYA, OPEN_SANGAM, YAZH_PARENT, type TemplateSlug } from "./catalog";

/** Page templates for the Yazhi apps. Each is a complete screen composed
    only from library components and modules, filled with sample data.
    `account` is the header slot for the Circle button. */

type PageProps = { account?: ReactNode };

let n = 0;
const id = () => `t${(n += 1)}`;

const TEMPLATE_REPLY = "Template preview — connect this page to a bubble runtime to answer.";

/** Composer that appends to a sample thread with a placeholder reply. */
function useSampleThread(initial: ThreadTurn[]) {
  const [turns, setTurns] = useState(initial);
  const send = (text: string) =>
    setTurns((t) => [
      ...t,
      { id: id(), role: "user", content: text },
      { id: id(), role: "assistant", content: <span className="text-ivory-dim">{TEMPLATE_REPLY}</span> },
    ]);
  return { turns, send };
}

/* ------------------------------------------------------------------ Avai */

export function AvaiPage({ account }: PageProps) {
  const k = KURALS[1];
  const sources = [kuralSource(k)];
  const { turns, send } = useSampleThread([
    { id: "a1", role: "user", content: "What does the Kural say about listening to others?" },
    {
      id: "a2",
      role: "assistant",
      runtime: "yazhi-api",
      content: (
        <div className="space-y-3">
          <CitedAnswer
            sources={sources}
            parts={[{ text: "Couplet 423 says wisdom is finding the truth in what you hear, whoever says it.", cite: 0 }]}
          />
          <KuralQuote number={k.number} lines={k.lines} gloss={k.gloss} />
        </div>
      ),
    },
    { id: "a3", role: "user", content: "In which year was the Thirukkural written?" },
    {
      id: "a4",
      role: "assistant",
      runtime: "yazhi-api",
      content: (
        <IDontKnow
          reason="Scholars propose different dates, and no stored source settles a single year."
          next="I can show what each dating argument rests on, with its sources."
        />
      ),
    },
  ]);
  return (
    <AppFrame
      app={AVAI}
      account={account}
      aside={
        <>
          <SourcesPanel sources={sources} />
          <FivePostureTrace
            results={[
              { posture: "context", pass: true, note: "English question about a Tamil text; answer bilingual." },
              { posture: "reason", pass: true, note: "One stored source matched: Thirukkural 423." },
              { posture: "plan", pass: true, note: "Quote, gloss, cite. No step needs a human." },
              { posture: "respond", pass: true, note: "Every sentence cited." },
              { posture: "reflect", pass: true, note: "Second question had no source — declined." },
            ]}
          />
        </>
      }
    >
      <Panel accentEdge>
        <ChatThread turns={turns} className="max-h-[36rem] pr-1" />
        <div className="mt-3 border-t border-ivory/10 pt-3">
          <Composer onSend={send} placeholder="Ask Avai about a verse, a word, a rule…" />
        </div>
      </Panel>
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Nyaya */

export function NyayaPage({ account }: PageProps) {
  return (
    <AppFrame
      app={NYAYA}
      account={account}
      aside={
        <Panel title="Need advice on your situation?" eyebrow="Get help">
          <ul className="space-y-2 text-sm text-ivory-dim">
            <li>
              <span className="text-ivory">District Legal Services Authority</span> — free legal aid for those who qualify.
            </li>
            <li>
              <span className="text-ivory">A lawyer</span> — for advice about your own case.
            </li>
          </ul>
          <p className="mt-3 text-xs text-ivory-dim">Nyaya explains the law. It does not advise and is not a lawyer.</p>
        </Panel>
      }
    >
      <LegalAnswerCard
        question="[Sample question about a tenant's rights]"
        validity={1}
        sources={SAMPLE_LEGAL_SOURCES}
        parts={[
          { text: "[Plain-language explanation of what the first provision says.]", cite: 0 },
          { text: "[What the rules add about the procedure.]", cite: 1 },
        ]}
      />
      <Composer onSend={() => {}} placeholder="Ask about a law, in Tamil or English…" />
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Kural */

export function KuralDeskPage({ account }: PageProps) {
  const [selected, setSelected] = useState(SAMPLE_TICKETS[0].id);
  const ticket = SAMPLE_TICKETS.find((t) => t.id === selected) ?? SAMPLE_TICKETS[0];
  return (
    <AppFrame
      app={KURAL_DESK}
      account={account}
      aside={
        <Panel title="Queue" eyebrow={`${SAMPLE_TICKETS.length} open`}>
          <div className="space-y-2">
            {SAMPLE_TICKETS.map((t) => (
              <TicketCard key={t.id} ticket={t} selected={t.id === selected} onSelect={() => setSelected(t.id)} />
            ))}
          </div>
        </Panel>
      }
    >
      <Panel
        title={ticket.title}
        eyebrow={ticket.id}
        actions={
          <>
            <Pill>{ticket.priority}</Pill>
            <Pill>{ticket.status}</Pill>
          </>
        }
      >
        <p className="text-sm text-ivory-dim">{ticket.summary}</p>
      </Panel>
      {ticket.id === SAMPLE_TICKETS[0].id ? (
        <RunbookPanel title="Printer unreachable on the office network" steps={SAMPLE_RUNBOOK} />
      ) : (
        <IDontKnow
          reason="No runbook in the knowledge base matches this ticket yet."
          next="Kural will hand it to a person with what it has checked so far."
        />
      )}
    </AppFrame>
  );
}

/* ------------------------------------------------------------------ Guru */

export function GuruPage({ account }: PageProps) {
  return (
    <AppFrame
      app={GURU}
      account={account}
      aside={
        <Panel title="Where this runs" eyebrow="Institute data">
          <p className="text-sm text-ivory-dim">
            Guru runs on the institute&apos;s own machine. Student work and hint usage never leave it.
          </p>
        </Panel>
      }
    >
      <Panel title="Linear equations · lesson 3" eyebrow="Algebra">
        <Stepper steps={["Read", "Try", "Hints", "Check"]} current={2} />
      </Panel>
      <HintLadder prompt={SAMPLE_PROBLEM.prompt} hints={SAMPLE_PROBLEM.hints} handBack={SAMPLE_PROBLEM.handBack} />
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Kadai */

export function KadaiPage({ account }: PageProps) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const add = (p: CartLine["product"]) =>
    setLines((ls) => {
      const found = ls.find((l) => l.product.id === p.id);
      return found ? ls.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { product: p, qty: 1 }];
    });
  return (
    <AppFrame
      app={KADAI}
      account={account}
      aside={<PaymentIntentCard lines={lines} onRemove={(pid) => setLines((ls) => ls.filter((l) => l.product.id !== pid))} />}
    >
      <Panel title="Annachi" eyebrow={<span lang="ta">அண்ணாச்சி</span>} accentEdge>
        <ChatThread
          turns={[
            { id: "k1", role: "user", content: "அரிசி ஒரு மூட்டை வேணும்" },
            { id: "k2", role: "assistant", runtime: "yazhi-api", content: "Here's what the shop has — add what you need, and the shop will confirm." },
          ]}
        />
      </Panel>
      <div className="space-y-2">
        {SAMPLE_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={add} />
        ))}
      </div>
    </AppFrame>
  );
}

/* ---------------------------------------------------------- Open Sangam */

export function SangamReaderPage({ account }: PageProps) {
  return (
    <AppFrame
      app={OPEN_SANGAM}
      account={account}
      aside={
        <Panel title="About this corpus" eyebrow="Provenance">
          <p className="text-sm text-ivory-dim">
            Sample corpus: four Thirukkural couplets. The reader is built for Maduraikanchi lines 1–100, which publish after
            scholar sign-off on every line.
          </p>
        </Panel>
      }
    >
      <VerseReader title="Thirukkural — sample" verses={KURALS} />
    </AppFrame>
  );
}

/* ------------------------------------------------------------------- Yazh */

export function YazhParentPage({ account }: PageProps) {
  return (
    <AppFrame app={YAZH_PARENT} account={account}>
      <ConsentGate verified={false}>
        <p>Behind the gate: the parent&apos;s view of their child&apos;s Yazh.</p>
      </ConsentGate>
    </AppFrame>
  );
}

/** Template components by slug — for client-side lookup from docs pages. */
export const PAGE_COMPONENTS: Record<TemplateSlug, (props: PageProps) => ReactNode> = {
  avai: AvaiPage,
  nyaya: NyayaPage,
  kural: KuralDeskPage,
  guru: GuruPage,
  kadai: KadaiPage,
  "open-sangam": SangamReaderPage,
  "yazh-parent": YazhParentPage,
};

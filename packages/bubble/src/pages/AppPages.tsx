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
import { useBubbleT } from "../locales";
import { AppFrame } from "./AppFrame";
import { AVAI, GURU, KADAI, KURAL_DESK, NYAYA, OPEN_SANGAM, YAZH_PARENT, type TemplateSlug } from "./catalog";

/** Page templates for the Yazhi apps. Each is a complete screen composed
    only from library components and modules, filled with sample data.
    `account` is the header slot for Mission Control. */

type PageProps = { account?: ReactNode; /** shown inside another page: no main/aside landmarks */ embedded?: boolean };

let n = 0;
const id = () => `t${(n += 1)}`;

/** Composer that appends to a sample thread with a placeholder reply. The
    initial turns are built by the caller *after* its own `t()` call, so the
    catalogue is read during render, never at module load. */
function useSampleThread(initial: ThreadTurn[]) {
  const [turns, setTurns] = useState(initial);
  const send = (text: string) =>
    setTurns((t) => [
      ...t,
      { id: id(), role: "user", content: text },
      { id: id(), role: "assistant", content: <TemplateReply /> },
    ]);
  return { turns, send };
}

/** The placeholder reply a template thread answers with. */
function TemplateReply() {
  const t = useBubbleT("bubble.page");
  return <span className="text-ivory-dim">{t("templateReply")}</span>;
}

/* ------------------------------------------------------------------ Avai */

export function AvaiPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.avai");
  const k = KURALS[1];
  const sources = [kuralSource(k)];
  const { turns, send } = useSampleThread([
    { id: "a1", role: "user", content: t("anchorQuestion") },
    {
      id: "a2",
      role: "assistant",
      runtime: "yazhi-api",
      content: (
        <div className="space-y-3">
          <CitedAnswer
            sources={sources}
            parts={[{ text: t("anchorAnswer"), cite: 0 }]}
          />
          <KuralQuote number={k.number} lines={k.lines} gloss={k.gloss} />
        </div>
      ),
    },
        { id: "a3", role: "user", content: t("unknownQuestion") },
    {
      id: "a4",
      role: "assistant",
      runtime: "yazhi-api",
      content: (
        <IDontKnow
          reason={t("unknownReason")}
          next={t("unknownNext")}
        />
      ),
    },
  ]);
  return (
    <AppFrame
      app={AVAI}
      account={account} embedded={embedded}
      aside={
        <>
          <SourcesPanel sources={sources} />
          <FivePostureTrace
            results={[
              { posture: "context", pass: true, note: t("posture1") },
              { posture: "reason", pass: true, note: t("posture2") },
              { posture: "plan", pass: true, note: t("posture3") },
              { posture: "respond", pass: true, note: t("posture4") },
              { posture: "reflect", pass: true, note: t("posture5") },
            ]}
          />
        </>
      }
    >
      <Panel accentEdge>
        <ChatThread turns={turns} className="max-h-[36rem] pr-1" />
        <div className="mt-3 border-t border-ivory/10 pt-3">
          <Composer onSend={send} placeholder={t("composer")} />
        </div>
      </Panel>
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Nyaya */

export function NyayaPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.nyaya");
  return (
    <AppFrame
      app={NYAYA}
      account={account} embedded={embedded}
      aside={
        <Panel title={t("asideTitle")} eyebrow={t("asideEyebrow")}>
          <ul className="space-y-2 text-sm text-ivory-dim">
            <li>
              <span className="text-ivory">{t("dlsa")}</span> — {t("dlsaNote")}
            </li>
            <li>
              <span className="text-ivory">{t("lawyer")}</span> — {t("lawyerNote")}
            </li>
          </ul>
          <p className="mt-3 text-xs text-ivory-dim">{t("disclaimer")}</p>
        </Panel>
      }
    >
      <LegalAnswerCard
        question={t("question")}
        validity={1}
        sources={SAMPLE_LEGAL_SOURCES}
        parts={[
          { text: t("part1"), cite: 0 },
          { text: t("part2"), cite: 1 },
        ]}
      />
      <Composer onSend={() => {}} placeholder={t("composer")} />
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Kural */

export function KuralDeskPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.kural");
  const [selected, setSelected] = useState(SAMPLE_TICKETS[0].id);
  const ticket = SAMPLE_TICKETS.find((t) => t.id === selected) ?? SAMPLE_TICKETS[0];
  return (
    <AppFrame
      app={KURAL_DESK}
      account={account} embedded={embedded}
      aside={
        <Panel title={t("queue")} eyebrow={t("open", { count: SAMPLE_TICKETS.length })}>
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
      {/* the title is the ticket's own subject, i.e. sample data — see src/samples.ts */}
      {ticket.id === SAMPLE_TICKETS[0].id ? (
        <RunbookPanel title={SAMPLE_TICKETS[0].title} steps={SAMPLE_RUNBOOK} />
      ) : (
        <IDontKnow
          reason={t("noRunbook")}
          next={t("noRunbookNext")}
        />
      )}
    </AppFrame>
  );
}

/* ------------------------------------------------------------------ Guru */

export function GuruPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.guru");
  return (
    <AppFrame
      app={GURU}
      account={account} embedded={embedded}
      aside={
        <Panel title={t("asideTitle")} eyebrow={t("asideEyebrow")}>
          <p className="text-sm text-ivory-dim">{t("asideBody")}</p>
        </Panel>
      }
    >
      <Panel title={t("lessonTitle")} eyebrow={t("lessonEyebrow")}>
        <Stepper steps={[t("stepRead"), t("stepTry"), t("stepHints"), t("stepCheck")]} current={2} />
      </Panel>
      <HintLadder prompt={SAMPLE_PROBLEM.prompt} hints={SAMPLE_PROBLEM.hints} handBack={SAMPLE_PROBLEM.handBack} />
    </AppFrame>
  );
}

/* ----------------------------------------------------------------- Kadai */

export function KadaiPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble");
  const [lines, setLines] = useState<CartLine[]>([]);
  const add = (p: CartLine["product"]) =>
    setLines((ls) => {
      const found = ls.find((l) => l.product.id === p.id);
      return found ? ls.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { product: p, qty: 1 }];
    });
  return (
    <AppFrame
      app={KADAI}
      account={account} embedded={embedded}
      aside={<PaymentIntentCard lines={lines} onRemove={(pid) => setLines((ls) => ls.filter((l) => l.product.id !== pid))} />}
    >
      <Panel title="Annachi" eyebrow="Annachi" accentEdge>
        <ChatThread
          turns={[
            { id: "k1", role: "user", content: "அரிசி ஒரு மூட்டை வேணும்" },
            { id: "k2", role: "assistant", runtime: "yazhi-api", content: t("page.kadai.shopReply") },
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

export function SangamReaderPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.sangam");
  return (
    <AppFrame
      app={OPEN_SANGAM}
      account={account} embedded={embedded}
      aside={
        <Panel title={t("asideTitle")} eyebrow={t("asideEyebrow")}>
          <p className="text-sm text-ivory-dim">{t("asideBody")}</p>
        </Panel>
      }
    >
      <VerseReader title={t("readerTitle")} verses={KURALS} />
    </AppFrame>
  );
}

/* ------------------------------------------------------------------- Yazh */

export function YazhParentPage({ account, embedded }: PageProps) {
  const t = useBubbleT("bubble.page.yazh");
  return (
    <AppFrame app={YAZH_PARENT} account={account} embedded={embedded}>
      <ConsentGate verified={false}>
        <p>{t("behindGate")}</p>
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

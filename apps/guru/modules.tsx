"use client";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { Composer, ConfirmGate, MachineDraft, Panel, Pill, SampleTag, Segmented, TypingDots, UploadCard, type UploadItem } from "@yazhi/bubble";
import { Icon, Tabs, IST, uid, useShared, useStored, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import type { Bi } from "@yazhi/workspace/types";
import {
  ANSWER_LANGS,
  BANK,
  CHAPTERS,
  CITES,
  CLASS_TOPICS,
  GLOSSARY,
  NOTEBOOKS,
  PAST,
  QUIZ,
  SECTIONS_SHARED,
  SUGGESTIONS,
  TOP_QUESTIONS,
  findAnswer,
  findNear,
  sourceById,
  sourcesFor,
  tierLabel,
  type AnswerLang,
  type PastQuestion,
  type SourceFile,
  type Tier,
  type Tri,
} from "./samples";

/* ----------------------------------------------------- shared state */

// lives for the tab, shared by every Guru view
const useNotebookId = () => useShared("guru.nb", "g4");
const useOpenCite = () => useShared<string | null>("guru.cite", null);
const usePending = () => useShared<string | null>("guru.pending", null);
const useFlags = () => useShared<{ id: string; q: string; nb: string }[]>("guru.flags", []);
const useApproved = () => useShared<Record<string, string>>("guru.approved", {});
const useExtraSources = () => useShared<SourceFile[]>("guru.uploads", []);
const usePracticeTab = () => useShared<"past" | "summary" | "quiz">("guru.ptab", "past");
const usePracticeTopic = () => useShared<string | null>("guru.ptopic", null);
const useChapter = () => useShared("guru.chapter", CHAPTERS[0].id);
const useTier = () => useShared<Tier>("guru.tier", "IV");

// kept on this device, per viewer — never sent to faculty
interface HistoryItem {
  id: string;
  at: string;
  nb: string;
  kind: "answered" | "not-in-notes" | "quiz";
  q: string;
  detail?: string;
}
const useHistory = () => useStored<HistoryItem[]>("yazhi-ws:guru:history", []);

const notebookOf = (id: string) => NOTEBOOKS.find((n) => n.id === id) ?? NOTEBOOKS[0];
const searchable = (nb: string, extra: SourceFile[]) => [...sourcesFor(nb), ...extra.filter((s) => s.notebooks.includes(nb))].filter((s) => s.status === "searchable");
const stem = (name: string) => name.replace(/\.[a-z]+$/i, "");

/** a first guess at the language a question was asked in */
function guessLang(q: string, ui: "ta" | "en" | "te"): AnswerLang {
  if (/[஀-௿]/.test(q)) return "ta";
  if (/\b(enna|entha|irukku|panradhu|eppadi|pathi|sollu|na)\b|-la\b/i.test(q)) return "tg";
  return ui === "en" ? "en" : "ta";
}

/** A notebook's cover: a coloured book with its code, as in the mockup. */
function Cover({ nb, size = 40 }: { nb: string; size?: number }) {
  const n = notebookOf(nb);
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-end rounded-md p-1 font-mono text-[10px] font-semibold leading-none text-night"
      style={{ width: size, height: Math.round(size * 1.2), background: `linear-gradient(160deg, color-mix(in oklab, ${n.cover} 70%, white), ${n.cover})` }}
    >
      {size >= 32 ? n.code : ""}
    </span>
  );
}

const L = {
  yourNotebooks: { ta: "உங்கள் குறிப்பேடுகள்", en: "Your notebooks" },
  askAnything: { ta: "உங்கள் குறிப்புகளிலிருந்து எதையும் கேளுங்கள்…", en: "Ask anything from your notes…" },
  followUp: { ta: "தொடர் கேள்வி கேளுங்கள்…", en: "Ask a follow-up…" },
  sources: { ta: "மூலங்கள்", en: "sources" },
  answersOnly: { ta: "இந்த மூலங்களிலிருந்து மட்டுமே பதில்", en: "Answers only from these sources" },
  back: { ta: "குறிப்பேடுகளுக்குத் திரும்பு", en: "Back to notebooks" },
  page: { ta: "பக்கம்", en: "Page" },
  verified: { ta: "சரிபார்த்த பகுதி", en: "span verified" },
  answerIn: { ta: "பதில் மொழி", en: "Answer in" },
  practiceThis: { ta: "இதைப் பயிற்சி செய்", en: "Practice this" },
  notInNotes: { ta: "உங்கள் குறிப்புகளில் இல்லை", en: "Not in your notes" },
  indexing: { ta: "தயாராகிறது — விரைவில்", en: "Indexing — ready soon" },
  source: { ta: "மூலம்", en: "Source" },
} satisfies Record<string, Bi>;

/* ------------------------------------------------------- notebooks */

function Home({ ctx }: { ctx: ModuleContext }) {
  const { t, go } = ctx;
  const [nbId, setNb] = useNotebookId();
  const [, setPending] = usePending();
  const [extra] = useExtraSources();
  const [q, setQ] = useState("");
  const inputId = useId();
  const nb = notebookOf(nbId);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setPending(q.trim());
    go("ask");
  };
  return (
    <div className="space-y-6">
      <section aria-labelledby="guru-hello" className="rounded-2xl border border-ivory/10 bg-night-2/80 p-5">
        <h2 id="guru-hello" className="font-display text-2xl font-bold text-ivory">
          <span lang="ta">வணக்கம்!</span>
        </h2>
        <p className="mt-1 text-sm text-ivory-dim">{t({ ta: "தொகுதி 1 · குரூப் IV · [மாதிரித் தேர்வர்]", en: "Batch 1 · Group IV · [Sample aspirant]" })}</p>
        <form onSubmit={submit} className="mt-4 rounded-2xl border border-ivory/15 bg-night/70 p-3 focus-within:border-[color:var(--accent)]">
          <label htmlFor={inputId} className="sr-only">
            {t(L.askAnything)} — {t(nb.title)}
          </label>
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(L.askAnything)}
              autoComplete="off"
              className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-ivory placeholder:text-ivory-dim/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!q.trim()}
              aria-label={t({ ta: "கேள்", en: "Ask" })}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-night enabled:hover:bg-bronze disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-ivory-dim">
            <span lang="ta">தமிழ்</span> · English · Tanglish — {t({ ta: "கேட்பது", en: "asking" })} <span className="text-ivory">{t(nb.title)}</span>
          </p>
        </form>
      </section>

      <section aria-labelledby="guru-books">
        <h2 id="guru-books" className="mb-2 text-xs font-semibold text-ivory-dim">
          {t(L.yourNotebooks)} · {NOTEBOOKS.length}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {NOTEBOOKS.map((n) => {
            const ready = n.state === "ready";
            const count = sourcesFor(n.id).length + extra.filter((s) => s.notebooks.includes(n.id)).length;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  aria-disabled={!ready}
                  aria-describedby={ready ? undefined : `${n.id}-state`}
                  onClick={() => {
                    if (!ready) return;
                    setNb(n.id);
                    go("ask");
                  }}
                  className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    n.id === nbId ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/5" : "border-ivory/10 bg-night-2/80 hover:border-ivory/30"
                  } ${ready ? "" : "cursor-not-allowed opacity-75"}`}
                >
                  <Cover nb={n.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ivory">{t(n.title)}</span>
                    <span className="block text-xs text-ivory-dim">
                      {n.code} · {n.faculty}
                      {count > 0 && ` · ${count} ${t(L.sources)}`}
                    </span>
                    {!ready && (
                      <span id={`${n.id}-state`} className="mt-1 block">
                        <Pill tone="info">{t(L.indexing)}</Pill>
                      </span>
                    )}
                  </span>
                  {ready && (
                    <span aria-hidden className="text-ivory-dim">
                      →
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** The last few questions, one press to ask again. */
function Continue({ ctx }: { ctx: ModuleContext }) {
  const { t, go } = ctx;
  const [history] = useHistory();
  const [, setNb] = useNotebookId();
  const [, setPending] = usePending();
  const recent = history.filter((h) => h.kind !== "quiz").slice(-3).reverse();
  return (
    <Panel eyebrow={t({ ta: "தொடருங்கள்", en: "Pick up" })} title={t({ ta: "சமீபத்திய கேள்விகள்", en: "Recent questions" })}>
      {recent.length === 0 ? (
        <p className="text-sm text-ivory-dim">{t({ ta: "நீங்கள் கேட்பவை இங்கே வரும் — இந்தச் சாதனத்தில் மட்டும்.", en: "What you ask shows up here — on this device only." })}</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => {
                  setNb(h.nb);
                  setPending(h.q);
                  go("ask");
                }}
                className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-ivory/10 px-3 py-2 text-left text-sm text-ivory hover:border-ivory/30"
              >
                <Cover nb={h.nb} size={18} />
                <span className="min-w-0 flex-1 truncate">{h.q}</span>
                <span className="sr-only">— {t({ ta: "மீண்டும் கேள்", en: "ask again" })}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------------- ask */

interface Turn {
  id: string;
  q: string;
  nb: string;
  pending: boolean;
  answer?: string | null;
  near?: string | null;
  lang: AnswerLang;
  flagged?: boolean;
}
type SetTurns = (next: Turn[] | ((p: Turn[]) => Turn[])) => void;

function Ask({ ctx }: { ctx: ModuleContext }) {
  const { t, lang, Link, href } = ctx;
  const [nbId] = useNotebookId();
  const [pending, setPending] = usePending();
  const [extra] = useExtraSources();
  const [turns, setTurns] = useShared<Turn[]>(`guru.thread.${nbId}`, []);
  const [, setHistory] = useHistory();
  const [status, setStatus] = useState("");
  const nb = notebookOf(nbId);
  const count = searchable(nbId, extra).length;

  const ask = (q: string) => {
    const id = uid();
    setTurns((ts) => [...ts, { id, q, nb: nbId, pending: true, lang: guessLang(q, lang) }]);
    setStatus(t({ ta: `${count} மூலங்களில் தேடுகிறது…`, en: `Searching ${count} sources…` }));
    // in the product the note agent answers through yazhi-api; the demo
    // answers from the fixtures after a short think
    window.setTimeout(() => {
      const hit = findAnswer(q, nbId);
      const near = hit ? null : (findNear(q)?.cite ?? null);
      setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, answer: hit?.id ?? null, near } : x)));
      setHistory((h) => [...h, { id, at: new Date().toISOString(), nb: nbId, kind: hit ? ("answered" as const) : ("not-in-notes" as const), q, detail: hit ? `${hit.cites.length}` : undefined }].slice(-100));
      setStatus(hit ? t({ ta: `பதில் தயார் — ${hit.cites.length} மூலங்களுடன்.`, en: `Answer ready, with ${hit.cites.length} sources.` }) : t({ ta: "உங்கள் குறிப்புகளில் இல்லை.", en: "Not in your notes." }));
    }, 700);
  };

  // a question asked from the notebooks view or history arrives here
  useEffect(() => {
    if (!pending) return;
    // after the paint, and only once even when effects run twice
    const timer = window.setTimeout(() => {
      setPending(null);
      ask(pending);
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const ready = nb.state === "ready";
  return (
    <section aria-labelledby="guru-ask-title" className="flex flex-col rounded-2xl border border-ivory/10 border-l-2 border-l-[color:var(--accent)] bg-night-2/80">
      <header className="flex items-center gap-3 border-b border-ivory/10 px-3 py-3">
        <Link href={href("notebooks")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ivory-dim hover:bg-ivory/5 hover:text-ivory">
          <Icon name="back" />
          <span className="sr-only">{t(L.back)}</span>
        </Link>
        <Cover nb={nbId} size={24} />
        <div className="min-w-0 flex-1">
          <h2 id="guru-ask-title" className="truncate text-sm font-semibold text-ivory">
            {t(nb.title)}
          </h2>
          <p className="text-xs text-ivory-dim">
            {t(L.answersOnly)} · {count} {t(L.sources)}
          </p>
        </div>
        <span className="hidden sm:block">
          <SampleTag />
        </span>
      </header>

      <div className="chat-scroll max-h-[38rem] min-h-64 space-y-5 overflow-y-auto px-4 py-4" data-lenis-prevent>
        {turns.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-ivory-dim">
              {t({ ta: "இந்தக் குறிப்பேட்டில் உள்ளதைப் பற்றி மட்டுமே பதில் சொல்வேன் — பக்கத்துடன். ஊகிக்க மாட்டேன்.", en: "I answer only from this notebook — with the page. I won't guess." })}
            </p>
            <ul className="flex flex-wrap gap-2" aria-label={t({ ta: "எடுத்துக்காட்டுக் கேள்விகள்", en: "Example questions" })}>
              {SUGGESTIONS.map((s) => (
                <li key={s.en}>
                  <button
                    type="button"
                    disabled={!ready}
                    onClick={() => ask(t(s))}
                    className="min-h-11 rounded-full border border-ivory/15 px-4 text-left text-sm text-ivory-dim hover:border-[color:var(--accent)]/60 hover:text-ivory disabled:opacity-40"
                  >
                    {t(s)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {turns.map((turn) => (
          <article key={turn.id} aria-label={turn.q} className="space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[color:var(--accent)] px-4 py-2.5 text-sm text-night">{turn.q}</p>
            {turn.pending ? (
              <div className="flex items-center gap-2 text-xs text-ivory-dim">
                <TypingDots />
                {t({ ta: "குறிப்புகளில் தேடுகிறது…", en: "Searching your notes…" })}
              </div>
            ) : turn.answer ? (
              <AnswerCard ctx={ctx} turn={turn} setTurns={setTurns} />
            ) : (
              <NotInNotes ctx={ctx} turn={turn} setTurns={setTurns} />
            )}
          </article>
        ))}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
      <div className="border-t border-ivory/10 p-3">
        {ready ? (
          <Composer onSend={ask} placeholder={turns.length ? t(L.followUp) : t(L.askAnything)} />
        ) : (
          <p className="text-sm text-ivory-dim">{t({ ta: "இந்தக் குறிப்பேடு இன்னும் தயாராகிறது.", en: "This notebook is still indexing." })}</p>
        )}
      </div>
    </section>
  );
}

/** A cited answer: sentences with numbered marks, then the numbered
    sources. Each source opens in place (and beside the answer on wide
    screens), showing the exact span the sentence rests on. */
function AnswerCard({ ctx, turn, setTurns }: { ctx: ModuleContext; turn: Turn; setTurns: SetTurns }) {
  const { t, go } = ctx;
  const a = BANK.find((x) => x.id === turn.answer)!;
  const [openCite, setOpenCite] = useOpenCite();
  const [open, setOpen] = useState<number | null>(null);
  const [, setTab] = usePracticeTab();
  const [, setTopic] = usePracticeTopic();
  const base = useId();
  const toggle = (n: number) => {
    const next = open === n ? null : n;
    setOpen(next);
    if (next) setOpenCite(a.cites[next - 1]);
  };
  const citeLabel = (n: number) => {
    const c = CITES[a.cites[n - 1]];
    return `${t(L.source)} ${n}: ${sourceById(c.source).name}, ${t(L.page)} ${c.page}`;
  };
  return (
    <div className="max-w-[94%] rounded-2xl border border-ivory/10 bg-night/60 p-4">
      <p lang={turn.lang === "tg" ? "en" : turn.lang} className="text-sm leading-relaxed text-ivory">
        {a.parts.map((p, i) => (
          <span key={i}>
            {(p.text as Tri)[turn.lang]}
            <button
              type="button"
              onClick={() => toggle(p.cite)}
              aria-expanded={open === p.cite}
              aria-controls={`${base}-src-${p.cite}`}
              aria-label={citeLabel(p.cite)}
              className="mx-0.5 inline-grid h-6 min-w-6 place-items-center rounded-full bg-[color:var(--accent)]/20 px-1 align-middle font-mono text-[11px] text-[color:var(--accent)] hover:bg-[color:var(--accent)]/35"
            >
              {p.cite}
            </button>{" "}
          </span>
        ))}
      </p>
      <ol className="mt-3 space-y-1 border-t border-dashed border-ivory/20 pt-3" aria-label={t({ ta: "மூலங்கள்", en: "Sources" })}>
        {a.cites.map((cid, i) => {
          const c = CITES[cid];
          const s = sourceById(c.source);
          const n = i + 1;
          const isOpen = open === n;
          return (
            <li key={cid}>
              <button
                type="button"
                onClick={() => toggle(n)}
                aria-expanded={isOpen}
                aria-controls={`${base}-src-${n}`}
                className={`flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-ivory/5 ${openCite === cid ? "bg-[color:var(--accent)]/5" : ""}`}
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/20 font-mono text-[10px] text-[color:var(--accent)]">{n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-ivory">{s.name}</span>
                  <span className="block text-[11px] text-ivory-dim">
                    {t(L.page)} {c.page} · {s.by}
                  </span>
                </span>
                <span aria-hidden className={`mt-1 text-sm text-ivory-dim transition-transform ${isOpen ? "rotate-90" : ""}`}>
                  ›
                </span>
              </button>
              <div id={`${base}-src-${n}`} hidden={!isOpen} className="mb-2 ml-9 mt-1 rounded-lg border-l-2 border-[color:var(--accent)] bg-[color:var(--accent)]/5 p-3">
                <p className="text-xs font-semibold text-ivory">{t(c.heading)}</p>
                <blockquote className="mt-1 text-sm text-ivory">{t(c.span)}</blockquote>
                <p className="mt-2">
                  <Pill tone="ok" title="The citation verifier found this span in the stored page">
                    ✓ {t(L.verified)}
                  </Pill>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Segmented
          label={t(L.answerIn)}
          value={turn.lang}
          onChange={(v) => setTurns((ts) => ts.map((x) => (x.id === turn.id ? { ...x, lang: v } : x)))}
          options={ANSWER_LANGS.map((o) => ({ value: o.value, label: o.label, lang: o.lang }))}
        />
        <button
          type="button"
          onClick={() => {
            setTopic(a.topic);
            setTab("past");
            go("practice");
          }}
          className="min-h-9 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:border-[color:var(--accent)] hover:text-ivory"
        >
          {t(L.practiceThis)} →
        </button>
      </div>
    </div>
  );
}

/** Mockup 03: when the notes don't hold the answer, say so plainly, point
    to the closest page the faculty shared, and let the student flag it —
    anonymously — so the faculty can add it. */
function NotInNotes({ ctx, turn, setTurns }: { ctx: ModuleContext; turn: Turn; setTurns: SetTurns }) {
  const { t } = ctx;
  const [, setOpenCite] = useOpenCite();
  const [, setFlags] = useFlags();
  const [showPage, setShowPage] = useState(false);
  const nb = notebookOf(turn.nb);
  const near = turn.near ? CITES[turn.near] : null;
  const nearSrc = near ? sourceById(near.source) : null;
  const regionId = useId();
  const body: Tri = {
    ta: "உங்கள் குறிப்புகளின் எந்தப் பக்கத்திலும் இதற்கான பதில் இல்லை. ஊகித்துச் சொல்ல மாட்டேன் — தவறான பதில் தேர்வில் கஷ்டம்.",
    en: "No page of your notes answers this. I won't guess — a wrong answer costs you in the exam.",
    tg: "Unga notes-la idhukku answer illa. Guess panna maatten — wrong answer exam-la kashtam.",
  };
  return (
    <div role="note" aria-label={t(L.notInNotes)} className="max-w-[94%] space-y-2">
      <div className="rounded-2xl border border-gold/50 bg-gold/5 p-4">
        <p className="text-xs font-semibold text-gold">
          {t(L.notInNotes)}
          {ctx.lang !== "en" && <span className="font-normal text-ivory-dim"> · Not in your notes</span>}
        </p>
        <p lang={turn.lang === "tg" ? "en" : turn.lang} className="mt-2 text-sm text-ivory">
          {body[turn.lang]}
        </p>
        {near && nearSrc && (
          <div className="mt-3">
            <p className="text-xs text-ivory-dim">{t({ ta: `${nb.faculty} பகிர்ந்தவற்றில் நெருங்கிய தலைப்பு:`, en: `Closest topic ${nb.faculty} shared:` })}</p>
            <div className="mt-1 rounded-xl border border-ivory/15 bg-night/60 p-3">
              <p className="text-sm font-semibold text-ivory">{nearSrc.name}</p>
              <p className="text-xs text-ivory-dim">
                {t(near.heading)} · {t({ ta: "பக்கங்கள்", en: "Pages" })} 20–22
              </p>
            </div>
          </div>
        )}
      </div>
      {near && nearSrc && (
        <>
          <button
            type="button"
            aria-expanded={showPage}
            aria-controls={regionId}
            onClick={() => {
              setShowPage((v) => !v);
              setOpenCite(near.id);
            }}
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-ivory/15 px-4 text-left text-sm text-ivory hover:border-[color:var(--accent)]"
          >
            {t({ ta: `${stem(nearSrc.name)} — பக்கம் ${near.page} ஐத் திற`, en: `Open ${stem(nearSrc.name)}, page ${near.page}` })}
            <span aria-hidden className={`transition-transform ${showPage ? "rotate-90" : ""}`}>
              ›
            </span>
          </button>
          <blockquote id={regionId} hidden={!showPage} className="rounded-lg border-l-2 border-[color:var(--accent)] bg-[color:var(--accent)]/5 p-3 text-sm text-ivory">
            {t(near.span)}
          </blockquote>
        </>
      )}
      {turn.flagged ? (
        <p role="status" className="rounded-xl border border-mullai/40 bg-mullai/5 px-4 py-3 text-sm text-ivory">
          ✓ {t({ ta: `கொடியிடப்பட்டது — ${nb.faculty} கேள்வியைப் பார்ப்பார், உங்கள் பெயரை அல்ல.`, en: `Flagged — ${nb.faculty} sees the question, not your name.` })}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setTurns((ts) => ts.map((x) => (x.id === turn.id ? { ...x, flagged: true } : x)));
            setFlags((f) => [...f, { id: turn.id, q: turn.q, nb: turn.nb }]);
            ctx.log(`Anonymous flag on ${nb.code}: a question not in the notes`);
          }}
          className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-ivory/15 px-4 text-left text-sm text-ivory hover:border-[color:var(--accent)]"
        >
          <Icon name="flag" size={16} />
          {t({ ta: `${nb.faculty} க்குக் கொடியிடு (பெயரின்றி)`, en: `Flag for ${nb.faculty} (anonymous)` })}
        </button>
      )}
    </div>
  );
}

/** Wide screens: the open source beside the answer. */
function PageViewer({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [cid, setOpenCite] = useOpenCite();
  const c = cid ? CITES[cid] : null;
  const s = c ? sourceById(c.source) : null;
  return (
    <Panel eyebrow={t(L.source)} title={c && s ? `${stem(s.name)} · ${t(L.page)} ${c.page}` : t({ ta: "மூலம் எதுவும் திறக்கப்படவில்லை", en: "No source open" })}>
      {c ? (
        <article className="space-y-2">
          <h3 className="text-sm font-semibold text-ivory">{t(c.heading)}</h3>
          <blockquote className="rounded-lg border-l-2 border-[color:var(--accent)] bg-[color:var(--accent)]/5 p-3 text-sm leading-relaxed text-ivory">{t(c.span)}</blockquote>
          <p className="flex flex-wrap items-center gap-2 text-[11px] text-ivory-dim">
            <Pill tone="ok">✓ {t(L.verified)}</Pill>
            {s?.by} · {t({ ta: "நிறுவனக் கணினி", en: "institute machine" })}
          </p>
          <button type="button" onClick={() => setOpenCite(null)} className="min-h-11 text-xs text-ivory-dim hover:text-ivory">
            {t({ ta: "மூடு", en: "Close" })}
          </button>
        </article>
      ) : (
        <p className="text-sm text-ivory-dim">{t({ ta: "பதிலின் கீழ் உள்ள எண்ணிட்ட மூலத்தை அழுத்துங்கள்.", en: "Press a numbered source under an answer." })}</p>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------- practice */

function Practice({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [tab, setTab] = usePracticeTab();
  const [nbId] = useNotebookId();
  const nb = notebookOf(nbId);
  return (
    <section aria-labelledby="guru-practice" className="rounded-2xl border border-ivory/10 border-l-2 border-l-[color:var(--accent)] bg-night-2/80 p-4">
      <p className="font-mono text-[11px] text-ivory-dim">{nb.code}</p>
      <h2 id="guru-practice" className="mb-3 font-display text-xl font-bold text-ivory">
        {t(nb.title)}
      </h2>
      <Tabs
        label={t({ ta: "பயிற்சி", en: "Practice" })}
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "past", label: t({ ta: "பழைய வினாக்கள்", en: "Past papers" }) },
          { value: "summary", label: t({ ta: "சுருக்கம்", en: "Summary" }) },
          { value: "quiz", label: t({ ta: "விரைவுத் தேர்வு", en: "Quick quiz" }) },
        ]}
      >
        {tab === "past" ? <PastPapers ctx={ctx} /> : tab === "summary" ? <Tiers ctx={ctx} /> : <Quiz ctx={ctx} />}
      </Tabs>
    </section>
  );
}

function PastPapers({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [topic, setTopic] = usePracticeTopic();
  const list = PAST.filter((p) => !topic || p.topic === topic);
  const topicName = CHAPTERS.find((c) => c.id === topic)?.title;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ivory-dim">
          {t({ ta: "இந்தக் குறிப்பேட்டின் பழைய வினாத்தாள்களிலிருந்து", en: "From past papers in this notebook" })} · {list.length} {t({ ta: "வினாக்கள்", en: "questions" })}
        </p>
        {topicName && (
          <button type="button" onClick={() => setTopic(null)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[color:var(--accent)]/50 px-3 text-xs text-[color:var(--accent)]">
            {t(topicName)}
            <span aria-hidden>✕</span>
            <span className="sr-only">— {t({ ta: "வடிகட்டியை நீக்கு", en: "clear filter" })}</span>
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id}>
            <PastCard ctx={ctx} p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PastCard({ ctx, p }: { ctx: ModuleContext; p: PastQuestion }) {
  const { t } = ctx;
  const [trying, setTrying] = useState(false);
  const [mine, setMine] = useState("");
  const [compared, setCompared] = useState(false);
  const id = useId();
  const src = sourceById(p.source);
  return (
    <article aria-labelledby={`${id}-q`} className="rounded-2xl border border-ivory/10 bg-night/60 p-4">
      <div className="flex flex-wrap gap-1.5">
        <Pill tone="accent">{p.paper}</Pill>
        <Pill>
          {p.q} · {t(p.marks)}
        </Pill>
      </div>
      <h3 id={`${id}-q`} className="mt-2 text-sm font-semibold leading-relaxed text-ivory">
        {t(p.text)}
      </h3>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ivory-dim">
        <span>
          {t(L.source)}: {stem(src.name)} · p. {p.page}
        </span>
        <button type="button" aria-expanded={trying} aria-controls={`${id}-try`} onClick={() => setTrying((v) => !v)} className="min-h-10 font-semibold text-[color:var(--accent)] hover:underline">
          {t({ ta: "விடை எழுதிப் பார்", en: "Try answer" })} →
        </button>
      </div>
      <div id={`${id}-try`} hidden={!trying} className="mt-3 space-y-3">
        <label className="block text-xs text-ivory-dim">
          {t({ ta: "உங்கள் விடை", en: "Your answer" })}
          <textarea
            value={mine}
            onChange={(e) => setMine(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-ivory/15 bg-night p-3 text-sm text-ivory focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCompared(true)}
            disabled={!mine.trim()}
            className="min-h-11 rounded-full bg-gold px-4 text-sm font-semibold text-night hover:bg-bronze disabled:opacity-40"
          >
            {t({ ta: "என் குறிப்புகளுடன் ஒப்பிடு", en: "Compare with my notes" })}
          </button>
          {!mine.trim() && <span className="text-[11px] text-ivory-dim">{t({ ta: "முதலில் நீங்களே எழுதுங்கள் — பிறகு வரைவு.", en: "Write it yourself first — then the outline." })}</span>}
        </div>
        {compared && (
          <div role="region" aria-label={t({ ta: "குறிப்புகளின் வரைவு", en: "Outline from your notes" })} className="rounded-xl border border-[color:var(--accent)]/40 p-3">
            <p className="mb-2 text-xs font-semibold text-ivory-dim">{t({ ta: "உங்கள் குறிப்புகள் சொல்வது — உங்கள் விடையில் உள்ளதா பாருங்கள்", en: "What your notes say — check yours covers it" })}</p>
            <ul className="space-y-2">
              {p.outline.map((o, i) => {
                const c = CITES[o.cite];
                return (
                  <li key={i} className="text-sm text-ivory">
                    {t(o.text)}
                    <details className="mt-1 text-xs text-ivory-dim">
                      <summary className="min-h-8 cursor-pointer text-[color:var(--accent)]">
                        {stem(sourceById(c.source).name)} · p. {c.page}
                      </summary>
                      <blockquote className="mt-1 border-l-2 border-[color:var(--accent)] pl-2 text-ivory">{t(c.span)}</blockquote>
                    </details>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function Tiers({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [chapterId, setChapter] = useChapter();
  const [tier, setTier] = useTier();
  const [approved] = useApproved();
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const ch = CHAPTERS.find((c) => c.id === chapterId) ?? CHAPTERS[0];
  const body = ch.tiers[tier];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label={t({ ta: "பாடம்", en: "Chapter" })}
          value={ch.id}
          onChange={(v) => {
            setChapter(v);
            setShown({});
          }}
          options={CHAPTERS.map((c) => ({ value: c.id, label: t(c.title) }))}
        />
        <Segmented
          label={t({ ta: "நிலை", en: "Tier" })}
          value={tier}
          onChange={(v) => {
            setTier(v);
            setShown({});
            ctx.log(`Summary tier → ${tierLabel[v].en} — ${ch.title.en}`);
          }}
          options={(["IV", "II", "I"] as Tier[]).map((x) => ({ value: x, label: t(tierLabel[x]) }))}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ivory-dim">{t(ch.unit)}</p>
        <MachineDraft approvedBy={approved[body.draftId]} />
      </div>
      <ul className="space-y-1.5 text-sm text-ivory">
        {body.note.map((n, i) => (
          <li key={i} className="rounded-lg bg-night/60 px-3 py-2">
            {t(n)}
          </li>
        ))}
      </ul>
      <ol className="space-y-2">
        {body.items.map((it, i) => (
          <li key={i} className="rounded-xl border border-ivory/10 p-3 text-sm">
            <p className="text-ivory">{t(it.q)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              {it.a && (
                <button type="button" aria-expanded={!!shown[i]} onClick={() => setShown((o) => ({ ...o, [i]: !o[i] }))} className="min-h-9 text-[color:var(--accent)] hover:underline">
                  {shown[i] ? t(it.a) : t({ ta: "விடையைக் காட்டு", en: "Show answer" })}
                </button>
              )}
              <span className="text-ivory-dim">
                {stem(sourceById(CITES[it.cite].source).name)} · p. {CITES[it.cite].page}
              </span>
            </div>
          </li>
        ))}
      </ol>
      {tier === "I" && <p className="text-[11px] text-ivory-dim">{t({ ta: "குரு வரைவு தருகிறது; விடையை நீங்களே எழுதுங்கள்.", en: "Guru outlines; you write the answer yourself." })}</p>}
    </div>
  );
}

type QuizResult = { picks: Record<string, number>; submitted: boolean };
const useQuiz = () => useShared<QuizResult>("guru.quiz", { picks: {}, submitted: false });

function Quiz({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [r, setR] = useQuiz();
  const [, setHistory] = useHistory();
  const [nbId] = useNotebookId();
  const score = QUIZ.filter((q) => r.picks[q.id] === q.answer).length;
  const answered = QUIZ.filter((q) => r.picks[q.id] !== undefined).length;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ivory-dim" aria-live="polite">
          {r.submitted
            ? t({ ta: `மதிப்பெண் ${score}/${QUIZ.length}`, en: `Score ${score} of ${QUIZ.length}` })
            : t({ ta: `${answered}/${QUIZ.length} பதிலளிக்கப்பட்டது`, en: `${answered} of ${QUIZ.length} answered` })}
        </p>
        <SampleTag />
      </div>
      <ol className="space-y-4">
        {QUIZ.map((q, i) => {
          const pick = r.picks[q.id];
          const right = pick === q.answer;
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="text-sm font-semibold text-ivory">
                  {i + 1}. {t(q.q)}
                </legend>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {q.options.map((o, oi) => {
                    const chosen = pick === oi;
                    const mark = r.submitted && (oi === q.answer ? "border-mullai/70 bg-mullai/10" : chosen ? "border-palai/70 bg-palai/10" : "");
                    return (
                      <label
                        key={oi}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${mark || (chosen ? "border-[color:var(--accent)]/70 bg-[color:var(--accent)]/10" : "border-ivory/10 hover:border-ivory/25")}`}
                      >
                        <input type="radio" name={q.id} checked={chosen} disabled={r.submitted} onChange={() => setR((x) => ({ ...x, picks: { ...x.picks, [q.id]: oi } }))} className="accent-[var(--gold)]" />
                        <span className="text-ivory">{t(o)}</span>
                        {r.submitted && oi === q.answer && (
                          <span className="ml-auto text-xs text-mullai">
                            ✓<span className="sr-only"> {t({ ta: "சரியான விடை", en: "correct answer" })}</span>
                          </span>
                        )}
                        {r.submitted && chosen && !right && (
                          <span className="ml-auto text-xs text-palai">
                            ✕<span className="sr-only"> {t({ ta: "உங்கள் விடை, தவறு", en: "your answer, wrong" })}</span>
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {r.submitted && !right && (
                  <details className="mt-2 rounded-lg border border-gold/40 bg-gold/5 p-3 text-sm">
                    <summary className="min-h-8 cursor-pointer text-ivory">{t({ ta: "ஏன் தவறு?", en: "Why was this wrong?" })}</summary>
                    <p className="mt-1 text-ivory-dim">{t(q.why)}</p>
                    <p className="mt-1 text-xs text-[color:var(--accent)]">
                      {stem(sourceById(CITES[q.cite].source).name)} · p. {CITES[q.cite].page}
                    </p>
                  </details>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      {!r.submitted ? (
        <button
          type="button"
          disabled={answered < QUIZ.length}
          onClick={() => {
            setR((x) => ({ ...x, submitted: true }));
            setHistory((h) => [...h, { id: uid(), at: new Date().toISOString(), nb: nbId, kind: "quiz" as const, q: "Quick quiz", detail: `${score}/${QUIZ.length}` }].slice(-100));
            ctx.log(`Quiz submitted: ${score}/${QUIZ.length}`);
          }}
          className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze disabled:opacity-40"
        >
          {t({ ta: "சமர்ப்பி", en: "Submit" })}
        </button>
      ) : (
        <button type="button" onClick={() => setR({ picks: {}, submitted: false })} className="min-h-11 rounded-full border border-ivory/20 px-5 text-sm text-ivory-dim hover:text-ivory">
          {t({ ta: "மீண்டும் எழுது", en: "Try again" })}
        </button>
      )}
    </div>
  );
}

/** Vaathi — the next lesson, from the last quiz. */
function Vaathi({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [r] = useQuiz();
  const [, setChapter] = useChapter();
  const [, setTier] = useTier();
  const [, setTab] = usePracticeTab();
  const misses = QUIZ.filter((q) => r.submitted && r.picks[q.id] !== q.answer);
  const next = CHAPTERS.find((c) => c.id === misses[0]?.topic);
  return (
    <Panel eyebrow="Vaathi" title={t({ ta: "அடுத்த பாடம்", en: "Next lesson" })}>
      {!r.submitted ? (
        <p className="text-sm text-ivory-dim">{t({ ta: "விரைவுத் தேர்வை முடித்தால், பலவீனமான பகுதியிலிருந்து அடுத்த பாடத்தைச் சொல்வேன்.", en: "Finish the quick quiz and I'll suggest the next lesson from your weakest area." })}</p>
      ) : next ? (
        <div className="space-y-2 text-sm">
          <p className="text-ivory">
            {t({ ta: "மீண்டும் படிக்க:", en: "Revise next:" })} <strong>{t(next.title)}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setChapter(next.id);
              setTier("IV");
              setTab("summary");
            }}
            className="min-h-11 rounded-full border border-[color:var(--accent)]/60 px-4 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
          >
            {t({ ta: "குரூப் IV சுருக்கத்தைத் திற", en: "Open the Group IV summary" })} →
          </button>
        </div>
      ) : (
        <p className="text-sm text-ivory">{t({ ta: "எல்லாம் சரி. அடுத்த அலகுக்குச் செல்லலாம்.", en: "All correct. On to the next unit." })}</p>
      )}
    </Panel>
  );
}

function Glossary({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  return (
    <Panel eyebrow={t({ ta: "சொற்களஞ்சியம்", en: "Glossary" })} title={t({ ta: "தமிழ் – ஆங்கிலம்", en: "Tamil – English" })}>
      <dl className="space-y-1.5 text-sm">
        {GLOSSARY.map((g) => (
          <div key={g.ta} className="flex flex-wrap justify-between gap-x-3 border-b border-ivory/5 pb-1.5">
            <dt lang="ta" className="text-ivory">
              {g.ta}
            </dt>
            <dd lang="en" className="text-ivory-dim">
              {g.en}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* ----------------------------------------------------------- history */

function History({ ctx }: { ctx: ModuleContext }) {
  const { t, go } = ctx;
  const [history, , clear] = useHistory();
  const [, setNb] = useNotebookId();
  const [, setPending] = usePending();
  const [confirming, setConfirming] = useState(false);
  const items = [...history].reverse();
  return (
    <Panel accentEdge eyebrow={t({ ta: "இந்தச் சாதனத்தில் மட்டும்", en: "On this device only" })} title={t({ ta: "உங்கள் வரலாறு", en: "Your history" })} actions={<Pill>{history.length}</Pill>}>
      {items.length === 0 ? (
        <p className="text-sm text-ivory-dim">{t({ ta: "இன்னும் எதுவும் இல்லை. நீங்கள் கேட்பவையும் தேர்வுகளும் இங்கே வரும்.", en: "Nothing yet. Your questions and quizzes will show up here." })}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ivory/10 bg-night/60 p-3">
              <Cover nb={h.nb} size={20} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ivory">{h.kind === "quiz" ? t({ ta: "விரைவுத் தேர்வு", en: "Quick quiz" }) : h.q}</p>
                <p className="text-[11px] text-ivory-dim">
                  <time dateTime={h.at}>{IST(h.at)} IST</time> ·{" "}
                  {h.kind === "answered"
                    ? t({ ta: `${h.detail} மூலங்களுடன் பதில்`, en: `answered with ${h.detail} sources` })
                    : h.kind === "quiz"
                      ? t({ ta: `மதிப்பெண் ${h.detail}`, en: `score ${h.detail}` })
                      : t(L.notInNotes)}
                </p>
              </div>
              {h.kind !== "quiz" && (
                <button
                  type="button"
                  onClick={() => {
                    setNb(h.nb);
                    setPending(h.q);
                    go("ask");
                  }}
                  className="min-h-11 rounded-full border border-ivory/20 px-4 text-xs text-ivory-dim hover:text-ivory"
                >
                  {t({ ta: "மீண்டும் கேள்", en: "Ask again" })}
                  <span className="sr-only">: {h.q}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: "உங்கள் வரலாற்றை ஆசிரியர்கள் பார்க்க முடியாது.", en: "Faculty can't see your history." })}</p>
      {history.length > 0 &&
        (confirming ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ivory">{t({ ta: "எல்லாவற்றையும் அழிக்கவா?", en: "Clear all of it?" })}</span>
            <button
              type="button"
              onClick={() => {
                clear();
                setConfirming(false);
              }}
              className="min-h-11 rounded-full bg-gold px-4 font-semibold text-night hover:bg-bronze"
            >
              {t({ ta: "ஆம், அழி", en: "Yes, clear" })}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="min-h-11 rounded-full border border-ivory/20 px-4 text-ivory-dim hover:text-ivory">
              {t({ ta: "வேண்டாம்", en: "Keep it" })}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="mt-2 min-h-11 rounded-full border border-ivory/20 px-4 text-xs text-ivory-dim hover:border-palai/60 hover:text-ivory">
            {t({ ta: "வரலாற்றை அழி", en: "Clear history" })}
          </button>
        ))}
    </Panel>
  );
}

/* ----------------------------------------------------------- faculty */

const STATUS = {
  searchable: { dot: "bg-mullai", ta: "தேடக்கூடியது", en: "Searchable" },
  indexing: { dot: "bg-gold", ta: "தயாராகிறது", en: "Indexing" },
  scanned: { dot: "bg-palai", ta: "ஸ்கேன் · இன்னும் படிக்க முடியாது", en: "Scanned · can't read yet" },
} as const;

function SourcesTable({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [nbId] = useNotebookId();
  const [extra, setExtra] = useExtraSources();
  const [items, setItems] = useState<UploadItem[]>([]);
  const rows = [...sourcesFor(nbId), ...extra.filter((s) => s.notebooks.includes(nbId))];
  const onFiles = (files: File[]) => {
    const fresh: SourceFile[] = files.map((f) => {
      const image = f.type.startsWith("image/");
      const ext = (f.name.split(".").pop() ?? "").toUpperCase();
      return {
        id: uid("up-"),
        notebooks: [nbId],
        name: f.name,
        type: image ? "Image" : ext === "PPTX" ? "PPTX" : ext === "DOCX" ? "DOCX" : "PDF",
        pages: Math.max(1, Math.round(f.size / 40000)),
        status: image ? "scanned" : "indexing",
        progress: 0.1,
        eta: 1,
        by: "You · demo",
      };
    });
    setExtra((x) => [...x, ...fresh]);
    setItems(fresh.map((f) => ({ id: f.id, name: f.name, size: 0, status: f.status === "scanned" ? "rejected" : "reading", note: f.status === "scanned" ? "scanned" : "indexing" })));
    fresh.forEach((f) => ctx.log(`Uploaded ${f.name} to ${notebookOf(nbId).code}`));
    // the files stay in this browser tab: the demo reads only name, type and size
    window.setTimeout(() => {
      setExtra((x) => x.map((s) => (fresh.some((f) => f.id === s.id) && s.status === "indexing" ? { ...s, status: "searchable" } : s)));
      setItems([]);
    }, 1800);
  };
  return (
    <div className="space-y-4">
      <UploadCard
        title={t({ ta: "பாடத்திட்டம், குறிப்புகள், பழைய வினாத்தாள்களை இங்கே இழுத்துவிடுங்கள்", en: "Drop syllabus, notes or past papers" })}
        hint={t({
          ta: "PDF, DOCX அல்லது PPTX · இப்போதைக்குத் தட்டச்சு உரை மட்டும் — ஸ்கேன் செய்த தமிழ் OCR அடுத்து வருகிறது. கோப்புகள் நிறுவனத்தை விட்டு வெளியேறாது.",
          en: "PDF, DOCX or PPTX · typed text only for now — scanned Tamil OCR is coming next. Files never leave the institute.",
        })}
        accept=".pdf,.docx,.pptx,image/*"
        items={items}
        labels={{ choose: t({ ta: "கோப்புகளைத் தேர்ந்தெடு", en: "Choose files", te: "ఫైళ్లను ఎంచుకోండి" }), tickFirst: t({ ta: "முதலில் மேலே உள்ள பெட்டியைத் தேர்வு செய்யுங்கள்", en: "Tick the box above to choose files", te: "ముందుగా పై పెట్టెను ఎంచుకోండి" }) }}
        onFiles={onFiles}
        consent={t({ ta: "இந்தப் பொருள் இந்த நிறுவனத்துடையது அல்லது பயன்படுத்த அனுமதி உள்ளது.", en: "This material is the institute's own, or the institute may use it." })}
      />
      <div role="region" aria-label={t({ ta: "மூலங்கள் அட்டவணை", en: "Sources table" })} tabIndex={0} className="overflow-x-auto rounded-xl border border-ivory/10">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">{t({ ta: "இந்தக் குறிப்பேட்டின் மூலங்களும் அவற்றின் நிலையும்", en: "This notebook's sources and their status" })}</caption>
          <thead className="bg-night/60 text-[11px] text-ivory-dim">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                {t(L.source)}
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                {t({ ta: "வகை", en: "Type" })}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                {t({ ta: "பக்கங்கள்", en: "Pages" })}
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                {t({ ta: "நிலை", en: "Status" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const st = STATUS[s.status];
              const pct = Math.round((s.progress ?? 0) * 100);
              return (
                <tr key={s.id} className="border-t border-ivory/10">
                  <th scope="row" className="px-3 py-2.5 font-normal text-ivory">
                    {s.name}
                  </th>
                  <td className="px-3 py-2.5 font-mono text-xs text-ivory-dim">{s.type}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs text-ivory-dim">{s.pages}</td>
                  <td className="px-3 py-2.5 text-xs text-ivory">
                    {s.status === "indexing" ? (
                      <span className="flex items-center gap-2">
                        <span role="progressbar" aria-label={`${s.name}: ${t(st)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="h-1.5 w-16 overflow-hidden rounded-full bg-ivory/10">
                          <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                        </span>
                        {t(st)} · ~{s.eta} min
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${st.dot}`} />
                        {t(st)}
                        {s.pastPaper && <span className="text-ivory-dim"> · {t({ ta: "பழைய வினாத்தாள்", en: "past paper" })}</span>}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ivory-dim">{t({ ta: "ஸ்கேன் செய்த பக்கங்களுக்கான தமிழ் OCR வந்ததும் அவை தேடக்கூடியவையாகும்.", en: "Scanned pages become searchable once Tamil OCR lands." })}</p>
    </div>
  );
}

const DRAFTS = [
  { id: "chola-IV", what: { ta: "சோழர் நிர்வாகம் · குரூப் IV சுருக்கம்", en: "Chola administration · Group IV summary" } },
  { id: "chola-II", what: { ta: "சோழர் நிர்வாகம் · குரூப் II/IIA சுருக்கம்", en: "Chola administration · Group II/IIA summary" } },
  { id: "chola-I", what: { ta: "சோழர் நிர்வாகம் · குரூப் I வரைவு", en: "Chola administration · Group I outline" } },
  { id: "rights-IV", what: { ta: "அடிப்படை உரிமைகள் · குரூப் IV சுருக்கம்", en: "Fundamental rights · Group IV summary" } },
];

function StudyAids({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [approved, setApproved] = useApproved();
  const [rejected, setRejected] = useShared<string[]>("guru.rejected", []);
  const pending = DRAFTS.filter((d) => !approved[d.id] && !rejected.includes(d.id)).length;
  return (
    <div className="space-y-3">
      <p className="text-xs text-ivory-dim">
        {t({ ta: `இயந்திர வரைவுகள் · ${pending} காத்திருக்கின்றன. ஒப்புக்கொள்ளும் வரை மாணவர்கள் “இயந்திர வரைவு” குறியைப் பார்ப்பார்கள்.`, en: `Machine drafts · ${pending} waiting. Until approved, students see the machine-draft badge.` })}
      </p>
      <ul className="space-y-2">
        {DRAFTS.map((d) => {
          const by = approved[d.id];
          const no = rejected.includes(d.id);
          return (
            <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-ivory/10 bg-night/60 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ivory">{t(d.what)}</p>
                <div className="mt-1">{no ? <Pill tone="risk">rejected</Pill> : <MachineDraft approvedBy={by} />}</div>
              </div>
              {!by && !no && (
                <span className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setApproved((a) => ({ ...a, [d.id]: "Faculty · demo" }));
                      ctx.log(`Approved machine draft: ${d.what.en}`, [d.id]);
                    }}
                    className="min-h-11 rounded-full bg-gold px-4 text-xs font-semibold text-night hover:bg-bronze"
                  >
                    {t({ ta: "ஒப்புக்கொள்", en: "Approve" })}
                    <span className="sr-only">: {t(d.what)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejected((r) => [...r, d.id]);
                      ctx.log(`Rejected machine draft: ${d.what.en}`, [d.id]);
                    }}
                    className="min-h-11 rounded-full border border-ivory/20 px-4 text-xs text-ivory-dim hover:border-palai/60 hover:text-ivory"
                  >
                    {t({ ta: "நிராகரி", en: "Reject" })}
                    <span className="sr-only">: {t(d.what)}</span>
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Questions({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [flags] = useFlags();
  return (
    <div className="space-y-5">
      <section aria-labelledby="guru-topq">
        <h3 id="guru-topq" className="mb-2 text-xs font-semibold text-ivory-dim">
          {t({ ta: "மாணவர்கள் அதிகம் கேட்பவை", en: "Top student questions" })}
        </h3>
        <ul className="space-y-2">
          {flags.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/40 bg-gold/5 p-3 text-sm">
              <span className="text-ivory">{f.q}</span>
              <Pill tone="warn">{t({ ta: "கொடி · பெயரின்றி", en: "flagged · anonymous" })}</Pill>
            </li>
          ))}
          {TOP_QUESTIONS.map((q) => (
            <li key={q.q.en} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ivory/10 bg-night/60 p-3 text-sm">
              <span className="text-ivory">{t(q.q)}</span>
              <span className="flex items-center gap-2 text-xs text-ivory-dim">
                {q.times}
                <span className="sr-only">{t({ ta: "முறை", en: "times" })}</span>
                <span aria-hidden>×</span>
                {!q.inNotes && <Pill tone="warn">{t(L.notInNotes)}</Pill>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="guru-weak">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 id="guru-weak" className="text-xs font-semibold text-ivory-dim">
            {t({ ta: "வகுப்பின் பலவீனப் பகுதிகள்", en: "Where the class is weak" })}
          </h3>
          <SampleTag />
        </div>
        <ul className="space-y-3">
          {CLASS_TOPICS.map((x) => {
            const pct = Math.round(x.correct * 100);
            const weak = pct < 60;
            return (
              <li key={x.id} className="text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-ivory">{t(x.label)}</span>
                  <span className={weak ? "font-semibold text-palai" : "text-ivory-dim"}>
                    {pct}% {t({ ta: "சரி", en: "correct" })} · {x.attempted} {t({ ta: "முயற்சி", en: "tried" })}
                    {weak && ` · ${t({ ta: "பலவீனம்", en: "weak" })}`}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ivory/10" aria-hidden>
                  <div className={`h-full rounded-full ${weak ? "bg-palai" : "bg-[color:var(--accent)]"}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** Mockup 05: a notebook as faculty see it — its title, then Sources,
    Study aids and Questions as tabs. */
function Faculty({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [nbId, setNb] = useNotebookId();
  const [extra] = useExtraSources();
  const [tab, setTab] = useShared<"sources" | "aids" | "questions">("guru.ftab", "sources");
  const nb = notebookOf(nbId);
  const count = sourcesFor(nbId).length + extra.filter((s) => s.notebooks.includes(nbId)).length;
  return (
    <section aria-labelledby="guru-fac-title" className="rounded-2xl border border-ivory/10 bg-night-2/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-ivory-dim">{nb.code}</p>
          <h2 id="guru-fac-title" className="font-display text-2xl font-bold text-ivory sm:text-3xl">
            {t(nb.title)}
          </h2>
        </div>
        <label className="text-xs text-ivory-dim">
          {t({ ta: "குறிப்பேடு", en: "Notebook" })}
          <select value={nbId} onChange={(e) => setNb(e.target.value)} className="mt-1 block min-h-11 rounded-lg border border-ivory/15 bg-night px-2 text-sm text-ivory">
            {NOTEBOOKS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.code} · {t(n.title)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4">
        <Tabs
          label={t({ ta: "குறிப்பேட்டின் பகுதிகள்", en: "Notebook sections" })}
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "sources", label: `${t({ ta: "மூலங்கள்", en: "Sources" })} · ${count}` },
            { value: "aids", label: t({ ta: "கற்றல் உதவிகள்", en: "Study aids" }) },
            { value: "questions", label: t({ ta: "கேள்விகள்", en: "Questions" }) },
          ]}
        >
          {tab === "sources" ? <SourcesTable ctx={ctx} /> : tab === "aids" ? <StudyAids ctx={ctx} /> : <Questions ctx={ctx} />}
        </Tabs>
      </div>
    </section>
  );
}

/** Who can open the notebook. Adding a section changes who sees the
    institute's material, so it waits for a confirm and is logged. */
function Sharing({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [nbId] = useNotebookId();
  const [sections, setSections] = useShared("guru.sections", SECTIONS_SHARED);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [proposed, setProposed] = useState<string | null>(null);
  const inputId = useId();
  const total = sections.reduce((n, s) => n + s.students, 0);
  return (
    <Panel eyebrow={notebookOf(nbId).code} title={t({ ta: "பகிரப்பட்டது", en: "Shared with" })}>
      <ul className="space-y-1.5 text-sm">
        {sections.map((s) => (
          <li key={s.id} className="flex justify-between gap-2 border-b border-ivory/5 pb-1.5">
            <span className="text-ivory">{s.name}</span>
            <span className="font-mono text-xs text-ivory-dim">
              {s.students}
              <span className="sr-only"> {t({ ta: "மாணவர்கள்", en: "students" })}</span>
            </span>
          </li>
        ))}
      </ul>
      {proposed ? (
        <div className="mt-3">
          <ConfirmGate
            action={t({ ta: `“${proposed}” உடன் பகிர்`, en: `Share with “${proposed}”` })}
            impact={t({ ta: "அந்தப் பிரிவின் மாணவர்கள் இந்தக் குறிப்பேட்டைத் திறக்கலாம்.", en: "Students in that section can open this notebook." })}
            rollback={t({ ta: "பிரிவை எந்த நேரத்திலும் நீக்கலாம்.", en: "Remove the section at any time." })}
            onConfirm={() => {
              setSections((x) => [...x, { id: uid("sec-"), name: proposed, students: 0 }]);
              ctx.log(`Shared ${notebookOf(nbId).code} with section “${proposed}”`);
              setProposed(null);
              setName("");
              setAdding(false);
            }}
            onDecline={() => setProposed(null)}
          />
        </div>
      ) : adding ? (
        <form
          className="mt-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setProposed(name.trim());
          }}
        >
          <div className="min-w-0 flex-1">
            <label htmlFor={inputId} className="text-xs text-ivory-dim">
              {t({ ta: "பிரிவின் பெயர்", en: "Section name" })}
            </label>
            <input id={inputId} autoFocus value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-ivory/15 bg-night px-3 text-sm text-ivory focus:border-[color:var(--accent)] focus:outline-none" />
          </div>
          <button type="submit" disabled={!name.trim()} className="min-h-11 rounded-full bg-gold px-4 text-sm font-semibold text-night hover:bg-bronze disabled:opacity-40">
            {t({ ta: "சேர்", en: "Add" })}
          </button>
          <button type="button" onClick={() => setAdding(false)} className="min-h-11 rounded-full border border-ivory/20 px-4 text-sm text-ivory-dim hover:text-ivory">
            {t({ ta: "ரத்து", en: "Cancel" })}
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-3 min-h-11 text-sm text-[color:var(--accent)] hover:underline">
          + {t({ ta: "பிரிவைச் சேர்", en: "Add section" })}
        </button>
      )}
      <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: `இந்த ${total} மாணவர்கள் மட்டுமே இந்தக் குறிப்பேட்டைத் திறக்க முடியும்.`, en: `Only these ${total} students can open this notebook.` })}</p>
    </Panel>
  );
}

function Languages({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  return (
    <Panel title={t({ ta: "பதில் மொழிகள்", en: "Answer languages" })}>
      <p className="text-sm text-ivory-dim">
        {t({ ta: "மாணவர்கள் ", en: "Students can ask and get answers in " })}
        <span lang="ta" className="text-ivory">
          தமிழ்
        </span>
        , <span className="text-ivory">English</span> {t({ ta: "அல்லது", en: "and" })} <span className="text-ivory">Tanglish</span>
        {t({ ta: " இல் கேட்டுப் பதில் பெறலாம். மேற்கோள்கள் எப்போதும் உங்கள் மூலப் பக்கங்களையே சுட்டும்.", en: ". Citations always point to your original pages." })}
      </p>
    </Panel>
  );
}

/* the faculty and practice tabs as separate panels, for anyone who would
   rather place them one by one */
function wrap(eyebrow: Bi, title: Bi, Inner: (p: { ctx: ModuleContext }) => ReactNode) {
  return function Wrapped({ ctx }: { ctx: ModuleContext }) {
    return (
      <Panel eyebrow={ctx.t(eyebrow)} title={ctx.t(title)}>
        <Inner ctx={ctx} />
      </Panel>
    );
  };
}
const PastPanel = wrap({ ta: "பயிற்சி", en: "Practice" }, { ta: "பழைய வினாக்கள்", en: "Past papers" }, PastPapers);
const TiersPanel = wrap({ ta: "பயிற்சி", en: "Practice" }, { ta: "சுருக்கம்", en: "Summary" }, Tiers);
const QuizPanel = wrap({ ta: "பயிற்சி", en: "Practice" }, { ta: "விரைவுத் தேர்வு", en: "Quick quiz" }, Quiz);
const SourcesPanel = wrap({ ta: "ஆசிரியர்", en: "Faculty" }, { ta: "மூலங்கள்", en: "Sources" }, SourcesTable);
const AidsPanel = wrap({ ta: "ஆசிரியர்", en: "Faculty" }, { ta: "கற்றல் உதவிகள்", en: "Study aids" }, StudyAids);
const QuestionsPanel = wrap({ ta: "ஆசிரியர்", en: "Faculty" }, { ta: "மாணவர் கேள்விகள்", en: "Student questions" }, Questions);

const mod = (id: string, title: Bi, about: Bi, component: ModuleDef["component"]): [string, ModuleDef] => [id, { id, title, about, component }];

export const GURU_MODULES: Record<string, ModuleDef> = Object.fromEntries([
  mod("guru.home", { ta: "குறிப்பேடுகள்", en: "Notebooks" }, { ta: "வணக்கம், கேள்விப் பெட்டி, குறிப்பேடுகள்", en: "Greeting, ask box and your notebooks" }, Home),
  mod("guru.continue", { ta: "சமீபத்திய கேள்விகள்", en: "Recent questions" }, { ta: "ஒரே அழுத்தத்தில் மீண்டும் கேள்", en: "Ask again in one press" }, Continue),
  mod("guru.ask", { ta: "கேள்", en: "Ask" }, { ta: "மூலங்களுடன் பதில்கள்", en: "Cited answers and “not in your notes”" }, Ask),
  mod("guru.page", { ta: "மூலக் காட்சி", en: "Source viewer" }, { ta: "திறந்த மூலம், சரிபார்த்த பகுதியுடன்", en: "The open source with its verified span" }, PageViewer),
  mod("guru.practice", { ta: "பயிற்சி", en: "Practice" }, { ta: "பழைய வினாக்கள், சுருக்கம், தேர்வு", en: "Past papers, summary and quiz, as tabs" }, Practice),
  mod("guru.past", { ta: "பழைய வினாக்கள்", en: "Past papers" }, { ta: "விடை எழுதி ஒப்பிடு", en: "Try an answer, then compare" }, PastPanel),
  mod("guru.tiers", { ta: "சுருக்கம்", en: "Summary" }, { ta: "IV, II/IIA, I", en: "Group IV, II/IIA and I depths" }, TiersPanel),
  mod("guru.quiz", { ta: "விரைவுத் தேர்வு", en: "Quick quiz" }, { ta: "தவறுகளுக்கு விளக்கம்", en: "Explanations for wrong answers" }, QuizPanel),
  mod("guru.vaathi", { ta: "வாத்தி", en: "Vaathi" }, { ta: "அடுத்த பாடம்", en: "Progress and the next lesson" }, Vaathi),
  mod("guru.glossary", { ta: "சொற்களஞ்சியம்", en: "Glossary" }, { ta: "தமிழ் – ஆங்கிலம்", en: "Tamil – English terms" }, Glossary),
  mod("guru.history", { ta: "வரலாறு", en: "History" }, { ta: "இந்தச் சாதனத்தில் மட்டும்", en: "Questions and quizzes, on this device" }, History),
  mod("guru.faculty", { ta: "குறிப்பேடு (ஆசிரியர்)", en: "Notebook (faculty)" }, { ta: "மூலங்கள், உதவிகள், கேள்விகள்", en: "Sources, study aids and questions, as tabs" }, Faculty),
  mod("guru.sources", { ta: "மூலங்கள்", en: "Sources" }, { ta: "பதிவேற்றமும் நிலையும்", en: "Upload and status" }, SourcesPanel),
  mod("guru.drafts", { ta: "கற்றல் உதவிகள்", en: "Study aids" }, { ta: "இயந்திர வரைவுகளை ஒப்புக்கொள்", en: "Approve machine drafts" }, AidsPanel),
  mod("guru.questions", { ta: "மாணவர் கேள்விகள்", en: "Student questions" }, { ta: "கொடிகளும் பலவீனப் பகுதிகளும்", en: "Flags and weak areas" }, QuestionsPanel),
  mod("guru.sharing", { ta: "பகிர்வு", en: "Sharing" }, { ta: "யார் திறக்கலாம்", en: "Who can open the notebook" }, Sharing),
  mod("guru.languages", { ta: "பதில் மொழிகள்", en: "Answer languages" }, { ta: "தமிழ், English, Tanglish", en: "Tamil, English and Tanglish" }, Languages),
]);

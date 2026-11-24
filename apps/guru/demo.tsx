"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SampleTag, TypingDots } from "@yazhi/bubble";
import { streamOnDevice } from "@yazhi/bubble/lib/runtime";
import { uid, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import type { Bi } from "@yazhi/workspace/types";
import { DEMO_CORPUS_VERSION, type DemoChunk } from "./demo-corpus";
import { DEMO_LESSONS, DEMO_STARTERS, answer, answerChunk, groundedPrompt, type DemoAnswer } from "./demo-retrieval";

/* Guru chat demo — a bubble chat over the Guru Group IV lesson notes.

   Answers are lesson chunks shown as written (demo-retrieval.ts). With
   NEXT_PUBLIC_GURU_DEMO_RUNTIME=device the same retrieved notes are handed
   to the on-device model (the Bubble UI's local endpoint, default
   http://localhost:8080/v1) to phrase a reply; any failure falls back to the
   verbatim notes. No cloud call, no key. */

type Runtime = "scripted" | "device";
const RUNTIME: Runtime = process.env.NEXT_PUBLIC_GURU_DEMO_RUNTIME === "device" ? "device" : "scripted";
const DEVICE_MODEL = "adhan-kutty";
/** a short think, so the typing bubble is seen even on instant answers */
const THINK_MS = 650;

/** ask a question, or open one chunk by id (the label is what the learner sees) */
type Ask = (q: string, chunkId?: string) => void;

interface Turn {
  id: string;
  q: string;
  pending: boolean;
  answer?: DemoAnswer;
  /** model text, when the device runtime answered */
  model?: string;
  /** the device runtime failed and the notes are shown instead */
  fellBack?: boolean;
}

/** Tamil first, English beneath — every label in the demo. */
function Pair({ b, className = "" }: { b: Bi; className?: string }) {
  return (
    <span className={`flex flex-col ${className}`}>
      <span lang="ta">{b.ta}</span>
      <span lang="en" className="text-[0.85em] text-ivory-dim">
        {b.en}
      </span>
    </span>
  );
}

const S = {
  title: { ta: "குருவிடம் கேளுங்கள் · டெமோ", en: "Ask Guru · demo" },
  sub: { ta: "TNPSC குரூப் IV · நான்கு மாதிரிப் பாடங்களின் குறிப்புகளிலிருந்து மட்டும்", en: "TNPSC Group IV · answers only from four sample lessons' notes" },
  warn: {
    ta: "இது டெமோ. பதில்கள் குருவின் வரைவுப் பாடக் குறிப்புகள் (v0.1) — அதிகாரப்பூர்வ TNPSC பொருள் அல்ல. தேர்வுக்கு முன் ஒவ்வொன்றையும் பாடநூலுடன் சரிபாருங்கள்.",
    en: "This is a demo. Answers are Guru's draft lesson notes (v0.1), not official TNPSC material — check each one against the textbook before relying on it.",
  },
  hello: {
    ta: "வணக்கம்! நான் குரு. குரூப் IV பாடக் குறிப்புகளிலிருந்து பதில் சொல்வேன் — எந்தப் பாடம், எந்தப் பகுதி என்று குறிப்பிட்டு. குறிப்புகளில் இல்லையெனில் ஊகிக்க மாட்டேன்.",
    en: "Vanakkam! I'm Guru. I answer from the Group IV lesson notes and name the lesson and section. If it isn't in the notes, I won't guess.",
  },
  try: { ta: "இவற்றில் ஒன்றைக் கேட்டுப் பாருங்கள்", en: "Try one of these" },
  placeholder: "கேளுங்கள் · Ask Guru",
  send: { ta: "அனுப்பு", en: "Send" },
  thinking: { ta: "குறிப்புகளில் தேடுகிறது…", en: "Searching the notes…" },
  notIn: { ta: "உங்கள் குறிப்புகளில் இல்லை.", en: "Not in Guru's notes." },
  notInMore: {
    ta: "இந்த நான்கு மாதிரிப் பாடங்களில் இதற்குப் பதில் இல்லை. ஊகித்துச் சொல்ல மாட்டேன் — உங்கள் ஆசிரியரிடம் கேளுங்கள்.",
    en: "The four sample lessons don't cover this. I won't guess — ask your teacher.",
  },
  closest: { ta: "அருகிலுள்ள பகுதிகள்", en: "Closest sections" },
  related: { ta: "தொடர்புடையவை", en: "Related" },
  review: { ta: "† குறியிட்ட வரிகள் இன்னும் ஆசிரியர் சரிபார்ப்பில் உள்ளன.", en: "Lines marked † are still awaiting faculty review." },
  from: { ta: "மூலம்", en: "Source" },
  fellBack: { ta: "சாதன மாதிரி பதிலளிக்கவில்லை — குறிப்புகள் அப்படியே கீழே.", en: "The on-device model didn't answer — the notes are shown as written." },
  model: { ta: "சாதன மாதிரி எழுதியது — கீழுள்ள குறிப்புகளுடன் ஒப்பிடுக.", en: "Phrased by the on-device model — compare with the notes below." },
  you: { ta: "நீங்கள்", en: "You" },
  guru: { ta: "குரு", en: "Guru" },
  clear: { ta: "புதிய உரையாடல்", en: "New chat" },
} satisfies Record<string, Bi | string>;

const runtimeLabel: Record<Runtime, Bi> = {
  scripted: { ta: "குறிப்புகள் அப்படியே · மாதிரி இல்லை", en: "Notes as written · no model" },
  device: { ta: "சாதன மாதிரி · குறிப்புகளுடன்", en: "On-device model · grounded in notes" },
};

/** One lesson chunk, as written, with where it comes from. */
function ChunkCard({ c }: { c: DemoChunk }) {
  return (
    <figure className="space-y-2">
      <div className="chat-md overflow-x-auto text-[0.9rem] [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ivory/10 [&_td]:p-1.5 [&_td]:align-top [&_th]:border [&_th]:border-ivory/10 [&_th]:p-1.5 [&_th]:text-left">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.text}</ReactMarkdown>
      </div>
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ivory/10 pt-2 text-[11px] text-ivory-dim">
        <span className="font-semibold text-[color:var(--accent)]">
          {S.from.ta} · {S.from.en}
        </span>
        <span lang="ta">{c.titleTa}</span>
        <span aria-hidden>·</span>
        <span>{c.section}</span>
        {c.subsection && (
          <>
            <span aria-hidden>·</span>
            <span>{c.subsection}</span>
          </>
        )}
        <code className="font-mono text-[10px] opacity-80">{c.id}</code>
      </figcaption>
    </figure>
  );
}

function GuruAvatar() {
  return (
    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--accent)] bg-night text-sm font-semibold text-[color:var(--accent)]" lang="ta">
      கு
    </span>
  );
}

/** Guru's side: a bubble on the left. */
function GuruBubble({ children, label }: { children: ReactNode; label: string }) {
  return (
    <li className="flex items-end gap-2" aria-label={label}>
      <GuruAvatar />
      <div className="max-w-[88%] min-w-0 rounded-2xl rounded-bl-md border border-ivory/10 bg-night-2 px-3.5 py-3 text-sm text-ivory shadow-sm sm:max-w-[80%]">{children}</div>
    </li>
  );
}

/** The learner's side: a filled bubble on the right. */
function LearnerBubble({ text, label }: { text: string; label: string }) {
  return (
    <li className="flex justify-end" aria-label={label}>
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[color:color-mix(in_oklab,var(--accent)_28%,transparent)] px-3.5 py-2 text-sm text-ivory sm:max-w-[70%]">{text}</div>
    </li>
  );
}

function Reply({ turn, onAsk }: { turn: Turn; onAsk: Ask }) {
  const a = turn.answer;
  if (!a) return null;
  const chips = (list: DemoChunk[], title: Bi) =>
    list.length > 0 && (
      <div className="mt-3 space-y-1.5">
        <p className="text-[11px] uppercase tracking-wide text-ivory-dim">
          {title.ta} · {title.en}
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {list.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onAsk(`${c.titleTa} — ${c.subsection ?? c.section}`, c.id)}
                className="min-h-9 rounded-full border border-ivory/15 px-3 py-1 text-left text-xs text-ivory-dim hover:border-[color:var(--accent)] hover:text-ivory"
              >
                <span lang="ta">{c.subsection ?? c.section}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  if (a.chunks.length === 0) {
    return (
      <>
        <p className="font-semibold">
          <span lang="ta">{S.notIn.ta}</span> <span className="text-ivory-dim">{S.notIn.en}</span>
        </p>
        <Pair b={S.notInMore} className="mt-1 gap-1" />
        {chips(a.related, S.closest)}
      </>
    );
  }
  return (
    <div className="space-y-3">
      {turn.fellBack && <Pair b={S.fellBack} className="rounded-lg border border-ivory/15 px-2.5 py-1.5 text-xs" />}
      {turn.model && (
        <div className="space-y-1.5">
          <div className="chat-md whitespace-pre-wrap text-[0.9rem]">{turn.model}</div>
          <Pair b={S.model} className="text-[11px] text-ivory-dim" />
        </div>
      )}
      {a.chunks.map((c) => (
        <ChunkCard key={c.id} c={c} />
      ))}
      {a.review && <Pair b={S.review} className="rounded-lg border border-dashed border-ivory/25 px-2.5 py-1.5 text-xs" />}
      {chips(a.related, S.related)}
    </div>
  );
}

function ChatDemo({ ctx }: { ctx: ModuleContext }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const threadRef = useRef<HTMLOListElement>(null);
  const busy = turns.some((x) => x.pending);

  useEffect(() => {
    // scroll the thread, not the page
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const ask: Ask = (raw, chunkId) => {
    const q = raw.trim();
    if (!q || busy) return;
    const id = uid("gd");
    setTurns((ts) => [...ts, { id, q, pending: true }]);
    setDraft("");
    setStatus(`${S.thinking.ta} ${S.thinking.en}`);
    const a = chunkId ? answerChunk(chunkId) : answer(q);
    ctx.log(`Demo: asked “${q.slice(0, 80)}”`, a.chunks.map((c) => c.id));
    const done = (patch: Partial<Turn>) => {
      setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, answer: a, ...patch } : x)));
      setStatus(a.chunks.length ? `${a.chunks.length} · ${S.from.en}: ${a.chunks.map((c) => c.id).join(", ")}` : `${S.notIn.ta} ${S.notIn.en}`);
    };
    if (RUNTIME === "device" && a.chunks.length > 0) {
      let text = "";
      const ctl = new AbortController();
      streamOnDevice({
        model: DEVICE_MODEL,
        systemPrompt: groundedPrompt(a.chunks),
        history: [{ id, role: "user", content: q }],
        signal: ctl.signal,
        onText: (t) => {
          text += t;
        },
      })
        .then(() => done(text.trim() ? { model: text.trim() } : { fellBack: true }))
        .catch(() => done({ fellBack: true }));
      return;
    }
    window.setTimeout(() => done({}), THINK_MS);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  return (
    <section aria-labelledby="guru-demo-title" className="flex h-[calc(100dvh-9rem)] min-h-[30rem] flex-col sm:h-[min(82vh,56rem)] sm:min-h-[32rem] overflow-hidden rounded-2xl border border-ivory/10 border-l-2 border-l-[color:var(--accent)] bg-night-2/80">
      <header className="flex items-start gap-3 border-b border-ivory/10 px-3 py-3 sm:px-4">
        <GuruAvatar />
        <div className="min-w-0 flex-1">
          <h2 id="guru-demo-title" className="text-sm font-semibold text-ivory">
            <Pair b={S.title} />
          </h2>
          <p className="mt-0.5 hidden text-xs text-ivory-dim sm:block">
            <Pair b={S.sub} />
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="hidden sm:block">
            <SampleTag />
          </span>
          {turns.length > 0 && (
            <button type="button" onClick={() => setTurns([])} disabled={busy} className="min-h-9 rounded-full border border-ivory/15 px-3 text-[11px] text-ivory-dim hover:text-ivory disabled:opacity-50">
              {S.clear.ta} · {S.clear.en}
            </button>
          )}
        </div>
      </header>

      <p role="note" className="border-b border-ivory/10 bg-night/60 px-3 py-2 text-[10px] leading-snug sm:text-[11px] sm:leading-relaxed text-ivory-dim sm:px-4">
        <span lang="ta" className="block text-ivory">
          ⚠ {S.warn.ta}
        </span>
        <span lang="en" className="block">
          {S.warn.en}
        </span>
      </p>

      <ol ref={threadRef} className="chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4" data-lenis-prevent aria-live="polite" aria-label={`${S.guru.ta} · ${S.guru.en}`}>
        <GuruBubble label={S.guru.en}>
          <Pair b={S.hello} className="gap-1.5 leading-relaxed" />
        </GuruBubble>
        {turns.length === 0 && (
          <li>
            <p className="mb-2 pl-10 text-xs text-ivory-dim">
              {S.try.ta} · {S.try.en}
            </p>
            <ul className="flex flex-col gap-2 pl-10 sm:flex-row sm:flex-wrap">
              {DEMO_STARTERS.map((s) => (
                <li key={s.q.en}>
                  <button
                    type="button"
                    onClick={() => ask(s.q.ta)}
                    className="w-full rounded-2xl border border-ivory/15 bg-night/40 px-3 py-2 text-left text-xs text-ivory hover:border-[color:var(--accent)] sm:w-auto"
                  >
                    <Pair b={s.q} />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        )}
        {turns.map((turn) => (
          <TurnView key={turn.id} turn={turn} onAsk={ask} />
        ))}
      </ol>

      <p className="sr-only" role="status">
        {status}
      </p>

      <form onSubmit={submit} className="flex items-end gap-2 border-t border-ivory/10 bg-night/50 px-3 py-3 sm:px-4">
        <label htmlFor="guru-demo-input" className="sr-only">
          {S.placeholder}
        </label>
        <textarea
          id="guru-demo-input"
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(draft);
            }
          }}
          placeholder={S.placeholder}
          className="min-h-11 flex-1 resize-none rounded-2xl border border-ivory/15 bg-night px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory-dim focus:border-[color:var(--accent)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim() || busy}
          className="min-h-11 shrink-0 rounded-full bg-[color:var(--accent)] px-4 text-sm font-semibold text-night disabled:opacity-40"
        >
          {S.send.ta}
          <span className="sr-only"> · {S.send.en}</span>
        </button>
      </form>
      <p className="px-3 pb-2 text-[10px] text-ivory-dim sm:px-4">
        {runtimeLabel[RUNTIME].ta} · {runtimeLabel[RUNTIME].en} · corpus {DEMO_CORPUS_VERSION}
      </p>
    </section>
  );
}

function TurnView({ turn, onAsk }: { turn: Turn; onAsk: Ask }) {
  return (
    <>
      <LearnerBubble text={turn.q} label={S.you.en} />
      <GuruBubble label={S.guru.en}>
        {turn.pending ? (
          <span className="flex items-center gap-2 text-xs text-ivory-dim">
            <TypingDots />
            <span>
              {S.thinking.ta} · {S.thinking.en}
            </span>
          </span>
        ) : (
          <Reply turn={turn} onAsk={onAsk} />
        )}
      </GuruBubble>
    </>
  );
}

/** What the demo knows: the four lessons and how answers are made. */
function DemoAbout() {
  return (
    <section aria-labelledby="guru-demo-about" className="space-y-3 rounded-2xl border border-ivory/10 bg-night-2/80 p-4 text-sm text-ivory">
      <h2 id="guru-demo-about" className="font-semibold">
        <Pair b={{ ta: "டெமோ எதிலிருந்து பதில் சொல்கிறது", en: "What the demo answers from" }} />
      </h2>
      <ul className="space-y-2">
        {DEMO_LESSONS.map((l) => (
          <li key={l.id} className="rounded-xl border border-ivory/10 px-3 py-2">
            <Pair b={{ ta: l.titleTa, en: l.titleEn }} className="text-xs" />
            <p className="mt-1 text-[11px] text-ivory-dim">
              {l.chunks} chunks · {l.review} † · {l.exam}
            </p>
          </li>
        ))}
      </ul>
      <Pair
        b={{
          ta: "பதில்கள் பாடக் குறிப்புகளின் பகுதிகள் — அப்படியே. புதிய தகவல் எதுவும் சேர்க்கப்படுவதில்லை. பிற பாடங்கள் இன்னும் எழுதப்படவில்லை.",
          en: "Answers are sections of the lesson notes, shown as written. Nothing new is added. Other units are not written yet.",
        }}
        className="gap-1 text-xs"
      />
    </section>
  );
}

const mod = (id: string, title: Bi, about: Bi, component: ModuleDef["component"]): [string, ModuleDef] => [id, { id, title, about, component }];

export const GURU_DEMO_MODULES: Record<string, ModuleDef> = Object.fromEntries([
  mod("guru.demo", { ta: "குருவிடம் கேள் (டெமோ)", en: "Ask Guru (demo)" }, { ta: "குமிழ் உரையாடல், பாடக் குறிப்புகளிலிருந்து", en: "Bubble chat over the lesson notes" }, ChatDemo),
  mod("guru.demo-about", { ta: "டெமோ மூலங்கள்", en: "Demo sources" }, { ta: "நான்கு பாடங்கள், பதில் முறை", en: "The four lessons and how answers are made" }, DemoAbout),
]);

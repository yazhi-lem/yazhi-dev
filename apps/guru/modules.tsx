"use client";
import { useState } from "react";
import { Composer, MachineDraft, PageChip, Panel, Pill, SampleTag, Segmented, TypingDots, UploadCard, type UploadItem } from "@yazhi/bubble";
import { uid, useShared, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import { BANK, BOOKS, CHAPTERS, CLASS, GLOSSARY, PAGES, QUIZ, SUGGESTIONS, findAnswer, tierLabel, type Tier } from "./samples";

/* Shared state across Guru's views (lives for the tab): the open GuruBook,
   the open page, the notebook thread, approvals and the last quiz. */
const useBook = () => useShared("guru.book", "g4");
const usePage = () => useShared<string | null>("guru.page", null);
const useApproved = () => useShared<Record<string, string>>("guru.approved", {});

type Turn = { id: string; q: string; answer?: string | null; pending?: boolean };

const bookTitle = (ctx: ModuleContext, id: string) => ctx.t(BOOKS.find((b) => b.id === id)?.title ?? id);

/* --------------------------------------------------------- notebook */

function Notebook({ ctx }: { ctx: ModuleContext }) {
  const { t, lang } = ctx;
  const [book] = useBook();
  const [page, setPage] = usePage();
  const [turns, setTurns] = useShared<Turn[]>("guru.thread", []);

  const ask = (q: string) => {
    const id = uid();
    setTurns((ts) => [...ts, { id, q, pending: true }]);
    // the note agent answers through yazhi-api in the product; the demo
    // answers from the fixtures after a short think
    window.setTimeout(() => {
      const hit = findAnswer(q);
      setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, answer: hit?.id ?? null } : x)));
    }, 650);
  };

  return (
    <Panel accentEdge eyebrow={t({ ta: "குறிப்பேடு", en: "Notebook" })} title={bookTitle(ctx, book)} actions={<SampleTag />}>
      <div className="chat-scroll max-h-[34rem] space-y-5 overflow-y-auto pr-1" data-lenis-prevent aria-live="polite">
        {turns.length === 0 && (
          <p className="text-sm text-ivory-dim">
            {t({ ta: "இந்தக் குருநூலில் உள்ளதைப் பற்றி மட்டுமே பதில் சொல்வேன் — பக்கத்துடன்.", en: "I answer only from this GuruBook — with the page." })}
          </p>
        )}
        {turns.map((turn) => {
          const hit = turn.answer ? findAnswerById(turn.answer) : undefined;
          return (
            <div key={turn.id} className="space-y-2">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">{turn.q}</div>
              <div className="max-w-[92%] text-sm leading-relaxed text-ivory">
                {turn.pending ? (
                  <TypingDots />
                ) : hit ? (
                  <>
                    <p>
                      {hit.parts.map((p, i) => (
                        <span key={i}>{t(p.text)} </span>
                      ))}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {[...new Set(hit.parts.map((p) => p.page))].map((pid) => (
                        <PageChip key={pid} book={bookTitle(ctx, PAGES[pid].book)} page={`p. ${PAGES[pid].page}`} active={page === pid} onOpen={() => setPage(pid)} />
                      ))}
                      <SampleTag />
                    </div>
                  </>
                ) : (
                  <div role="note" className="rounded-xl border border-gold/40 bg-gold/5 p-3">
                    <p className="font-semibold">
                      <span lang="ta">இந்நூல்களில் இல்லை</span> · Not in these sources
                    </p>
                    <p className="mt-1 text-ivory-dim">
                      {t({
                        ta: "இந்தக் குருநூலின் எந்தப் பக்கத்திலும் இதற்கான பதில் இல்லை. ஊகித்துச் சொல்ல மாட்டேன்.",
                        en: "No page of this GuruBook answers this. I won't guess.",
                      })}
                    </p>
                    <p className="mt-2 text-xs text-ivory-dim">
                      {t({ ta: "உங்கள் ஆசிரியரிடம் கேளுங்கள், அல்லது பாடத்தின் பெயருடன் மீண்டும் கேளுங்கள்.", en: "Ask your teacher, or ask again naming the chapter." })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.en}
            type="button"
            onClick={() => ask(t(s))}
            className="min-h-9 rounded-full border border-ivory/15 px-3 text-left text-xs text-ivory-dim hover:border-[color:var(--accent)]/60 hover:text-ivory"
          >
            {t(s)}
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-ivory/10 pt-3">
        <Composer onSend={ask} placeholder={lang === "ta" ? "குருநூலிடம் தமிழில் கேளுங்கள்…" : "Ask the GuruBook…"} />
      </div>
    </Panel>
  );
}

const findAnswerById = (id: string) => BANK.find((a) => a.id === id);

/** The cited page, beside the answer, with the span the answer rests on. */
function PageViewer({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [pid, setPage] = usePage();
  const p = pid ? PAGES[pid] : null;
  return (
    <Panel eyebrow={t({ ta: "பக்கம்", en: "Page" })} title={p ? `${bookTitle(ctx, p.book)} · p. ${p.page}` : t({ ta: "பக்கம் எதுவும் திறக்கப்படவில்லை", en: "No page open" })}>
      {p ? (
        <article className="space-y-2">
          <h4 className="text-sm font-semibold text-ivory">{t(p.heading)}</h4>
          <p className="rounded-lg border-l-2 border-[color:var(--accent)] bg-[color:var(--accent)]/5 p-3 text-sm leading-relaxed text-ivory">{t(p.text)}</p>
          <p className="flex flex-wrap items-center gap-2 text-[11px] text-ivory-dim">
            <Pill tone="ok" title="The citation verifier found the cited span in the stored page">✓ span verified</Pill>
            {t({ ta: "உள்ளூர் நகல் · நிறுவனக் கணினி", en: "Local copy · institute machine" })}
          </p>
          <button type="button" onClick={() => setPage(null)} className="min-h-9 text-xs text-ivory-dim hover:text-ivory">
            {t({ ta: "மூடு", en: "Close" })}
          </button>
        </article>
      ) : (
        <p className="text-sm text-ivory-dim">{t({ ta: "பதிலின் கீழ் உள்ள பக்கச் சுட்டியை அழுத்துங்கள்.", en: "Press a page chip under an answer to open it here." })}</p>
      )}
    </Panel>
  );
}

function Books({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [book, setBook] = useBook();
  return (
    <Panel eyebrow={t({ ta: "குருநூல்கள்", en: "GuruBooks" })} title={t({ ta: "இந்த நிறுவனத்தின் நூல்கள்", en: "This institute's books" })}>
      <ul className="space-y-2">
        {BOOKS.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              aria-pressed={book === b.id}
              disabled={b.state !== "indexed"}
              onClick={() => setBook(b.id)}
              className={`w-full rounded-xl border p-3 text-left transition disabled:opacity-60 ${
                book === b.id ? "border-[color:var(--accent)]/70 bg-[color:var(--accent)]/10" : "border-ivory/10 bg-night/60 hover:border-ivory/25"
              }`}
            >
              <p className="text-sm font-semibold text-ivory">{t(b.title)}</p>
              <p className="mt-0.5 text-xs text-ivory-dim">{t(b.sources)}</p>
              <p className="mt-1.5 flex items-center gap-2 text-[11px] text-ivory-dim">
                {b.pages} {t({ ta: "பக்கங்கள்", en: "pages" })}
                <Pill tone={b.state === "indexed" ? "ok" : "info"}>{b.state === "indexed" ? "indexed" : "reading · OCR"}</Pill>
              </p>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------------------------------------ tiers */

function Tiers({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [chapterId, setChapter] = useShared("guru.chapter", CHAPTERS[0].id);
  const [tier, setTier] = useShared<Tier>("guru.tier", "IV");
  const [, setPage] = usePage();
  const [approved] = useApproved();
  const ch = CHAPTERS.find((c) => c.id === chapterId) ?? CHAPTERS[0];
  const body = ch.tiers[tier];
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <Panel accentEdge eyebrow={t(ch.unit)} title={t(ch.title)} actions={<MachineDraft approvedBy={approved[body.draftId]} />}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label={t({ ta: "பாடம்", en: "Chapter" })}
          value={ch.id}
          onChange={(v) => {
            setChapter(v);
            setOpen({});
          }}
          options={CHAPTERS.map((c) => ({ value: c.id, label: t(c.title) }))}
        />
        <Segmented
          label={t({ ta: "நிலை", en: "Tier" })}
          value={tier}
          onChange={(v) => {
            setTier(v);
            setOpen({});
            ctx.log(`Tier switched to ${tierLabel[v].en} — ${ch.title.en}`);
          }}
          options={(["IV", "II", "I"] as Tier[]).map((x) => ({ value: x, label: t(tierLabel[x]) }))}
        />
      </div>
      <h4 className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">
        {tier === "IV" ? t({ ta: "சுருக்கக் குறிப்பு", en: "Short note" }) : tier === "II" ? t({ ta: "அமைப்புக் குறிப்பு", en: "Structured note" }) : t({ ta: "முதன்மைத் தேர்வு வரைவு", en: "Mains outline" })}
      </h4>
      <ul className="mt-2 space-y-1.5 text-sm text-ivory">
        {body.note.map((n, i) => (
          <li key={i} className="rounded-lg bg-night/60 px-3 py-2">
            {t(n)}
          </li>
        ))}
      </ul>
      <h4 className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">
        {tier === "IV" ? t({ ta: "வினாக்கள் (10 இல் மாதிரி)", en: "MCQs (sample of 10)" }) : tier === "II" ? t({ ta: "குறு வினாக்கள்", en: "Short answers" }) : t({ ta: "முதன்மை வினா", en: "Mains question" })}
      </h4>
      <ol className="mt-2 space-y-2">
        {body.items.map((it, i) => (
          <li key={i} className="rounded-lg border border-ivory/10 p-3 text-sm">
            <p className="text-ivory">{t(it.q)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {it.a && (
                <button type="button" onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))} className="min-h-8 text-xs text-[color:var(--accent)] hover:underline">
                  {open[i] ? t(it.a) : t({ ta: "விடையைக் காட்டு", en: "Show answer" })}
                </button>
              )}
              <PageChip book={bookTitle(ctx, PAGES[it.page].book)} page={`p. ${PAGES[it.page].page}`} onOpen={() => setPage(it.page)} />
            </div>
          </li>
        ))}
      </ol>
      {tier === "I" && (
        <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: "குரு வரைவு தருகிறது; விடையை நீங்களே எழுதுங்கள்.", en: "Guru outlines; you write the answer yourself." })}</p>
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
            <dd className="text-ivory-dim">{g.en}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* ------------------------------------------------------------- quiz */

type QuizResult = { picks: Record<string, number>; submitted: boolean };

function Quiz({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [r, setR] = useShared<QuizResult>("guru.quiz", { picks: {}, submitted: false });
  const [, setPage] = usePage();
  const score = QUIZ.filter((q) => r.picks[q.id] === q.answer).length;
  const all = QUIZ.every((q) => r.picks[q.id] !== undefined);
  return (
    <Panel
      accentEdge
      eyebrow={t({ ta: "பயிற்சித் தேர்வு · குரூப் IV", en: "Practice quiz · Group IV" })}
      title={t({ ta: "சோழர் நிர்வாகம், அடிப்படை உரிமைகள்", en: "Chola administration, fundamental rights" })}
      actions={r.submitted ? <Pill tone={score >= 4 ? "ok" : "warn"}>{score}/{QUIZ.length}</Pill> : <SampleTag />}
    >
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
                        <input
                          type="radio"
                          name={q.id}
                          checked={chosen}
                          disabled={r.submitted}
                          onChange={() => setR((x) => ({ ...x, picks: { ...x.picks, [q.id]: oi } }))}
                          className="accent-[var(--gold)]"
                        />
                        <span className="text-ivory">{t(o)}</span>
                        {r.submitted && oi === q.answer && <span className="ml-auto text-xs text-mullai">✓</span>}
                        {r.submitted && chosen && !right && <span className="ml-auto text-xs text-palai">✕</span>}
                      </label>
                    );
                  })}
                </div>
                {r.submitted && !right && (
                  <details className="mt-2 rounded-lg border border-gold/40 bg-gold/5 p-3 text-sm">
                    <summary className="cursor-pointer text-ivory">{t({ ta: "ஏன் தவறு?", en: "Why was this wrong?" })}</summary>
                    <p className="mt-1 text-ivory-dim">{t(q.why)}</p>
                    <div className="mt-2">
                      <PageChip book={bookTitle(ctx, PAGES[q.page].book)} page={`p. ${PAGES[q.page].page}`} onOpen={() => setPage(q.page)} />
                    </div>
                  </details>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        {!r.submitted ? (
          <button
            type="button"
            disabled={!all}
            onClick={() => {
              setR((x) => ({ ...x, submitted: true }));
              ctx.log(`Quiz submitted: ${score}/${QUIZ.length}`, QUIZ.filter((q) => r.picks[q.id] !== q.answer).map((q) => `p. ${PAGES[q.page].page}`));
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
    </Panel>
  );
}

/** Vaathi — progress and the next lesson, from the last quiz. */
function Vaathi({ ctx }: { ctx: ModuleContext }) {
  const { t, Link, href } = ctx;
  const [r] = useShared<QuizResult>("guru.quiz", { picks: {}, submitted: false });
  const [, setChapter] = useShared("guru.chapter", CHAPTERS[0].id);
  const [, setTier] = useShared<Tier>("guru.tier", "IV");
  const misses = QUIZ.filter((q) => r.submitted && r.picks[q.id] !== q.answer);
  const weak = [...new Set(misses.map((q) => q.topic))];
  const next = CHAPTERS.find((c) => c.id === weak[0]);
  return (
    <Panel eyebrow="Vaathi" title={t({ ta: "அடுத்த பாடம்", en: "Next lesson" })}>
      {!r.submitted ? (
        <p className="text-sm text-ivory-dim">{t({ ta: "தேர்வைச் சமர்ப்பித்த பின் உங்கள் பலவீனப் பகுதியிலிருந்து அடுத்த பாடத்தைச் சொல்வேன்.", en: "Submit the quiz and I'll suggest the next lesson from your weakest area." })}</p>
      ) : next ? (
        <div className="space-y-2 text-sm">
          <p className="text-ivory">
            {t({ ta: "மீண்டும் படிக்க:", en: "Revise next:" })} <strong>{t(next.title)}</strong>
          </p>
          <p className="text-xs text-ivory-dim">
            {misses.length} {t({ ta: "தவறுகள் இந்தப் பாடத்திலிருந்து. குரூப் IV குறிப்பிலிருந்து தொடங்குங்கள்.", en: "misses came from here. Start from the Group IV note." })}
          </p>
          <span
            onClickCapture={() => {
              setChapter(next.id);
              setTier("IV");
            }}
          >
            <Link href={href("tiers")} className="inline-flex min-h-10 items-center rounded-full border border-[color:var(--accent)]/60 px-4 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10">
              {t({ ta: "பாடத்தைத் திற", en: "Open the lesson" })} →
            </Link>
          </span>
        </div>
      ) : (
        <p className="text-sm text-ivory">{t({ ta: "எல்லாம் சரி. அடுத்த அலகுக்குச் செல்லலாம்.", en: "All correct. On to the next unit." })}</p>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------- teacher */

function Upload({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [items, setItems] = useShared<UploadItem[]>("guru.uploads", []);
  const onFiles = (files: File[]) => {
    const fresh = files.map((f, i) => ({ id: uid(`u${i}-`), name: f.name, size: f.size, status: "reading" as const, note: "OCR · ta/en" }));
    setItems((xs) => [...fresh, ...xs]);
    fresh.forEach((f) => ctx.log(`Uploaded ${f.name} to the Institute notes GuruBook`));
    // the files stay in this browser tab: the demo reads only name and size
    window.setTimeout(() => setItems((xs) => xs.map((x) => (fresh.some((f) => f.id === x.id) ? { ...x, status: "ready", note: "indexed" } : x))), 1400);
  };
  return (
    <Panel accentEdge eyebrow={t({ ta: "பதிவேற்றம்", en: "Upload" })} title={t({ ta: "நிறுவனக் குறிப்புகள் — அலகு 8", en: "Institute notes — Unit 8" })}>
      <UploadCard
        title={t({ ta: "PDF அல்லது பக்கப் படங்களை இங்கே இழுத்துவிடுங்கள்", en: "Drop PDFs or photos of pages here" })}
        hint={t({ ta: "தமிழ், ஆங்கில OCR நிறுவனக் கணினியிலேயே நடக்கும். கோப்புகள் வெளியே அனுப்பப்படாது.", en: "Tamil and English OCR runs on the institute machine. Files are not sent anywhere." })}
        accept=".pdf,image/*"
        items={items}
        onFiles={onFiles}
        consent={t({
          ta: "இந்தப் பொருள் இந்த நிறுவனத்துடையது அல்லது பயன்படுத்த அனுமதி உள்ளது; இது நிறுவனத்துக்குள் மட்டுமே இருக்கும்.",
          en: "This material is the institute's own, or the institute may use it; it stays inside the institute.",
        })}
      />
    </Panel>
  );
}

const DRAFTS = [
  { id: "chola-IV", what: { ta: "சோழர் நிர்வாகம் · குரூப் IV குறிப்பும் வினாக்களும்", en: "Chola administration · Group IV note and MCQs" } },
  { id: "chola-II", what: { ta: "சோழர் நிர்வாகம் · குரூப் II/IIA அமைப்புக் குறிப்பு", en: "Chola administration · Group II/IIA structured note" } },
  { id: "chola-I", what: { ta: "சோழர் நிர்வாகம் · குரூப் I வரைவு", en: "Chola administration · Group I outline" } },
  { id: "rights-IV", what: { ta: "அடிப்படை உரிமைகள் · குரூப் IV குறிப்பு", en: "Fundamental rights · Group IV note" } },
];

function Drafts({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [approved, setApproved] = useApproved();
  const [rejected, setRejected] = useShared<string[]>("guru.rejected", []);
  const pending = DRAFTS.filter((d) => !approved[d.id] && !rejected.includes(d.id)).length;
  return (
    <Panel eyebrow={t({ ta: "இயந்திர வரைவுகள்", en: "Machine drafts" })} title={t({ ta: "ஒப்புதலுக்குக் காத்திருப்பவை", en: "Waiting for your approval" })} actions={<Pill tone={pending ? "warn" : "ok"}>{pending} pending</Pill>}>
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
                      setApproved((a) => ({ ...a, [d.id]: "Teacher · demo" }));
                      ctx.log(`Approved machine draft: ${d.what.en}`, [d.id]);
                    }}
                    className="min-h-10 rounded-full bg-gold px-4 text-xs font-semibold text-night hover:bg-bronze"
                  >
                    {t({ ta: "ஒப்புக்கொள்", en: "Approve" })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejected((r) => [...r, d.id]);
                      ctx.log(`Rejected machine draft: ${d.what.en}`, [d.id]);
                    }}
                    className="min-h-10 rounded-full border border-ivory/20 px-4 text-xs text-ivory-dim hover:border-palai/60 hover:text-ivory"
                  >
                    {t({ ta: "நிராகரி", en: "Reject" })}
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: "ஒப்புக்கொள்ளும் வரை மாணவர்கள் “இயந்திர வரைவு” குறியைப் பார்ப்பார்கள்.", en: "Until approved, aspirants see the machine-draft badge." })}</p>
    </Panel>
  );
}

function ClassView({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  return (
    <Panel eyebrow={t({ ta: "வகுப்பு", en: "Class" })} title={`${t({ ta: "தொகுதி 1", en: "Batch 1" })} · ${CLASS.aspirants} ${t({ ta: "தேர்வர்கள்", en: "aspirants" })}`} actions={<SampleTag />}>
      <ul className="space-y-3">
        {CLASS.topics.map((x) => {
          const pct = Math.round(x.correct * 100);
          const weak = pct < 60;
          return (
            <li key={x.id} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-ivory">{t(x.label)}</span>
                <span className={weak ? "text-palai" : "text-ivory-dim"}>
                  {pct}% · {x.attempted} {t({ ta: "முயற்சி", en: "tried" })}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ivory/10" role="img" aria-label={`${pct}% correct`}>
                <div className={`h-full rounded-full ${weak ? "bg-palai" : "bg-[color:var(--accent)]"}`} style={{ width: `${pct}%` }} />
              </div>
              {weak && <p className="mt-1 text-[11px] text-palai">{t({ ta: "பலவீனப் பகுதி", en: "Weak area" })}</p>}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export const GURU_MODULES: Record<string, ModuleDef> = {
  "guru.notebook": { id: "guru.notebook", title: { ta: "குறிப்பேடு", en: "Notebook" }, about: { ta: "பக்கச் சுட்டியுடன் பதில்கள்", en: "Cited answers with page chips" }, component: Notebook },
  "guru.page": { id: "guru.page", title: { ta: "பக்கக் காட்சி", en: "Page viewer" }, about: { ta: "சுட்டிய பக்கம், சரிபார்த்த பகுதியுடன்", en: "The cited page with its verified span" }, component: PageViewer },
  "guru.books": { id: "guru.books", title: { ta: "குருநூல்கள்", en: "GuruBooks" }, about: { ta: "நிறுவனத்தின் நூல்கள்", en: "Pick the institute's GuruBook" }, component: Books },
  "guru.tiers": { id: "guru.tiers", title: { ta: "நிலைக் குறிப்புகள்", en: "Tiered notes" }, about: { ta: "IV, II/IIA, I", en: "Group IV, II/IIA and I depths" }, component: Tiers },
  "guru.glossary": { id: "guru.glossary", title: { ta: "சொற்களஞ்சியம்", en: "Glossary" }, about: { ta: "தமிழ் – ஆங்கிலம்", en: "Tamil – English terms" }, component: Glossary },
  "guru.quiz": { id: "guru.quiz", title: { ta: "பயிற்சித் தேர்வு", en: "Practice quiz" }, about: { ta: "தவறுகளுக்கு விளக்கம்", en: "Explanations for wrong answers" }, component: Quiz },
  "guru.vaathi": { id: "guru.vaathi", title: { ta: "வாத்தி", en: "Vaathi" }, about: { ta: "அடுத்த பாடம்", en: "Progress and the next lesson" }, component: Vaathi },
  "guru.upload": { id: "guru.upload", title: { ta: "பதிவேற்றம்", en: "Upload" }, about: { ta: "குருநூலில் பொருள் சேர்", en: "Add material to a GuruBook" }, component: Upload },
  "guru.drafts": { id: "guru.drafts", title: { ta: "இயந்திர வரைவுகள்", en: "Machine drafts" }, about: { ta: "ஒப்புக்கொள், நிராகரி", en: "Approve or reject, logged" }, component: Drafts },
  "guru.class": { id: "guru.class", title: { ta: "வகுப்பு", en: "Class dashboard" }, about: { ta: "முயற்சிகள், பலவீனப் பகுதிகள்", en: "Topics attempted and weak areas" }, component: ClassView },
};

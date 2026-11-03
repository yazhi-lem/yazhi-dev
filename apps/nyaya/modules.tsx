"use client";
import { useState } from "react";
import { Composer, Disclaimer, HandoffCard, PageChip, Panel, Pill, SampleTag, SourceCard, TypingDots, UploadCard, type UploadItem } from "@yazhi/bubble";
import { uid, useShared, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import { AGREEMENT, ASK_CHIPS, ELIGIBILITY, SAMPLE_FACTS, SAMPLE_SUMMARY, SECTIONS, findLegal } from "./samples";

const useSection = () => useShared<string | null>("nyaya.section", null);

type Turn = { id: string; q: string; pending: boolean; result?: ReturnType<typeof findLegal> };

function download(name: string, type: string, body: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* -------------------------------------------------------------- ask */

function Ask({ ctx }: { ctx: ModuleContext }) {
  const { t, lang } = ctx;
  const [turns, setTurns] = useShared<Turn[]>("nyaya.thread", []);
  const [section, setSection] = useSection();
  const ask = (q: string) => {
    const id = uid();
    setTurns((ts) => [...ts, { id, q, pending: true }]);
    window.setTimeout(() => {
      const result = findLegal(q);
      setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, result } : x)));
      if (result.kind === "answer") ctx.log(`Answered with citations`, [...new Set(result.a.steps.map((s) => `${SECTIONS[s.cite].title} ${SECTIONS[s.cite].locator}`))]);
      else ctx.log(result.kind === "advice" ? "Declined: asks for advice — handed to legal aid" : "Declined: no matching Act text — handed to legal aid");
    }, 650);
  };
  const placeholder = lang === "te" ? "చట్టం గురించి తెలుగులో అడగండి…" : lang === "ta" ? "சட்டம் பற்றித் தமிழில் கேளுங்கள்…" : "Ask about a law…";
  return (
    <Panel accentEdge eyebrow="Nyaya" title={t({ ta: "சட்டத் தகவல், பிரிவுடன்", en: "Legal information, with the section", te: "చట్ట సమాచారం, సెక్షన్‌తో" })} actions={<SampleTag />}>
      <div className="chat-scroll max-h-[34rem] space-y-5 overflow-y-auto pr-1" data-lenis-prevent aria-live="polite">
        {turns.length === 0 && <Disclaimer kind="legal" />}
        {turns.map((turn) => (
          <div key={turn.id} className="space-y-2">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">{turn.q}</div>
            <div className="max-w-[92%] text-sm leading-relaxed text-ivory">
              {turn.pending ? (
                <TypingDots />
              ) : turn.result?.kind === "answer" ? (
                <>
                  <ol className="space-y-2">
                    {turn.result.a.steps.map((s, i) => {
                      const src = SECTIONS[s.cite];
                      return (
                        <li key={i} className="flex gap-2">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--accent)]/20 font-mono text-[10px] text-[color:var(--accent)]">{i + 1}</span>
                          <span>
                            {t(s.text)}{" "}
                            <PageChip book={src.title} page={src.locator} active={section === src.id} onOpen={() => setSection(src.id)} />
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Pill tone="ok" title="Every cited section was matched to stored Act text">100% matched</Pill>
                    <SampleTag />
                  </div>
                  <p className="mt-2 text-[11px] text-ivory-dim">
                    {t({ ta: "இது சட்டத் தகவல், ஆலோசனை அல்ல.", en: "This is legal information, not advice.", te: "ఇది చట్ట సమాచారం, సలహా కాదు." })}
                  </p>
                </>
              ) : (
                <HandoffCard
                  title={
                    lang === "en"
                      ? "I don't know"
                      : `${t({ ta: "எனக்கு உறுதியாகத் தெரியவில்லை", en: "I don't know", te: "నాకు ఖచ్చితంగా తెలియదు" })} · I don't know`
                  }
                  reason={
                    turn.result?.kind === "advice"
                      ? t({
                          ta: "இது உங்கள் வழக்குக்கான ஆலோசனை அல்லது உத்தி. நியாயா சட்டம் என்ன சொல்கிறது என்பதை மட்டுமே விளக்கும்.",
                          en: "This asks for advice or strategy on your case. Nyaya only explains what the law says.",
                          te: "ఇది మీ కేసుపై సలహా లేదా వ్యూహం అడుగుతోంది. న్యాయ చట్టం ఏమి చెబుతుందో మాత్రమే వివరిస్తుంది.",
                        })
                      : t({
                          ta: "ஏற்றப்பட்ட எந்தச் சட்டப் பிரிவுடனும் இதைப் பொருத்த முடியவில்லை, அதனால் சொல்ல மாட்டேன்.",
                          en: "I can't match this to a section of a loaded Act, so I won't state it.",
                          te: "లోడ్ చేసిన ఏ చట్ట సెక్షన్‌తోనూ దీన్ని సరిపోల్చలేకపోయాను, కాబట్టి చెప్పను.",
                        })
                  }
                  who={t({ ta: "மாவட்ட சட்டப் பணிகள் ஆணைக் குழு", en: "District Legal Services Authority", te: "జిల్లా న్యాయ సేవల ప్రాధికార సంస్థ" })}
                >
                  <p className="text-xs text-ivory-dim">NALSA helpline: <span className="font-mono text-ivory">15100</span></p>
                </HandoffCard>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ASK_CHIPS.map((c) => (
          <button key={c.en} type="button" onClick={() => ask(t(c))} className="min-h-9 rounded-full border border-ivory/15 px-3 text-left text-xs text-ivory-dim hover:border-[color:var(--accent)]/60 hover:text-ivory">
            {t(c)}
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-ivory/10 pt-3">
        <Composer onSend={ask} placeholder={placeholder} />
      </div>
    </Panel>
  );
}

function Citation({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [id] = useSection();
  const s = id ? SECTIONS[id] : null;
  return (
    <Panel eyebrow={t({ ta: "மேற்கோள்", en: "Citation", te: "ఉల్లేఖనం" })} title={s ? `${s.title} · ${s.locator}` : t({ ta: "பிரிவு திறக்கப்படவில்லை", en: "No section open", te: "సెక్షన్ తెరవలేదు" })}>
      {s ? (
        <div className="space-y-2">
          <SourceCard n={1} source={s} />
          <p className="text-[11px] text-ivory-dim">
            {t({ ta: "மேற்கோள் சரிபார்ப்பி: பிரிவு சேமித்த சட்ட உரையில் உள்ளது.", en: "Citation verifier: the section exists in the stored Act text.", te: "ఉల్లేఖన తనిఖీ: సెక్షన్ నిల్వ చేసిన చట్ట పాఠంలో ఉంది." })}
          </p>
        </div>
      ) : (
        <p className="text-sm text-ivory-dim">{t({ ta: "பதிலில் உள்ள பிரிவுச் சுட்டியை அழுத்துங்கள்.", en: "Press a section chip in an answer.", te: "సమాధానంలోని సెక్షన్ చిప్ నొక్కండి." })}</p>
      )}
    </Panel>
  );
}

function LegalAid({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  return (
    <Panel eyebrow={t({ ta: "உதவி பெற", en: "Get help", te: "సహాయం పొందండి" })} title={t({ ta: "சட்டப் பணிகள் ஆணைக் குழு", en: "Legal Services Authority", te: "న్యాయ సేవల ప్రాధికార సంస్థ" })}>
      <ul className="space-y-2 text-sm">
        <li className="rounded-lg border border-ivory/10 bg-night/60 p-3">
          <p className="text-ivory">{t({ ta: "தமிழ்நாடு மாநில சட்டப் பணிகள் ஆணைக் குழு", en: "Tamil Nadu State Legal Services Authority", te: "తమిళనాడు రాష్ట్ర న్యాయ సేవల ప్రాధికార సంస్థ" })}</p>
          <p className="text-xs text-ivory-dim">[Contact from the loaded TN list]</p>
        </li>
        <li className="rounded-lg border border-ivory/10 bg-night/60 p-3">
          <p className="text-ivory">{t({ ta: "தெலங்கானா மாநில சட்டப் பணிகள் ஆணைக் குழு", en: "Telangana State Legal Services Authority", te: "తెలంగాణ రాష్ట్ర న్యాయ సేవల ప్రాధికార సంస్థ" })}</p>
          <p className="text-xs text-ivory-dim">[Contact from the loaded Telangana list]</p>
        </li>
        <li className="rounded-lg border border-ivory/10 bg-night/60 p-3">
          <p className="text-ivory">NALSA</p>
          <p className="text-xs text-ivory-dim">
            {t({ ta: "தேசிய உதவி எண்", en: "National helpline", te: "జాతీయ హెల్ప్‌లైన్" })}: <span className="font-mono text-ivory">15100</span>
          </p>
        </li>
      </ul>
      <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: "உங்கள் வழக்குக்கு ஆலோசனை வேண்டுமானால் — ஒரு வழக்கறிஞர்.", en: "For advice on your own case — a lawyer.", te: "మీ కేసుపై సలహా కోసం — న్యాయవాది." })}</p>
    </Panel>
  );
}

/* ---------------------------------------------- document explainer */

function Explain({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [loaded, setLoaded] = useShared("nyaya.agreement", false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [openClause, setOpenClause] = useState<number | null>(null);
  const a = AGREEMENT;
  const clause = (n: number) => a.clauses.find((c) => c.n === n)!;
  const chip = (n: number) => (
    <PageChip book={t(a.title)} page={`cl. ${n}`} active={openClause === n} onOpen={() => setOpenClause(openClause === n ? null : n)} />
  );
  const exportIcs = () => {
    const ev = a.dates
      .map(
        (d) =>
          `BEGIN:VEVENT\r\nUID:${d.iso}-${d.clause}@nyaya.yazhi.dev\r\nDTSTAMP:20261103T000000Z\r\nDTSTART;VALUE=DATE:${d.iso}\r\n${d.monthly ? "RRULE:FREQ=MONTHLY;COUNT=11\r\n" : ""}SUMMARY:${d.what.en} (clause ${d.clause}) — [Sample] Shop lease\r\nEND:VEVENT`,
      )
      .join("\r\n");
    download("sample-shop-lease-deadlines.ics", "text/calendar", `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Yazhi//Nyaya//EN\r\n${ev}\r\nEND:VCALENDAR\r\n`);
    ctx.log("Exported deadlines (.ics) from [Sample] Shop lease");
  };
  return (
    <Panel accentEdge eyebrow={t({ ta: "ஆவண விளக்கம்", en: "Document explainer", te: "పత్రం వివరణ" })} title={loaded ? t(a.title) : t({ ta: "ஒரு ஒப்பந்தத்தைப் பதிவேற்றுங்கள்", en: "Upload an agreement", te: "ఒప్పందాన్ని అప్‌లోడ్ చేయండి" })} actions={<SampleTag />}>
      {!loaded ? (
        <div className="space-y-3">
          <UploadCard
            title={t({ ta: "PDF அல்லது படம்", en: "A PDF or a photo", te: "PDF లేదా ఫోటో" })}
            hint={t({ ta: "டெமோ முறையில் மாதிரி ஒப்பந்தம் மட்டுமே விளக்கப்படும்; உங்கள் கோப்பு இந்த உலாவியை விட்டு வெளியேறாது.", en: "In demo mode only the sample agreement is explained; your file never leaves this browser.", te: "డెమోలో నమూనా ఒప్పందం మాత్రమే వివరించబడుతుంది; మీ ఫైల్ ఈ బ్రౌజర్ దాటదు." })}
            accept=".pdf,image/*"
            items={items}
            onFiles={(fs) => setItems(fs.map((f, i) => ({ id: `${i}`, name: f.name, size: f.size, status: "rejected", note: "demo: sample only" })))}
            consent={t({ ta: "இந்த ஆவணத்தைப் பகிர அதன் உரிமையாளரின் ஒப்புதல் உள்ளது; அமர்வு முடிந்ததும் அது நீக்கப்படும்.", en: "The person this document belongs to agrees to share it; it is deleted when the session ends.", te: "ఈ పత్రం యజమాని దీనిని పంచుకోవడానికి అంగీకరించారు; సెషన్ ముగిసినప్పుడు తొలగించబడుతుంది." })}
          />
          <button
            type="button"
            onClick={() => {
              setLoaded(true);
              ctx.log("Explained [Sample] Shop lease agreement", [a.file]);
            }}
            className="min-h-11 rounded-full border border-[color:var(--accent)]/60 px-4 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
          >
            {t({ ta: "மாதிரி ஒப்பந்தத்தைப் பயன்படுத்து", en: "Use the sample agreement", te: "నమూనా ఒప్పందాన్ని ఉపయోగించండి" })}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="rounded-lg border border-marutham/40 bg-marutham/5 p-3 text-xs text-ivory">
            {t({ ta: "இந்த ஆவணம் கையெழுத்திடப் பாதுகாப்பானதா என்று நியாயா சொல்லாது. கவனிக்க வேண்டியவற்றைக் காட்டும்.", en: "Nyaya won't tell you whether this is safe to sign. It shows what to look at.", te: "ఇది సంతకం చేయడానికి సురక్షితమో న్యాయ చెప్పదు. ఏమి చూడాలో చూపిస్తుంది." })}
          </p>
          <section>
            <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "கவனிக்க வேண்டிய பிரிவுகள்", en: "Flagged clauses", te: "గుర్తించిన నిబంధనలు" })} · {a.flags.length}</h4>
            <ul className="space-y-2">
              {a.flags.map((f) => (
                <li key={f.clause} className="rounded-lg border border-gold/40 bg-gold/5 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ivory">{t(clause(f.clause).heading)}</span>
                    {chip(f.clause)}
                  </div>
                  <p className="mt-1 text-ivory-dim">{t(f.why)}</p>
                  {openClause === f.clause && (
                    <blockquote className="mt-2 border-l-2 border-[color:var(--accent)] pl-3 text-ivory">
                      <span className="font-mono text-[10px] text-ivory-dim">cl. {f.clause} · source</span>
                      <br />
                      {t(clause(f.clause).text)}
                    </blockquote>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "தரப்பினர்", en: "Parties", te: "పక్షాలు" })}</h4>
              <p className="text-sm text-ivory">{t(clause(1).text)}</p>
              <div className="mt-1">{chip(1)}</div>
            </div>
            <div>
              <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "தொகைகள் (மூலத்திலிருந்து அப்படியே)", en: "Money (copied exactly)", te: "మొత్తాలు (యథాతథంగా)" })}</h4>
              <ul className="space-y-1 text-sm">
                {a.money.map((m) => (
                  <li key={m.clause} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-ivory-dim">{t(m.what)}</span>
                    <span className="flex items-center gap-2 font-mono text-ivory">
                      {m.amount} {chip(m.clause)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "கடமைகள்", en: "Obligations", te: "బాధ్యతలు" })}</h4>
              <ul className="space-y-1 text-sm">
                {a.obligations.map((o, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-ivory">
                      <span className="text-ivory-dim">{t(o.who)}:</span> {t(o.what)}
                    </span>
                    {chip(o.clause)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "தேதிகள்", en: "Dates", te: "తేదీలు" })}</h4>
              <ul className="space-y-1 text-sm">
                {a.dates.map((d) => (
                  <li key={d.iso} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-ivory-dim">{t(d.what)}</span>
                    <span className="flex items-center gap-2 font-mono text-ivory">
                      {d.date} {chip(d.clause)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {openClause !== null && !a.flags.some((f) => f.clause === openClause) && (
            <blockquote className="rounded-lg border-l-2 border-[color:var(--accent)] bg-night/60 p-3 text-sm text-ivory">
              <span className="font-mono text-[10px] text-ivory-dim">cl. {openClause} · {t(clause(openClause).heading)}</span>
              <br />
              {t(clause(openClause).text)}
            </blockquote>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportIcs} className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze">
              {t({ ta: "காலக்கெடுக்கள் (.ics)", en: "Export deadlines (.ics)", te: "గడువులు (.ics)" })}
            </button>
            <button
              type="button"
              onClick={() => {
                setLoaded(false);
                setOpenClause(null);
                ctx.log("Deleted [Sample] Shop lease from the session");
              }}
              className="min-h-11 rounded-full border border-ivory/20 px-5 text-sm text-ivory-dim hover:border-palai/60 hover:text-ivory"
            >
              {t({ ta: "அமர்விலிருந்து நீக்கு", en: "Delete from session", te: "సెషన్ నుండి తొలగించు" })}
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* --------------------------------------------------- eligibility */

/** Answers live in this component's state only — not in any store, not in
    the audit log. A reload forgets them (PRD N3). */
function Eligibility({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [answers, setAnswers] = useState<(boolean | undefined)[]>(ELIGIBILITY.map(() => undefined));
  const done = answers.every((x) => x !== undefined);
  const any = answers.some((x) => x === true);
  return (
    <Panel accentEdge eyebrow={t({ ta: "இலவச சட்ட உதவி", en: "Free legal aid", te: "ఉచిత న్యాయ సహాయం" })} title={t({ ta: "தகுதி இருக்கலாமா?", en: "May I qualify?", te: "నేను అర్హుడినా?" })} actions={<Pill tone="ok" title="Nothing is stored">stored nowhere</Pill>}>
      <ol className="space-y-3">
        {ELIGIBILITY.map((q, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ivory/10 p-3 text-sm">
            <span className="min-w-0 flex-1 text-ivory">
              {i + 1}. {t(q)}
            </span>
            <span className="flex gap-1.5" role="radiogroup" aria-label={t(q)}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  role="radio"
                  aria-checked={answers[i] === v}
                  onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? v : x)))}
                  className={`min-h-10 min-w-14 rounded-full border px-3 text-xs ${answers[i] === v ? "border-[color:var(--accent)] bg-[color:var(--accent)] font-semibold text-night" : "border-ivory/20 text-ivory-dim hover:text-ivory"}`}
                >
                  {v ? t({ ta: "ஆம்", en: "Yes", te: "అవును" }) : t({ ta: "இல்லை", en: "No", te: "కాదు" })}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ol>
      {done && (
        <div className={`mt-4 rounded-xl border p-3 text-sm ${any ? "border-mullai/50 bg-mullai/5" : "border-ivory/20"}`}>
          <p className="font-semibold text-ivory">
            {any
              ? t({ ta: "இலவச சட்ட உதவிக்கு நீங்கள் தகுதி பெறலாம்.", en: "You may be eligible for free legal aid.", te: "మీరు ఉచిత న్యాయ సహాయానికి అర్హులు కావచ్చు." })
              : t({ ta: "இந்தக் கேள்விகளின்படி தெளிவில்லை — ஆனாலும் கேட்கலாம்.", en: "Not clear from these questions — you can still ask.", te: "ఈ ప్రశ్నల ప్రకారం స్పష్టంగా లేదు — అయినా అడగవచ్చు." })}
          </p>
          <p className="mt-1 text-ivory-dim">
            {t({ ta: "சட்டப் பணிகள் ஆணைக் குழுச் சட்டம், 1987, பிரிவு 12. உங்கள் மாவட்ட சட்டப் பணிகள் ஆணைக் குழுவே முடிவு செய்யும்.", en: "Legal Services Authorities Act, 1987, s.12. Your District Legal Services Authority decides.", te: "న్యాయ సేవల ప్రాధికార సంస్థల చట్టం, 1987, సెక్షన్ 12. మీ జిల్లా సంస్థ నిర్ణయిస్తుంది." })}
          </p>
          <button type="button" onClick={() => setAnswers(ELIGIBILITY.map(() => undefined))} className="mt-2 min-h-9 text-xs text-ivory-dim hover:text-ivory">
            {t({ ta: "பதில்களை அழி", en: "Clear my answers", te: "సమాధానాలు తొలగించు" })}
          </button>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------- the draft */

function Draft({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [facts, setFacts] = useState(SAMPLE_FACTS);
  const [made, setMade] = useState(false);
  const sample = facts.trim() === SAMPLE_FACTS;
  const notice = `DRAFT, FOR ADVOCATE REVIEW — not legal advice, not for filing as is.

To: [D]
[Address]

Subject: Notice of dishonour of cheque no. [000000] dated 01-10-2026 for ₹40,000

Under instructions from my client [Client C], I give you notice that the above cheque, drawn by you in favour of my client, was returned unpaid by the bank on 12-10-2026 with the memo "funds insufficient", of which my client was informed on 14-10-2026.

You are called upon to pay the said amount of ₹40,000 within 15 days of receipt of this notice.

[Advocate's name, enrolment no., date]

Facts as given:
${facts}`;
  return (
    <Panel accentEdge eyebrow={t({ ta: "சுருக்கமும் வரைவும்", en: "Summary and draft", te: "సారాంశం, ముసాయిదా" })} title={t({ ta: "காசோலை திரும்புதல் — அறிவிப்பு", en: "Cheque dishonour — notice", te: "చెక్ బౌన్స్ — నోటీసు" })} actions={<Pill tone="warn">draft · advocate review</Pill>}>
      <label className="block text-xs text-ivory-dim">
        {t({ ta: "வழக்கு உண்மைகள்", en: "Case facts", te: "కేసు వాస్తవాలు" })}
        <textarea
          value={facts}
          onChange={(e) => {
            setFacts(e.target.value);
            setMade(false);
          }}
          rows={5}
          className="mt-1 w-full rounded-lg border border-ivory/15 bg-night p-3 font-mono text-xs text-ivory focus:border-gold/60 focus:outline-none"
        />
      </label>
      <button
        type="button"
        onClick={() => {
          setMade(true);
          ctx.log("Made case summary and notice draft (for advocate review)", ["Negotiable Instruments Act, 1881 s.138"]);
        }}
        className="mt-3 min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze"
      >
        {t({ ta: "சுருக்கமும் வரைவும் உருவாக்கு", en: "Make summary and draft", te: "సారాంశం, ముసాయిదా రూపొందించు" })}
      </button>
      {made && (
        <div className="mt-4 space-y-4">
          <section>
            <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "சுருக்கம்", en: "Summary", te: "సారాంశం" })}</h4>
            {sample ? (
              <ul className="space-y-1 text-sm text-ivory">
                {SAMPLE_SUMMARY.map((s, i) => (
                  <li key={i}>· {t(s)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ivory-dim">{t({ ta: "புதிய உண்மைகளைச் சுருக்க yazhi-api வழியாக நியாயா முகவர் இணைக்கப்பட வேண்டும்.", en: "Summarising new facts needs the Nyaya agent connected through yazhi-api.", te: "కొత్త వాస్తవాల సారాంశానికి yazhi-api ద్వారా న్యాయ ఏజెంట్ అవసరం." })}</p>
            )}
          </section>
          <section>
            <h4 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t({ ta: "அறிவிப்பு வரைவு", en: "Notice draft", te: "నోటీసు ముసాయిదా" })}</h4>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-ivory/10 bg-night/60 p-3 text-xs text-ivory" data-lenis-prevent>
              {notice}
            </pre>
          </section>
          <button
            type="button"
            onClick={() => {
              const html = `<html><head><meta charset="utf-8"><title>Draft notice</title></head><body><pre style="font-family:serif;white-space:pre-wrap">${notice.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre></body></html>`;
              download("draft-notice-for-advocate-review.doc", "application/msword", html);
              ctx.log("Downloaded notice draft (.doc) for advocate review");
            }}
            className="min-h-11 rounded-full border border-[color:var(--accent)]/60 px-5 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
          >
            {t({ ta: "வரைவைப் பதிவிறக்கு (.doc)", en: "Download draft (.doc)", te: "ముసాయిదా డౌన్‌లోడ్ (.doc)" })}
          </button>
        </div>
      )}
    </Panel>
  );
}

function LegalNotice() {
  return <Disclaimer kind="legal" />;
}

export const NYAYA_MODULES: Record<string, ModuleDef> = {
  "nyaya.ask": { id: "nyaya.ask", title: { ta: "சட்டக் கேள்வி", en: "Cited Q&A", te: "ఉల్లేఖన ప్రశ్నోత్తరాలు" }, about: { ta: "பிரிவுச் சுட்டியுடன் படிகள்", en: "Numbered steps with section chips", te: "సెక్షన్ చిప్‌లతో దశలు" }, component: Ask },
  "nyaya.citation": { id: "nyaya.citation", title: { ta: "மேற்கோள் பலகை", en: "Citation panel", te: "ఉల్లేఖన ప్యానెల్" }, about: { ta: "திறந்த பிரிவு", en: "The section a chip opened", te: "తెరిచిన సెక్షన్" }, component: Citation },
  "nyaya.lsa": { id: "nyaya.lsa", title: { ta: "சட்ட உதவித் தொடர்பு", en: "Legal-aid contacts", te: "న్యాయ సహాయ సంప్రదింపులు" }, about: { ta: "TN, தெலங்கானா, NALSA", en: "TN, Telangana and NALSA", te: "TN, తెలంగాణ, NALSA" }, component: LegalAid },
  "nyaya.explain": { id: "nyaya.explain", title: { ta: "ஆவண விளக்கம்", en: "Document explainer", te: "పత్రం వివరణ" }, about: { ta: "தொகை, தேதி, கவனப் பிரிவுகள்", en: "Money, dates and flagged clauses", te: "మొత్తాలు, తేదీలు, నిబంధనలు" }, component: Explain },
  "nyaya.eligibility": { id: "nyaya.eligibility", title: { ta: "தகுதிச் சோதனை", en: "Eligibility check", te: "అర్హత పరీక్ష" }, about: { ta: "எங்கும் சேமிக்கப்படாது", en: "Stored nowhere", te: "ఎక్కడా నిల్వ కాదు" }, component: Eligibility },
  "nyaya.draft": { id: "nyaya.draft", title: { ta: "சுருக்கமும் வரைவும்", en: "Summary and draft", te: "సారాంశం, ముసాయిదా" }, about: { ta: "வழக்கறிஞர் மதிப்பாய்வுக்கு", en: "For advocate review, as .doc", te: "న్యాయవాది సమీక్ష కోసం" }, component: Draft },
  "nyaya.disclaimer": { id: "nyaya.disclaimer", title: { ta: "சட்ட அறிவிப்பு", en: "Legal notice", te: "చట్ట నోటీసు" }, about: { ta: "தகவல், ஆலோசனை அல்ல", en: "Information, not advice", te: "సమాచారం, సలహా కాదు" }, component: LegalNotice },
};

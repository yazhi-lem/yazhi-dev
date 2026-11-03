"use client";
import { useState } from "react";
import { Composer, ConfirmGate, HandoffCard, PageChip, Panel, Pill, SampleTag, Segmented, Stepper, TypingDots, type Tone } from "@yazhi/bubble";
import { uid, useShared, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import { CATALOGUE, KB, RETURN_STAGES, STATUS_LABEL, useOrders, useReturns, useTickets, type Ticket } from "../shared/commerce";

type Reply =
  | { kind: "order"; id: string }
  | { kind: "ask-id" }
  | { kind: "kb"; entry: string }
  | { kind: "handoff"; ticket: string };

type Turn = { id: string; text: string; channel: "chat" | "mail"; pending: boolean; reply?: Reply };

const PRIORITY: Record<Ticket["priority"], Tone> = { low: "neutral", normal: "info", high: "warn", urgent: "risk" };

const CHIPS = [
  { ta: "என் ஆர்டர் எங்கே இருக்கிறது? KD-1042", en: "Where is my order? KD-1042" },
  { ta: "ஞாயிறு கடை எத்தனை மணி வரை?", en: "Until what time are you open on Sunday?" },
  { ta: "இதைத் திருப்பித் தரலாமா?", en: "Can I return this?" },
  { ta: "நீங்கள் தங்க நகை விற்பீர்களா?", en: "Do you sell gold jewellery?" },
];

/** Kural answers only from the knowledge base and the shop's records. In
    the product this is retrieval through yazhi-api with the source
    required in code; here, the same rules over the fixtures. */
type Found = Exclude<Reply, { kind: "handoff" }>;
function answer(text: string): Found | null {
  const s = text.toLowerCase();
  const id = s.match(/kd-?\s?(\d{3,5})/i);
  if (id) return { kind: "order", id: `KD-${id[1]}` };
  if (/(ஆர்டர்|order)/i.test(s)) return { kind: "ask-id" };
  if (/(மணி|நேரம்|open|hours|timing|sunday|ஞாயிறு)/i.test(s)) return { kind: "kb", entry: "hours" };
  if (/(திருப்பி|return|refund)/i.test(s)) return { kind: "kb", entry: "returns" };
  if (/(டெலிவரி|delivery|area|பகுதி)/i.test(s)) return { kind: "kb", entry: "area" };
  if (/(பணம்|pay|upi)/i.test(s)) return { kind: "kb", entry: "pay" };
  return null;
}

const kbEntry = (id: string) => [...KB.faqs, ...KB.policies].find((x) => x.id === id)!;

/* ------------------------------------------------------ customer desk */

function Desk({ ctx }: { ctx: ModuleContext }) {
  const { t, lang } = ctx;
  const [channel, setChannel] = useShared<"chat" | "mail">("kural.channel", "chat");
  const [turns, setTurns] = useShared<Turn[]>("kural.thread", []);
  const [orders] = useOrders();
  const [, setTickets] = useTickets();

  const send = (text: string) => {
    const id = uid();
    setTurns((ts) => [...ts, { id, text, channel, pending: true }]);
    window.setTimeout(() => {
      const hit = answer(text);
      let reply: Reply;
      if (hit && (hit.kind !== "order" || orders.some((o) => o.id === hit.id))) reply = hit;
      else {
        const tid = `T-${300 + Math.floor(Math.random() * 600)}`;
        reply = { kind: "handoff", ticket: tid };
        setTickets((ts) => [
          {
            id: tid,
            channel,
            from: "[Customer · this conversation]",
            subject: text.slice(0, 60),
            body: text,
            category: { ta: "ஒப்படைப்பு", en: "Handoff" },
            priority: "normal",
            suggested: { ta: "வணக்கம். உங்கள் கேள்விக்குக் கடை ஊழியர் விரைவில் பதில் சொல்வார்.", en: "Hello. Someone from the shop will answer you shortly." },
            status: "staff",
          },
          ...ts,
        ]);
        ctx.log(`Handed to staff (${channel}): not in the knowledge base`, [tid]);
      }
      setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, reply } : x)));
    }, 600);
  };

  const render = (r: Reply) => {
    if (r.kind === "order") {
      const o = orders.find((x) => x.id === r.id)!;
      return (
        <>
          <p>
            {t({ ta: `உங்கள் ஆர்டர் ${o.id} (${o.items}): `, en: `Your order ${o.id} (${o.items}): ` })}
            <strong>{t(STATUS_LABEL[o.status])}</strong>.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PageChip book={t({ ta: "கடையின் ஆர்டர்கள்", en: "Shop orders" })} page={`#${o.id}`} />
            <Pill tone="info">Annachi</Pill>
            <SampleTag />
          </div>
        </>
      );
    }
    if (r.kind === "ask-id") return <p>{t({ ta: "உங்கள் ஆர்டர் எண்ணைச் சொல்லுங்கள் (எ.கா. KD-1042).", en: "Please tell me your order number (e.g. KD-1042)." })}</p>;
    if (r.kind === "kb") {
      const e = kbEntry(r.entry);
      return (
        <>
          <p>{t(e.a)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PageChip book={t({ ta: "அறிவுத் தளம்", en: "Knowledge base" })} page={t(e.q)} />
            <SampleTag />
          </div>
        </>
      );
    }
    return (
      <HandoffCard
        ticket={r.ticket}
        reason={t({ ta: "இது கடையின் அறிவுத் தளத்தில் இல்லை. ஊகிக்காமல், முழு உரையாடலுடன் ஊழியரிடம் ஒப்படைத்தேன்.", en: "This isn't in the shop's knowledge base. Rather than guess, I've handed the whole conversation to staff." })}
        who={t({ ta: "கவுண்டர் ஊழியர்", en: "Counter staff" })}
      />
    );
  };

  return (
    <Panel
      accentEdge
      eyebrow="Kural"
      title={t({ ta: "வாடிக்கையாளர் மேசை", en: "Customer desk" })}
      actions={
        <Segmented
          label={t({ ta: "வழி", en: "Channel" })}
          value={channel}
          onChange={setChannel}
          options={[
            { value: "chat", label: t({ ta: "அரட்டை", en: "Chat" }) },
            { value: "mail", label: t({ ta: "மின்னஞ்சல்", en: "Mail" }) },
          ]}
        />
      }
    >
      <p className="mb-3 text-[11px] text-ivory-dim">
        {t({ ta: "இந்த உரையாடல் கடையால் 90 நாட்கள் வைக்கப்படும். [மாதிரி அறிவிப்பு]", en: "The shop keeps this conversation for 90 days. [Sample notice]" })}
      </p>
      <div className="chat-scroll max-h-[30rem] space-y-4 overflow-y-auto pr-1" data-lenis-prevent aria-live="polite">
        {turns.map((turn) => (
          <div key={turn.id} className="space-y-2">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">
              {turn.channel === "mail" && <span className="mr-1.5 font-mono text-[10px] uppercase text-ivory-dim">mail</span>}
              {turn.text}
            </div>
            <div className="max-w-[92%] text-sm leading-relaxed text-ivory">{turn.pending ? <TypingDots /> : turn.reply && render(turn.reply)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CHIPS.map((c) => (
          <button key={c.en} type="button" onClick={() => send(t(c))} className="min-h-9 rounded-full border border-ivory/15 px-3 text-left text-xs text-ivory-dim hover:border-[color:var(--accent)]/60 hover:text-ivory">
            {t(c)}
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-ivory/10 pt-3">
        <Composer onSend={send} placeholder={lang === "ta" ? "வாடிக்கையாளராகக் கேளுங்கள்…" : "Ask as a customer…"} />
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------- the queue */

function Queue({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [tickets, setTickets] = useTickets();
  const [selected, setSelected] = useShared<string>("kural.selected", tickets[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const tk = tickets.find((x) => x.id === selected) ?? tickets[0];
  const open = tickets.filter((x) => x.status !== "sent").length;
  const order: Ticket["priority"][] = ["urgent", "high", "normal", "low"];
  const sorted = [...tickets].sort((a, b) => Number(a.status === "sent") - Number(b.status === "sent") || order.indexOf(a.priority) - order.indexOf(b.priority));
  const reply = tk ? (drafts[tk.id] ?? t(tk.suggested)) : "";

  return (
    <Panel eyebrow={t({ ta: "சீட்டு வரிசை", en: "Ticket queue" })} title={t({ ta: "சாட், மின்னஞ்சல், ஒப்படைப்புகள்", en: "Chat, mail and handoffs" })} actions={<Pill tone={open ? "warn" : "ok"}>{open} open</Pill>}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <ul className="space-y-2" aria-label="Tickets">
          {sorted.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => setSelected(x.id)}
                aria-pressed={tk?.id === x.id}
                className={`w-full rounded-xl border p-3 text-left transition ${tk?.id === x.id ? "border-[color:var(--accent)]/70 bg-[color:var(--accent)]/10" : "border-ivory/10 bg-night/60 hover:border-ivory/25"} ${x.status === "sent" ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-ivory-dim">
                    {x.channel} · {x.id}
                  </span>
                  <Pill tone={x.status === "sent" ? "ok" : PRIORITY[x.priority]}>{x.status === "sent" ? "sent" : x.status === "staff" ? "staff" : x.priority}</Pill>
                </div>
                <p className="mt-1 truncate text-sm text-ivory">{x.subject}</p>
                <p className="truncate text-[11px] text-ivory-dim">{t(x.category)}</p>
              </button>
            </li>
          ))}
        </ul>
        {tk && (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-ivory-dim">{tk.id}</span>
              <Pill tone={PRIORITY[tk.priority]}>{tk.priority}</Pill>
              <Pill>{t(tk.category)}</Pill>
              {tk.source ? <PageChip book={t({ ta: "ஆதாரம்", en: "Source" })} page={tk.source} /> : <Pill tone="warn">no source — owner answers</Pill>}
            </div>
            <div>
              <p className="text-xs text-ivory-dim">
                {tk.channel === "mail" ? "Mail" : "Chat"} · {tk.from}
              </p>
              <p className="text-sm font-semibold text-ivory">{tk.subject}</p>
            </div>
            {tk.injection && (
              <div role="note" className="rounded-lg border border-palai/50 bg-palai/5 p-3 text-xs text-ivory">
                <p className="font-semibold">{t({ ta: "கட்டளை போன்ற உரை — தரவாக மட்டுமே", en: "Instruction-like text — treated as data only" })}</p>
                <p className="mt-1 text-ivory-dim">
                  {t({
                    ta: "மின்னஞ்சல் குரலுக்குக் கட்டளையிட முடியாது. எந்தக் கருவியும் இயங்கவில்லை; பணம் அல்லது ஆர்டர் மாற்றம் உரிமையாளரிடம் மட்டுமே.",
                    en: "Mail can't instruct Kural. No tool ran; money and order changes stay with the owner.",
                  })}
                </p>
              </div>
            )}
            <blockquote className="rounded-lg border border-ivory/10 bg-night/60 p-3 text-sm text-ivory-dim" aria-label="Message, as received">
              {tk.body}
            </blockquote>
            {tk.status === "sent" ? (
              <p className="rounded-lg border border-mullai/40 bg-mullai/5 p-3 text-sm text-ivory">{t({ ta: "அனுப்பப்பட்டது — பதிவானது.", en: "Sent — logged." })}</p>
            ) : (
              <>
                <label className="block text-xs text-ivory-dim">
                  {t({ ta: "பரிந்துரைப் பதில் (திருத்தலாம்)", en: "Suggested reply (you can edit it)" })}
                  <textarea
                    value={reply}
                    onChange={(e) => setDrafts((d) => ({ ...d, [tk.id]: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-ivory/15 bg-night p-3 text-sm text-ivory focus:border-gold/60 focus:outline-none"
                  />
                </label>
                <ConfirmGate
                  key={tk.id}
                  action={t({ ta: `${tk.from} க்கு இந்தப் பதிலை அனுப்பு`, en: `Send this reply to ${tk.from}` })}
                  impact={t({ ta: "வாடிக்கையாளருக்கு ஒரு செய்தி; ஆர்டரோ பணமோ மாறாது.", en: "One message to the customer; no order or money changes." })}
                  rollback={t({ ta: "அனுப்பியதைத் திரும்பப் பெற முடியாது; திருத்தச் செய்தி அனுப்பலாம்.", en: "A sent message can't be recalled; a correction can follow." })}
                  onConfirm={() => {
                    const edited = drafts[tk.id] !== undefined && drafts[tk.id] !== t(tk.suggested);
                    setTickets((ts) => ts.map((x) => (x.id === tk.id ? { ...x, status: "sent" } : x)));
                    ctx.log(`Approved and sent reply to ${tk.id}${edited ? " (edited)" : ""}`, tk.source ? [tk.source] : undefined);
                  }}
                  onDecline={() => ctx.log(`Held reply to ${tk.id}`)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------ returns */

function Returns({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [orders] = useOrders();
  const [returns, setReturns] = useReturns();
  const delivered = orders.filter((o) => o.status === "delivered");
  const [order, setOrder] = useState(delivered[0]?.id ?? "");
  const [reason, setReason] = useState("damaged");
  const [proposed, setProposed] = useState(false);
  const REASONS: Record<string, { ta: string; en: string }> = {
    damaged: { ta: "சேதமடைந்தது", en: "Damaged" },
    wrong: { ta: "தவறான பொருள்", en: "Wrong item" },
    unopened: { ta: "திறக்கப்படவில்லை, தேவையில்லை", en: "Unopened, not needed" },
  };
  return (
    <Panel accentEdge eyebrow="Annachi" title={t({ ta: "திருப்பும் கோரிக்கை", en: "Return request" })} actions={<SampleTag />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-ivory-dim">
          {t({ ta: "ஆர்டர்", en: "Order" })}
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-ivory/15 bg-night px-2 text-sm text-ivory">
            {delivered.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} · {o.items}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ivory-dim">
          {t({ ta: "காரணம்", en: "Reason" })}
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-ivory/15 bg-night px-2 text-sm text-ivory">
            {Object.entries(REASONS).map(([k, v]) => (
              <option key={k} value={k}>
                {t(v)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!proposed ? (
        <button
          type="button"
          disabled={!order}
          onClick={() => setProposed(true)}
          className="mt-3 min-h-11 rounded-full border border-[color:var(--accent)]/60 px-4 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10 disabled:opacity-40"
        >
          {t({ ta: "திருப்புதலைத் தொடங்கு", en: "Start a return" })}
        </button>
      ) : (
        <div className="mt-3">
          <ConfirmGate
            action={t({ ta: `${order} க்குத் திருப்பும் கோரிக்கை — ${t(REASONS[reason])}`, en: `Return request for ${order} — ${REASONS[reason].en}` })}
            impact={t({ ta: "ஆர்டரின் நிலை மாறும்; பணம் கடை நேரடியாகத் திருப்பும், யாழி வழியாக அல்ல.", en: "Changes the order's state; the shop refunds directly — no money moves through Yazhi." })}
            rollback={t({ ta: "எடுத்துச் செல்லும் முன் ரத்து செய்யலாம்.", en: "Can be cancelled before pickup." })}
            onConfirm={() => {
              const id = `R-${(returns.length + 1).toString().padStart(3, "0")}`;
              setReturns((rs) => [{ id, order, reason: REASONS[reason].en, stage: 1 }, ...rs]);
              ctx.log(`Owner approved return ${id} for ${order}`, [`Orders · ${order}`, "Policies · Returns"]);
              setProposed(false);
            }}
            onDecline={() => {
              ctx.log(`Owner declined a return for ${order}`);
              setProposed(false);
            }}
          />
        </div>
      )}
      {returns.length > 0 && (
        <ul className="mt-5 space-y-3">
          {returns.map((r) => (
            <li key={r.id} className="rounded-xl border border-ivory/10 bg-night/60 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-ivory">
                  <span className="font-mono text-xs text-ivory-dim">{r.id}</span> · {r.order} · {r.reason}
                </span>
                {r.stage < RETURN_STAGES.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setReturns((rs) => rs.map((x) => (x.id === r.id ? { ...x, stage: x.stage + 1 } : x)));
                      ctx.log(`Return ${r.id}: ${RETURN_STAGES[r.stage + 1].en}`);
                    }}
                    className="min-h-9 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:text-ivory"
                  >
                    {t({ ta: "அடுத்த நிலை", en: "Next stage" })}: {t(RETURN_STAGES[r.stage + 1])}
                  </button>
                )}
              </div>
              <Stepper steps={RETURN_STAGES.map((s) => t(s))} current={r.stage === RETURN_STAGES.length - 1 ? RETURN_STAGES.length : r.stage} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------- knowledge base */

function Knowledge({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [orders] = useOrders();
  const rows = [
    { name: { ta: "கேள்வி-பதில்கள்", en: "FAQs" }, n: KB.faqs.length },
    { name: { ta: "பொருட்பட்டியல்", en: "Catalogue" }, n: CATALOGUE.length },
    { name: { ta: "கொள்கைகள்", en: "Policies" }, n: KB.policies.length },
    { name: { ta: "ஆர்டர்கள் (கடையின் பதிவு)", en: "Orders (the shop's records)" }, n: orders.length },
  ];
  return (
    <Panel eyebrow={t({ ta: "அறிவுத் தளம்", en: "Knowledge base" })} title={t({ ta: "குரல் பதில் சொல்லக்கூடியவை", en: "What Kural may answer from" })}>
      <ul className="space-y-1.5 text-sm">
        {rows.map((r) => (
          <li key={r.name.en} className="flex justify-between gap-2 border-b border-ivory/5 pb-1.5">
            <span className="text-ivory">{t(r.name)}</span>
            <span className="font-mono text-xs text-ivory-dim">{r.n}</span>
          </li>
        ))}
      </ul>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs text-[color:var(--accent)]">{t({ ta: "உள்ளடக்கத்தைக் காட்டு", en: "Show the entries" })}</summary>
        <dl className="mt-2 space-y-2">
          {[...KB.faqs, ...KB.policies].map((e) => (
            <div key={e.id}>
              <dt className="text-ivory">{t(e.q)}</dt>
              <dd className="text-xs text-ivory-dim">{t(e.a)}</dd>
            </div>
          ))}
        </dl>
      </details>
      <p className="mt-3 text-[11px] text-ivory-dim">
        {t({ ta: `புதுப்பிக்கப்பட்டது ${KB.updated}. மற்றவை அனைத்தும் ஒப்படைப்பாகும்.`, en: `Updated ${KB.updated}. Anything else becomes a handoff.` })}
      </p>
    </Panel>
  );
}

export const KURAL_MODULES: Record<string, ModuleDef> = {
  "kural.chat": { id: "kural.chat", title: { ta: "வாடிக்கையாளர் மேசை", en: "Customer desk" }, about: { ta: "அரட்டை, மின்னஞ்சல்", en: "Chat and mail, answered from records" }, component: Desk },
  "kural.queue": { id: "kural.queue", title: { ta: "சீட்டு வரிசை", en: "Ticket queue" }, about: { ta: "வகை, முன்னுரிமை, ஒப்புதல்", en: "Triage, suggested reply, approve and send" }, component: Queue },
  "kural.returns": { id: "kural.returns", title: { ta: "திருப்புதல்", en: "Returns" }, about: { ta: "அண்ணாச்சி முன்மொழிவு, உரிமையாளர் ஒப்புதல்", en: "Annachi proposes, the owner confirms" }, component: Returns },
  "kural.knowledge": { id: "kural.knowledge", title: { ta: "அறிவுத் தளம்", en: "Knowledge base" }, about: { ta: "பதிலின் ஒரே ஆதாரம்", en: "The only sources Kural answers from" }, component: Knowledge },
};

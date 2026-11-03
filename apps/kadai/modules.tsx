"use client";
import { ConfirmGate, Panel, PaymentIntentCard, Pill, ProductCard, SampleTag, TypingDots, type CartLine } from "@yazhi/bubble";
import { uid, useShared, type ModuleContext, type ModuleDef } from "@yazhi/workspace";
import { CATALOGUE, NEXT_STATUS, STATUS_LABEL, useOrders, type Order } from "../shared/commerce";

const useCart = () => useShared<CartLine[]>("kadai.cart", []);

type Turn = { id: string; text: string; pending: boolean; matches?: string[] };

const SAYINGS = ["அரிசி ஒரு மூட்டை வேணும்", "நல்லெண்ணெய் இருக்கா?", "வெல்லமும் புளியும் வேணும்"];

/** Annachi's reading of what the customer asked for, over the catalogue.
    In the product this is the Annachi agent through yazhi-api. */
function match(text: string) {
  return CATALOGUE.filter((p) => text.includes(p.taName) || text.toLowerCase().includes(p.name.replace("[Sample] ", "").toLowerCase())).map((p) => p.id);
}

function Counter({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [turns, setTurns] = useShared<Turn[]>("kadai.thread", []);
  const [, setCart] = useCart();
  const add = (p: CartLine["product"]) =>
    setCart((ls) => {
      const found = ls.find((l) => l.product.id === p.id);
      return found ? ls.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { product: p, qty: 1 }];
    });
  const say = (text: string) => {
    const id = uid();
    setTurns((ts) => [...ts, { id, text, pending: true }]);
    window.setTimeout(() => setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, pending: false, matches: match(text) } : x))), 500);
  };
  const last = [...turns].reverse().find((x) => !x.pending && x.matches);
  const shown = last?.matches?.length ? CATALOGUE.filter((p) => last.matches!.includes(p.id)) : CATALOGUE;
  return (
    <Panel accentEdge eyebrow="Annachi" title={t({ ta: "கவுண்டர்", en: "Counter" })} actions={<SampleTag />}>
      <div className="chat-scroll max-h-72 space-y-3 overflow-y-auto pr-1" data-lenis-prevent aria-live="polite">
        {turns.length === 0 && <p className="text-sm text-ivory-dim">{t({ ta: "வாடிக்கையாளர் சொல்வதைத் தேர்ந்தெடுங்கள்.", en: "Pick what the customer says." })}</p>}
        {turns.map((turn) => (
          <div key={turn.id} className="space-y-1.5">
            <div lang="ta" className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">
              {turn.text}
            </div>
            <div className="text-sm text-ivory">
              {turn.pending ? (
                <TypingDots />
              ) : turn.matches?.length ? (
                t({ ta: "கடையில் இருப்பவை இதோ — வேண்டியதைச் சேருங்கள்; கடை உறுதிசெய்யும்.", en: "Here's what the shop has — add what you need, and the shop will confirm." })
              ) : (
                t({ ta: "பட்டியலில் இது இல்லை. கடைக்காரரிடம் கேட்கிறேன்.", en: "That isn't in the catalogue. I'll ask the shopkeeper." })
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SAYINGS.map((s) => (
          <button key={s} type="button" lang="ta" onClick={() => say(s)} className="min-h-9 rounded-full border border-ivory/15 px-3 text-xs text-ivory-dim hover:border-[color:var(--accent)]/60 hover:text-ivory">
            {s}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {shown.map((p) => (
          <ProductCard key={p.id} product={{ ...p, name: `${p.taName} · ${p.name}` }} onAdd={() => add(p)} />
        ))}
      </div>
    </Panel>
  );
}

function Cart({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [lines, setLines] = useCart();
  const [orders, setOrders] = useOrders();
  const [last, setLast] = useShared<string | null>("kadai.last", null);
  return (
    <div className="space-y-3">
      <PaymentIntentCard lines={lines} onRemove={(pid) => setLines((ls) => ls.filter((l) => l.product.id !== pid))} />
      {lines.length > 0 && (
        <ConfirmGate
          key={lines.map((l) => `${l.product.id}${l.qty}`).join()}
          action={t({ ta: "இந்த ஆர்டரைக் கடை உறுதிசெய்கிறது", en: "The shop confirms this order" })}
          impact={t({ ta: "புதிய ஆர்டர் பதிவாகும்; பணம் செலுத்தும் எண்ணம் மட்டும்.", en: "A new order is recorded; a payment intent only." })}
          rollback={t({ ta: "கட்டும் முன் ஆர்டரை ரத்து செய்யலாம்.", en: "The order can be cancelled before packing." })}
          onConfirm={() => {
            const id = `KD-${1043 + orders.length - 3}`;
            const order: Order = {
              id,
              customer: "[Counter customer]",
              items: lines.map((l) => `${l.qty} × ${l.product.name}`).join(", "),
              status: "confirmed",
              placed: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
              channel: "counter",
            };
            setOrders((os) => [order, ...os]);
            setLines([]);
            setLast(id);
            ctx.log(`Shop confirmed order ${id}: ${order.items}`, [`Orders · ${id}`]);
          }}
        />
      )}
      {last && lines.length === 0 && (
        <p className="rounded-lg border border-mullai/40 bg-mullai/5 p-3 text-xs text-ivory">
          {t({ ta: `ஆர்டர் ${last} பதிவானது. குரலிடம் அதன் நிலையைக் கேட்கலாம்.`, en: `Order ${last} recorded. Kural can now tell the customer its status.` })}
        </p>
      )}
    </div>
  );
}

const TONE = { placed: "neutral", confirmed: "info", packed: "warn", out: "accent", delivered: "ok" } as const;

function Orders({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const [orders, setOrders] = useOrders();
  const [proposed, setProposed] = useShared<string | null>("kadai.proposed", null);
  return (
    <Panel accentEdge eyebrow={t({ ta: "கடையின் பதிவு", en: "The shop's records" })} title={t({ ta: "ஆர்டர்கள்", en: "Orders" })} actions={<SampleTag />}>
      <ul className="space-y-2">
        {orders.map((o) => {
          const next = NEXT_STATUS[o.status];
          return (
            <li key={o.id} className="rounded-xl border border-ivory/10 bg-night/60 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-ivory">
                    <span className="font-mono text-xs text-ivory-dim">{o.id}</span> · {o.items}
                  </p>
                  <p className="text-[11px] text-ivory-dim">
                    {o.customer} · {o.placed} · {o.channel}
                  </p>
                </div>
                <span className="flex items-center gap-2">
                  <Pill tone={TONE[o.status]}>{t(STATUS_LABEL[o.status])}</Pill>
                  {next && proposed !== o.id && (
                    <button type="button" onClick={() => setProposed(o.id)} className="min-h-9 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:text-ivory">
                      → {t(STATUS_LABEL[next])}
                    </button>
                  )}
                </span>
              </div>
              {next && proposed === o.id && (
                <div className="mt-2">
                  <ConfirmGate
                    action={t({ ta: `${o.id} → ${t(STATUS_LABEL[next])}`, en: `Mark ${o.id} ${STATUS_LABEL[next].en.toLowerCase()}` })}
                    impact={t({ ta: "குரல் வாடிக்கையாளருக்கு இந்த நிலையைச் சொல்லும்.", en: "Kural will tell the customer this status." })}
                    rollback={t({ ta: "முந்தைய நிலைக்குத் திருப்பலாம்.", en: "Can be set back to the previous status." })}
                    onConfirm={() => {
                      setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
                      setProposed(null);
                      ctx.log(`Order ${o.id} → ${STATUS_LABEL[next].en}`, [`Orders · ${o.id}`]);
                    }}
                    onDecline={() => setProposed(null)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Stock({ ctx }: { ctx: ModuleContext }) {
  const { t } = ctx;
  const low = CATALOGUE.filter((p) => p.stock !== "in");
  return (
    <Panel eyebrow="Kanaku" title={t({ ta: "கையிருப்பு கவனம்", en: "Stock to watch" })}>
      <ul className="space-y-1.5 text-sm">
        {low.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2">
            <span className="text-ivory">
              <span lang="ta">{p.taName}</span> · <span className="text-ivory-dim">{p.unit}</span>
            </span>
            <Pill tone={p.stock === "low" ? "warn" : "risk"}>{p.stock === "low" ? "low" : "out"}</Pill>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-ivory-dim">{t({ ta: "மறு ஆர்டர் செய்வது உங்கள் முடிவு.", en: "Reordering is your call." })}</p>
    </Panel>
  );
}

export const KADAI_MODULES: Record<string, ModuleDef> = {
  "kadai.counter": { id: "kadai.counter", title: { ta: "கவுண்டர்", en: "Counter" }, about: { ta: "அண்ணாச்சியுடன் தமிழில் ஆர்டர்", en: "Orders in Tamil with Annachi" }, component: Counter },
  "kadai.cart": { id: "kadai.cart", title: { ta: "ஆர்டர் சுருக்கம்", en: "Order summary" }, about: { ta: "பணம் செலுத்தும் எண்ணம், கடை ஒப்புதல்", en: "Payment intent and the shop's confirm" }, component: Cart },
  "kadai.orders": { id: "kadai.orders", title: { ta: "ஆர்டர்கள்", en: "Orders" }, about: { ta: "நிலை மாற்றம் ஒப்புதலுடன்", en: "Status changes behind a confirm" }, component: Orders },
  "kadai.stock": { id: "kadai.stock", title: { ta: "கையிருப்பு", en: "Stock" }, about: { ta: "குறைந்தவை, இல்லாதவை", en: "Low and out-of-stock items" }, component: Stock },
};

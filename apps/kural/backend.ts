import { BackendError, type Confirmation, type KuralKb, type KuralKbEntry, type KuralMessageRequest, type KuralOrder, type KuralReply, type KuralTicket } from "@yazhi/contract/types";
import { INITIAL_ORDERS, INITIAL_TICKETS, KB, type Order, type Ticket } from "../shared/commerce-data";

/** Kural's side of the backend contract, answered from the fixtures.
    Pure functions: the workspace calls them in fixture mode (with the
    shop's live orders) and the mock gateway calls them on the server
    (with the sample orders). Kural answers only from the knowledge base
    and the shop's records; anything else goes to a person. */

const KB_ENTRIES: KuralKbEntry[] = [
  ...KB.faqs.map((e) => ({ id: e.id, group: "faq" as const, question: e.q, answer: e.a, state: "live" as const })),
  ...KB.policies.map((e) => ({ id: e.id, group: "policy" as const, question: e.q, answer: e.a, state: "live" as const })),
];

export const kuralKb = (): KuralKb => ({ entries: KB_ENTRIES, updated: KB.updated });

const kbEntry = (id: string) => KB_ENTRIES.find((e) => e.id === id)!;

/** A ticket number for a handoff: T-300 to T-899. */
const ticketId = () => `T-${300 + Math.floor(Math.random() * 600)}`;

export function kuralMessage(req: KuralMessageRequest, orders: Order[] = INITIAL_ORDERS): KuralReply {
  const text = typeof req?.text === "string" ? req.text.trim() : "";
  if (!text) throw new BackendError("bad_request", "text is required.", 400);
  if (req.channel !== "chat" && req.channel !== "mail") throw new BackendError("bad_request", 'channel must be "chat" or "mail".', 400);
  const s = text.toLowerCase();
  const id = s.match(/kd-?\s?(\d{3,5})/i);
  if (id) {
    const order = orders.find((o) => o.id === `KD-${id[1]}`);
    return order ? { kind: "order", order, source: { type: "record", id: order.id } } : { kind: "handoff", ticket_id: ticketId(), reason: "order_not_found" };
  }
  if (/(ஆர்டர்|order)/i.test(s)) return { kind: "ask_order_id" };
  const entry = /(மணி|நேரம்|open|hours|timing|sunday|ஞாயிறு)/i.test(s) ? "hours" : /(திருப்பி|return|refund)/i.test(s) ? "returns" : /(டெலிவரி|delivery|area|பகுதி)/i.test(s) ? "area" : /(பணம்|pay|upi)/i.test(s) ? "pay" : null;
  if (entry) return { kind: "kb", entry: kbEntry(entry), source: { type: "kb", id: entry } };
  return { kind: "handoff", ticket_id: ticketId(), reason: "not_in_knowledge_base" };
}

const ticket = (t: Ticket): KuralTicket => ({
  id: t.id,
  channel: t.channel,
  from: t.from,
  subject: t.subject,
  body: t.body,
  category: t.category,
  priority: t.priority,
  suggested: t.suggested,
  status: t.status,
  injection: !!t.injection,
  ...(t.source ? { source: t.source } : {}),
});

export const kuralTickets = (tickets: Ticket[] = INITIAL_TICKETS): KuralTicket[] => tickets.map(ticket);

export function kuralOrder(id: string, orders: Order[] = INITIAL_ORDERS): KuralOrder {
  const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!order) throw new BackendError("not_found", `No order "${id}".`, 404);
  return order;
}

/* ------------------------------------------------------ confirmations */

/** Pending gates, in memory: enough for a demo, gone on restart. In the
    product yazhi-api keeps them per tenant and writes each decision to
    Pettagam. */
const gates = new Map<string, Confirmation & { ticket: string }>();
let gateSeq = 0;
const MAX_GATES = 200;

export function kuralReplyToTicket(ticketIdArg: string, tickets: Ticket[] = INITIAL_TICKETS): Confirmation {
  const t = tickets.find((x) => x.id === ticketIdArg);
  if (!t) throw new BackendError("not_found", `No ticket "${ticketIdArg}".`, 404);
  if (t.injection) throw new BackendError("forbidden", "This message reads like instructions to the agent. It goes to a person; no reply is drafted for sending.", 403);
  if (t.status !== "open") throw new BackendError("conflict", `Ticket ${t.id} is already ${t.status}.`, 409);
  gateSeq += 1;
  const gate: Confirmation & { ticket: string } = {
    id: `cg_${Date.now().toString(36)}${gateSeq.toString(36)}`,
    action: `Send the suggested reply to ${t.from}`,
    affects: `Ticket ${t.id} (${t.channel}); one message leaves the shop's ${t.channel === "mail" ? "mailbox" : "chat"}.`,
    undo: "A sent message cannot be recalled; a correction can be sent after it.",
    status: "pending",
    expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    ticket: t.id,
  };
  gates.set(gate.id, gate);
  // a demo store, not a queue: keep the newest few so it cannot grow without bound
  while (gates.size > MAX_GATES) gates.delete(gates.keys().next().value!);
  return publicGate(gate);
}

const publicGate = ({ id, action, affects, undo, status, expires_at }: Confirmation): Confirmation => ({ id, action, affects, undo, status, expires_at });

export function decideConfirmation(id: string, decision: unknown): Confirmation {
  const gate = gates.get(id);
  if (!gate) throw new BackendError("not_found", `No confirmation "${id}".`, 404);
  if (decision !== "approve" && decision !== "decline") throw new BackendError("bad_request", 'decision must be "approve" or "decline".', 400);
  if (gate.status !== "pending") throw new BackendError("conflict", `This confirmation was already ${gate.status}.`, 409);
  if (Date.parse(gate.expires_at) < Date.now()) throw new BackendError("conflict", "This confirmation has expired; ask again.", 409);
  gate.status = decision === "approve" ? "approved" : "declined";
  return publicGate(gate);
}

#!/usr/bin/env node
/* Contract smoke test: calls every "mock" operation of
   packages/contract/openapi.yaml on a running gateway and checks the
   shape of each reply.

     npm run dev            (in another terminal)
     npm run contract:smoke                       → http://localhost:3000/api/v1
     npm run contract:smoke -- https://host/api/v1

   Exits non-zero on the first contract break. No dependencies. */

const base = (process.argv[2] ?? "http://localhost:3000/api/v1").replace(/\/$/, "");
let failed = 0;
let passed = 0;

async function call(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

function check(name, ok, detail = "") {
  if (ok) passed += 1;
  else failed += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}${ok || !detail ? "" : `  — ${detail}`}`);
}

const isText = (t) => !!t && typeof t.ta === "string" && typeof t.en === "string";
const hasMeta = (j) => !!j?.meta && typeof j.meta.request_id === "string" && typeof j.meta.sample === "boolean" && j.meta.region === "IN" && typeof j.meta.contract === "string";
const isProblem = (j) => typeof j?.error?.code === "string" && typeof j.error.message === "string" && typeof j.error.request_id === "string";

async function expectOk(name, method, path, body, shape, status = 200) {
  const { status: got, json } = await call(method, path, body);
  const good = got === status && hasMeta(json) && shape(json.data);
  check(name, good, `status ${got}, body ${JSON.stringify(json)?.slice(0, 200)}`);
  return json?.data;
}
async function expectProblem(name, method, path, body, status, code) {
  const { status: got, json } = await call(method, path, body);
  check(name, got === status && isProblem(json) && json.error.code === code, `status ${got}, body ${JSON.stringify(json)?.slice(0, 200)}`);
}

// shared
await expectOk("GET /health", "GET", "/health", undefined, (d) => d.status === "ok" && Array.isArray(d.workspaces));
await expectProblem("unknown path is a 404 problem", "GET", "/nope", undefined, 404, "not_found");

// Guru
const notebooks = await expectOk("GET /guru/notebooks", "GET", "/guru/notebooks", undefined, (d) => Array.isArray(d) && d.length > 0 && d.every((n) => isText(n.title) && typeof n.searchable_count === "number"));
const nb = notebooks?.[0]?.id ?? "g4";
await expectOk("GET /guru/notebooks/{id}/sources", "GET", `/guru/notebooks/${nb}/sources`, undefined, (d) => Array.isArray(d) && d.every((s) => typeof s.pages === "number" && typeof s.past_paper === "boolean"));
const answered = await expectOk(
  "POST /guru/notebooks/{id}/ask — answered, every part cited",
  "POST",
  `/guru/notebooks/${nb}/ask`,
  { question: "சோழர் கால ஆட்சி முறை பற்றி விளக்குக", answer_lang: "ta" },
  (d) => d.status === "answered" && d.parts.length > 0 && d.parts.every((p) => isText(p.text) && p.cite >= 1 && p.cite <= d.citations.length) && d.citations.every((c) => c.verified === true && isText(c.span) && typeof c.page === "number"),
);
await expectOk("POST /guru/notebooks/{id}/ask — not in sources, with the nearest page", "POST", `/guru/notebooks/${nb}/ask`, { question: "பல்லவர் கால ஓவியக் கலை பற்றி விளக்குக" }, (d) => d.status === "not_in_sources" && !d.parts && typeof d.nearest?.page === "number");
await expectOk("POST /guru/notebooks/{id}/ask — not in sources, nothing near", "POST", `/guru/notebooks/${nb}/ask`, { question: "Who won the match yesterday?" }, (d) => d.status === "not_in_sources" && !d.parts && !d.nearest);
await expectProblem("POST /guru/notebooks/{id}/ask — empty question", "POST", `/guru/notebooks/${nb}/ask`, { question: " " }, 400, "bad_request");
await expectProblem("POST /guru/notebooks/{id}/ask — unknown notebook", "POST", "/guru/notebooks/zz/ask", { question: "x" }, 404, "not_found");
await expectOk("GET /guru/citations/{id}", "GET", `/guru/citations/${answered?.citations?.[0]?.id ?? "chola-18"}`, undefined, (d) => isText(d.heading) && isText(d.span));

// Nyaya
const legal = await expectOk(
  "POST /nyaya/ask — answered, every step tied to a section",
  "POST",
  "/nyaya/ask",
  { question: "చెక్ బౌన్స్ అయితే ఏమి చేయాలి?", lang: "te" },
  (d) => d.status === "answered" && isText(d.disclaimer) && d.steps.every((s) => isText(s.text) && d.sections.some((x) => x.id === s.section_id)),
);
await expectOk("POST /nyaya/ask — advice is refused, with legal aid", "POST", "/nyaya/ask", { question: "How do I win my land case?" }, (d) => d.status === "refused_advice" && !d.steps && d.handoff?.kind === "legal_services_authority" && isText(d.disclaimer));
await expectOk("POST /nyaya/ask — no source is said, not guessed", "POST", "/nyaya/ask", { question: "What is the speed limit on the moon?" }, (d) => d.status === "no_source" && !d.steps && isText(d.disclaimer));
await expectOk("GET /nyaya/sections/{id}", "GET", `/nyaya/sections/${legal?.sections?.[0]?.id ?? "ni-138"}`, undefined, (d) => typeof d.locator === "string" && typeof d.excerpt === "string");

// Kural
await expectOk("POST /kural/messages — order from the record", "POST", "/kural/messages", { channel: "chat", text: "என் ஆர்டர் எங்கே இருக்கிறது? KD-1042" }, (d) => d.kind === "order" && d.order.id === "KD-1042" && d.source.type === "record");
await expectOk("POST /kural/messages — asks for the order number", "POST", "/kural/messages", { channel: "chat", text: "Where is my order?" }, (d) => d.kind === "ask_order_id");
await expectOk("POST /kural/messages — from the knowledge base", "POST", "/kural/messages", { channel: "mail", text: "Until what time are you open on Sunday?" }, (d) => d.kind === "kb" && isText(d.entry.answer) && d.source.type === "kb");
await expectOk("POST /kural/messages — outside the knowledge base goes to staff", "POST", "/kural/messages", { channel: "chat", text: "Do you sell gold jewellery?" }, (d) => d.kind === "handoff" && /^T-\d+$/.test(d.ticket_id) && d.reason === "not_in_knowledge_base");
await expectOk("POST /kural/messages — unknown order goes to staff", "POST", "/kural/messages", { channel: "chat", text: "KD-9999?" }, (d) => d.kind === "handoff" && d.reason === "order_not_found");
await expectProblem("POST /kural/messages — bad channel", "POST", "/kural/messages", { channel: "sms", text: "hi" }, 400, "bad_request");
const tickets = await expectOk("GET /kural/tickets", "GET", "/kural/tickets", undefined, (d) => Array.isArray(d) && d.every((t) => isText(t.suggested) && typeof t.injection === "boolean"));
await expectOk("GET /kural/kb", "GET", "/kural/kb", undefined, (d) => Array.isArray(d.entries) && d.entries.every((e) => isText(e.question) && ["live", "draft"].includes(e.state)));
await expectOk("GET /kural/orders/{id}", "GET", "/kural/orders/KD-1040", undefined, (d) => d.id === "KD-1040" && typeof d.status === "string");
await expectProblem("GET /kural/orders/{id} — unknown", "GET", "/kural/orders/KD-0000", undefined, 404, "not_found");

// the confirm gate: asking returns a pending gate; only a decision changes it
const open = tickets?.find((t) => t.status === "open" && !t.injection)?.id ?? "T-201";
const injected = tickets?.find((t) => t.injection)?.id ?? "T-203";
const gate = await expectOk("POST /kural/tickets/{id}/reply — 202 with a pending gate", "POST", `/kural/tickets/${open}/reply`, undefined, (d) => d.status === "pending" && !!d.action && !!d.affects && !!d.undo && Date.parse(d.expires_at) > Date.now(), 202);
await expectProblem("POST /kural/tickets/{id}/reply — an injected message is never sent", "POST", `/kural/tickets/${injected}/reply`, undefined, 403, "forbidden");
await expectProblem("POST /confirmations/{id} — a decision must be approve or decline", "POST", `/confirmations/${gate?.id}`, { decision: "maybe" }, 400, "bad_request");
await expectOk("POST /confirmations/{id} — approve", "POST", `/confirmations/${gate?.id}`, { decision: "approve" }, (d) => d.status === "approved");
await expectProblem("POST /confirmations/{id} — cannot be decided twice", "POST", `/confirmations/${gate?.id}`, { decision: "decline" }, 409, "conflict");
await expectProblem("POST /confirmations/{id} — unknown", "POST", "/confirmations/cg_none", { decision: "approve" }, 404, "not_found");

console.log(`\n${passed} passed, ${failed} failed — ${base}`);
process.exit(failed ? 1 : 0);

import { NextRequest, NextResponse } from "next/server";
import { BackendError, CONTRACT_VERSION, envelope, requestId, type ErrorCode, type Health, type Problem } from "@yazhi/contract";
import { guruAsk, guruCitation, guruNotebooks, guruSources } from "@yazhi/apps/guru/backend";
import { nyayaAsk, nyayaSection } from "@yazhi/apps/nyaya/backend";
import { decideConfirmation, kuralKb, kuralMessage, kuralOrder, kuralReplyToTicket, kuralTickets } from "@yazhi/apps/kural/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** /api/v1 — the mock gateway for the workspace backend contract
    (packages/contract/openapi.yaml).

    It answers every "mock" operation of the contract from the same sample
    data the workspaces ship with, so a demo, a contract test or a backend
    engineer with curl all see the shapes yazhi-api is to return. Every
    reply says so: meta.sample is true and meta.served_by is
    "mock-gateway".

    It holds no customer data, calls no model and no other service, and
    keeps pending confirmations in memory only. When yazhi-api serves the
    contract, this handler becomes the thin gateway in front of it. */

const SERVED_BY = "mock-gateway" as const;
const MAX_BODY = 16_000;

function problem(code: ErrorCode, message: string, status: number) {
  const body: Problem = { error: { code, message, request_id: requestId() } };
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const ok = <T,>(data: T, status = 200) => NextResponse.json(envelope(data, SERVED_BY), { status, headers: { "Cache-Control": "no-store" } });

async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.length > MAX_BODY) throw new BackendError("bad_request", "The request body is too large.", 413);
  if (!raw) return {};
  try {
    const json: unknown = JSON.parse(raw);
    if (json && typeof json === "object" && !Array.isArray(json)) return json as Record<string, unknown>;
  } catch {
    /* falls through */
  }
  throw new BackendError("bad_request", "The request body must be a JSON object.", 400);
}

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const route = `${req.method} /${path.join("/")}`;
  const [a, b, c, d] = path;
  try {
    if (route === "GET /health") {
      const health: Health = { status: "ok", contract: CONTRACT_VERSION, served_by: SERVED_BY, workspaces: ["guru", "nyaya", "kural"] };
      return ok(health);
    }

    if (a === "guru") {
      if (route === "GET /guru/notebooks") return ok(guruNotebooks());
      if (req.method === "GET" && b === "notebooks" && d === "sources" && path.length === 4) return ok(guruSources(c));
      if (req.method === "POST" && b === "notebooks" && d === "ask" && path.length === 4) {
        const body = await readJson(req);
        return ok(guruAsk(c, { question: body.question as string, answer_lang: body.answer_lang as never }));
      }
      if (req.method === "GET" && b === "citations" && path.length === 3) return ok(guruCitation(c));
    }

    if (a === "nyaya") {
      if (route === "POST /nyaya/ask") {
        const body = await readJson(req);
        return ok(nyayaAsk({ question: body.question as string, lang: body.lang as never, jurisdiction: body.jurisdiction as never }));
      }
      if (req.method === "GET" && b === "sections" && path.length === 3) return ok(nyayaSection(c));
    }

    if (a === "kural") {
      if (route === "POST /kural/messages") {
        const body = await readJson(req);
        return ok(kuralMessage({ channel: body.channel as never, text: body.text as string, conversation_id: body.conversation_id as never }));
      }
      if (route === "GET /kural/tickets") return ok(kuralTickets());
      if (route === "GET /kural/kb") return ok(kuralKb());
      if (req.method === "GET" && b === "orders" && path.length === 3) return ok(kuralOrder(c));
      // asks to send; returns the gate and sends nothing
      if (req.method === "POST" && b === "tickets" && d === "reply" && path.length === 4) return ok(kuralReplyToTicket(c), 202);
    }

    if (req.method === "POST" && a === "confirmations" && path.length === 2) {
      const body = await readJson(req);
      return ok(decideConfirmation(b, body.decision));
    }

    return problem("not_found", `${route} is not in contract ${CONTRACT_VERSION}, or is planned and not mocked yet.`, 404);
  } catch (err) {
    if (err instanceof BackendError) return problem(err.code, err.message, err.status);
    return problem("unavailable", "The mock gateway failed to answer.", 500);
  }
}

export const GET = handle;
export const POST = handle;

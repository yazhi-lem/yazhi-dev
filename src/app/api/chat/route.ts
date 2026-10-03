import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/chat/agents";
import { ChatError, askAgent } from "@/lib/chat/backend";
import { MAX_MESSAGE_CHARS, type ChatErrorCode, type ChatRequest, type ChatResponse } from "@/lib/chat/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HTTP: Record<ChatErrorCode, number> = {
  bad_request: 400,
  unknown_agent: 400,
  unconfigured: 503,
  not_sovereign: 503,
  unavailable: 503,
  upstream: 502,
};

function fail(code: ChatErrorCode, message: string) {
  return NextResponse.json<ChatResponse>({ error: { code, message } }, { status: HTTP[code], headers: { "Cache-Control": "no-store" } });
}

/** One chat turn → yazhi-api QueryAgent, behind the sovereignty gate
    (src/lib/chat/backend.ts). Input is validated here: only user and
    assistant turns, strings only, each within MAX_MESSAGE_CHARS, and the
    last turn must be the user's. */
export async function POST(req: NextRequest) {
  let body: ChatRequest & { lang?: string };
  try {
    body = await req.json();
  } catch {
    return fail("bad_request", "The request body is not valid JSON.");
  }

  const agent = getAgent(String(body?.agentId ?? ""));
  if (!agent) return fail("unknown_agent", "That agent is not available here.");
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return fail("bad_request", "Send at least one message.");
  }

  const messages = body.messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .filter((m) => m.content.length > 0);

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return fail("bad_request", "The last message must be yours.");
  if (messages.some((m) => m.content.length > MAX_MESSAGE_CHARS)) {
    return fail("bad_request", `Messages are limited to ${MAX_MESSAGE_CHARS.toLocaleString("en-IN")} characters.`);
  }

  const lang = body.lang === "ta" || body.lang === "en" || body.lang === "both" ? body.lang : "both";
  try {
    const reply = await askAgent(agent, messages, lang);
    return NextResponse.json<ChatResponse>({ reply }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof ChatError) return fail(err.code, err.message);
    return fail("upstream", "Something went wrong while asking the agent.");
  }
}

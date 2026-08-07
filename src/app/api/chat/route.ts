import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/chat/agents";
import { streamFromBackend } from "@/lib/chat/backend";
import type { ChatRequest } from "@/lib/chat/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Streams a chat completion from the yazhi-api backend as NDJSON lines
    (ChatChunk). The system prompt for the agent is added here, server-side,
    so the client never needs to know persona details. */
export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const agent = getAgent(body.agentId);
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${body.agentId}` }, { status: 400 });
  }
  if (!Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }
  const safeMessages = body.messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content }));

  const stream = await streamFromBackend({ agent, messages: safeMessages });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache",
    },
  });
}

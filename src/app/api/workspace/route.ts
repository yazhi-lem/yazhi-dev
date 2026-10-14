import { NextRequest, NextResponse } from "next/server";
import { callWorkspace } from "@/lib/workspace/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { endpoint, payload } → forwards to an allow-listed yazhi-api
    /telugu/* route and returns its JSON verbatim. */
export async function POST(req: NextRequest) {
  let body: { endpoint?: string; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { status, body: out } = await callWorkspace(body.endpoint ?? "", body.payload);
  return NextResponse.json(out, { status, headers: { "Cache-Control": "no-store" } });
}

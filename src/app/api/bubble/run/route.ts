import { NextRequest, NextResponse } from "next/server";
import { streamCompletion } from "@/lib/chat/backend";
import { currentAccount, sameOrigin } from "@/lib/circle/session";
import { CircleCallError } from "@/lib/circle/client";
import { effectiveSystemPrompt, validateManifest, type BubbleManifest } from "@/lib/bubble/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Models a bubble may run on through yazhi-api. Sovereign models only —
    a bubble cannot name a foreign provider's model and have yazhi.dev
    relay to it. Override with YAZHI_BUBBLE_MODELS="adhan,adhan-kutty". */
const ALLOWED_MODELS = new Set(
  (process.env.YAZHI_BUBBLE_MODELS ?? "adhan")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
);
const MAX_TURNS = 40;
const MAX_TURN_CHARS = 8000;

/** POST { manifest, messages } → NDJSON stream (same shape as /api/chat).

    Runs a bubble — including an unpublished one — on yazhi-api.
    Requires a Circle session: running arbitrary prompts is a builder
    privilege, and every run is attributable to a Circle account. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Cross-site request refused." }, { status: 403 });
  }

  let account;
  try {
    account = await currentAccount();
  } catch (err) {
    const message = err instanceof CircleCallError ? err.message : "Circle session check failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
  if (!account) {
    return NextResponse.json(
      { error: "Sign in with your Circle account to run bubbles on yazhi-api — or switch this bubble to on-device." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const problems = validateManifest(body?.manifest);
  if (problems.length) {
    return NextResponse.json({ error: `Invalid bubble: ${problems.join(" ")}` }, { status: 400 });
  }
  const manifest = body.manifest as BubbleManifest;
  if (!manifest.permissions.includes("yazhi-api")) {
    return NextResponse.json(
      { error: 'This bubble has not declared the "yazhi-api" permission.' },
      { status: 403 }
    );
  }
  if (!ALLOWED_MODELS.has(manifest.runtime.model)) {
    return NextResponse.json(
      { error: `Model "${manifest.runtime.model}" is not available on yazhi-api. Allowed: ${[...ALLOWED_MODELS].join(", ")}.` },
      { status: 400 }
    );
  }
  if (!Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }
  const messages = (body.messages as unknown[])
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        typeof m === "object" &&
        ((m as { role?: unknown }).role === "user" || (m as { role?: unknown }).role === "assistant") &&
        typeof (m as { content?: unknown }).content === "string"
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_TURN_CHARS) }));

  const stream = await streamCompletion({
    model: manifest.runtime.model,
    systemPrompt: effectiveSystemPrompt(manifest),
    messages,
    user: account.accountId,
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-cache" },
  });
}

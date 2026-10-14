import { NextRequest, NextResponse } from "next/server";
import { callWorkspace, WORKSPACE_ENDPOINTS, type WorkspaceEndpoint } from "@/lib/workspace/backend";
import { allow } from "@/lib/workspace/rateLimit";
import { SESSION_COOKIE, verify } from "@/lib/workspace/session";
import { validate } from "@/lib/workspace/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;
const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Errors are stable codes ({ error: code, ref? }) that the client localises
    (te/en) — see err.* in src/lib/workspace/i18n.tsx.

    POST { endpoint, payload } → authenticated, tenant-scoped, rate-limited,
    validated forward to an allow-listed yazhi-api /telugu/* route. */
export async function POST(req: NextRequest) {
  const session = verify(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return json({ error: "auth" }, 401);
  if (!allow(session.sid)) return json({ error: "rate" }, 429);

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);
  const raw = await req.text();
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);

  let body: { endpoint?: unknown; payload?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
  if (!(endpoint in WORKSPACE_ENDPOINTS)) return json({ error: "bad_request" }, 400);
  const ep = endpoint as WorkspaceEndpoint;
  if (WORKSPACE_ENDPOINTS[ep].kind !== session.kind) return json({ error: "forbidden" }, 403);

  const v = validate(ep, body.payload);
  if (!v.ok) return json({ error: "bad_request", field: v.error }, 400);

  const { status, body: out } = await callWorkspace(ep, v.value, session.tenant);
  return json(out, status);
}

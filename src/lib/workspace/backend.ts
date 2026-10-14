/** Server-only proxy to the yazhi-api Telugu workspace routes (/telugu/*).
    Mirrors src/lib/chat/backend.ts. Callers (src/app/api/workspace/route.ts)
    must already have authenticated the session, checked the endpoint against
    the tenant's kind, and validated the payload. */
import { randomUUID } from "node:crypto";
import type { TenantKind } from "./session";

export const WORKSPACE_ENDPOINTS = {
  "legal.ask": { method: "POST", path: "/telugu/legal/ask", kind: "legal" },
  "legal.summary": { method: "POST", path: "/telugu/legal/summary", kind: "legal" },
  "legal.draft": { method: "POST", path: "/telugu/legal/draft", kind: "legal" },
  "health.intake": { method: "POST", path: "/telugu/health/intake", kind: "health" },
  "health.explain": { method: "POST", path: "/telugu/health/explain", kind: "health" },
  "health.records": { method: "GET", path: "/telugu/health/records", kind: "health" },
} as const satisfies Record<string, { method: string; path: string; kind: TenantKind }>;

export type WorkspaceEndpoint = keyof typeof WORKSPACE_ENDPOINTS;

const BASE = process.env.YAZHI_WORKSPACE_API_URL ?? process.env.YAZHI_API_URL;
/** Shared secret matching yazhi-api `TELUGU_GATEWAY_TOKEN`. Never sent to the browser. */
const GATEWAY_TOKEN = process.env.YAZHI_WORKSPACE_GATEWAY_TOKEN;
const TIMEOUT_MS = 30_000;

/** Error code the browser sees on any upstream failure — localised client-side; no hosts, no stack. */
export const GENERIC_ERROR = "unavailable";

export async function callWorkspace(
  endpoint: WorkspaceEndpoint,
  payload: Record<string, unknown>,
  tenantId: string
): Promise<{ status: number; body: unknown }> {
  const spec = WORKSPACE_ENDPOINTS[endpoint];
  const ref = randomUUID().slice(0, 8);
  if (!BASE) {
    console.error(`[workspace ${ref}] ${endpoint} refused: backend URL not configured`);
    return { status: 503, body: { error: GENERIC_ERROR, ref } };
  }
  // Fail closed: outside development, never forward without the gateway token.
  if (!GATEWAY_TOKEN && process.env.NODE_ENV !== "development") {
    console.error(`[workspace ${ref}] ${endpoint} refused: gateway token not configured`);
    return { status: 503, body: { error: GENERIC_ERROR, ref } };
  }
  let url = `${BASE.replace(/\/$/, "")}${spec.path}`;
  if (spec.method === "GET") {
    const qs = new URLSearchParams(Object.entries(payload).map(([k, v]) => [k, String(v)])).toString();
    if (qs) url += `?${qs}`;
  }
  try {
    const res = await fetch(url, {
      method: spec.method,
      headers: {
        "Content-Type": "application/json",
        "X-Yazhi-Tenant": tenantId,
        ...(GATEWAY_TOKEN ? { Authorization: `Bearer ${GATEWAY_TOKEN}` } : {}),
      },
      body: spec.method === "POST" ? JSON.stringify(payload) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      // Log status + ref + endpoint only — never the upstream body (may echo PHI).
      await res.body?.cancel().catch(() => {});
      console.error(`[workspace ${ref}] ${endpoint} upstream ${res.status}`);
      // 422 (e.g. missing DPDP consent) is the user's to fix; everything else is generic.
      const status = res.status === 422 ? 422 : 502;
      const error = res.status === 422 ? "invalid" : GENERIC_ERROR;
      return { status, body: { error, ref } };
    }
    return { status: 200, body: await res.json() };
  } catch (err) {
    const e = err as Error;
    // Error name only — messages can carry the upstream host.
    console.error(`[workspace ${ref}] ${endpoint} upstream ${e.name === "TimeoutError" ? "timeout" : "unreachable"}`);
    return { status: e.name === "TimeoutError" ? 504 : 502, body: { error: GENERIC_ERROR, ref } };
  }
}

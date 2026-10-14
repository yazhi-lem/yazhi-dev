/** Server-only proxy to the yazhi-api Telugu workspace routes (/telugu/*).
    Mirrors src/lib/chat/backend.ts: the browser never talks to yazhi-api
    directly, and only allow-listed endpoints can be reached. */

export const WORKSPACE_ENDPOINTS = {
  "legal.ask": { method: "POST", path: "/telugu/legal/ask" },
  "legal.summary": { method: "POST", path: "/telugu/legal/summary" },
  "legal.draft": { method: "POST", path: "/telugu/legal/draft" },
  "health.intake": { method: "POST", path: "/telugu/health/intake" },
  "health.explain": { method: "POST", path: "/telugu/health/explain" },
  "health.records": { method: "GET", path: "/telugu/health/records" },
} as const;

export type WorkspaceEndpoint = keyof typeof WORKSPACE_ENDPOINTS;

/** yazhi-api's HTTP shim (port 8080 by default) — separate from the chat
    backend URL because the shim and the chat gateway can live apart. */
const BASE = process.env.YAZHI_WORKSPACE_API_URL ?? process.env.YAZHI_API_URL;
const KEY = process.env.YAZHI_API_KEY;

export async function callWorkspace(
  endpoint: string,
  payload: Record<string, unknown> | undefined
): Promise<{ status: number; body: unknown }> {
  const spec = WORKSPACE_ENDPOINTS[endpoint as WorkspaceEndpoint];
  if (!spec) return { status: 400, body: { error: `Unknown endpoint: ${endpoint}` } };
  if (!BASE) {
    return {
      status: 503,
      body: { error: "Workspace backend not configured — set YAZHI_WORKSPACE_API_URL (see .env.example)." },
    };
  }
  let url = `${BASE.replace(/\/$/, "")}${spec.path}`;
  if (spec.method === "GET" && payload) {
    const qs = new URLSearchParams(
      Object.entries(payload).filter(([, v]) => v != null && v !== "").map(([k, v]) => [k, String(v)])
    ).toString();
    if (qs) url += `?${qs}`;
  }
  try {
    const res = await fetch(url, {
      method: spec.method,
      headers: {
        "Content-Type": "application/json",
        ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}),
      },
      body: spec.method === "POST" ? JSON.stringify(payload ?? {}) : undefined,
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({ error: res.statusText }));
    return { status: res.status, body };
  } catch (err) {
    return { status: 502, body: { error: `yazhi-api unreachable: ${(err as Error).message}` } };
  }
}

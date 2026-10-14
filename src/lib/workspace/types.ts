/** Shapes returned by yazhi-api /telugu/* (domains/telugu/models.py). */
export interface Envelope {
  source: "model" | "demo";
  demo: boolean;
  demo_notice?: string | null;
  disclaimer: string;
  data_residency: string;
}

export interface WsMessage {
  id: string;
  role: "user" | "assistant";
  /** markdown body */
  content: string;
  meta?: Envelope;
  /** render an inline form instead of text */
  form?: "draft" | "intake";
  error?: boolean;
}

export async function callApi<T extends Envelope>(
  endpoint: string,
  payload?: Record<string, unknown>
): Promise<T> {
  const res = await fetch("/api/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, payload }),
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthRequired();
  if (!res.ok) {
    const ref = json.ref ? ` (ref ${json.ref})` : "";
    throw new Error(`${typeof json.error === "string" ? json.error : "Request failed"}${ref}`);
  }
  return json as T;
}

export class AuthRequired extends Error {
  constructor() {
    super("Sign in required");
  }
}

export interface WsSession { tenant: string; kind: "legal" | "health"; name: string }

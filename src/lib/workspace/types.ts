/** Shapes returned by yazhi-api /telugu/* (domains/telugu/models.py). */
export interface Envelope {
  source: "model" | "demo";
  demo: boolean;
  demo_notice?: string | null;
  disclaimer: string;
  data_residency: string;
  lang?: "te" | "en";
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
  if (!res.ok) throw new WsError(ERROR_CODES.includes(json.error) ? json.error : "unavailable", json.ref);
  return json as T;
}

export const ERROR_CODES = ["unavailable", "invalid", "rate", "forbidden", "too_large", "bad_request"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** API failure carrying a stable code; the UI localises it. */
export class WsError extends Error {
  constructor(public code: ErrorCode, public ref?: string) {
    super(code);
  }
}

export class AuthRequired extends Error {
  constructor() {
    super("Sign in required");
  }
}

export interface WsSession { tenant: string; kind: "legal" | "health"; name: string }

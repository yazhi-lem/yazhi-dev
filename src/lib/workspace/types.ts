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
  const json = await res.json();
  if (!res.ok) {
    const d = json.detail ?? json.error;
    throw new Error(typeof d === "string" ? d : JSON.stringify(d));
  }
  return json as T;
}

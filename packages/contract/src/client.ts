import { BackendError, CONTRACT_VERSION, type Backend, type Envelope, type ErrorCode, type Meta, type Problem } from "./types";

/** Wrap a value in the contract's envelope. */
export function envelope<T>(data: T, served_by: Meta["served_by"], extra: Partial<Meta> = {}): Envelope<T> {
  return {
    data,
    meta: { request_id: requestId(), sample: served_by !== "yazhi-api", served_by, region: "IN", contract: CONTRACT_VERSION, ...extra },
  };
}

let seq = 0;
export function requestId(): string {
  seq += 1;
  return `req_${Date.now().toString(36)}${seq.toString(36)}`;
}

export interface HttpOptions {
  /** where the gateway lives; default: this site's own /api/v1 */
  base?: string;
  fetch?: typeof fetch;
  /** extra headers, e.g. Authorization for a server-side caller */
  headers?: Record<string, string>;
}

/** The contract over HTTP. Every path here is in ../openapi.yaml. */
export function httpBackend({ base = "/api/v1", fetch: f = fetch, headers = {} }: HttpOptions = {}): Backend {
  async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<Envelope<T>> {
    let res: Response;
    try {
      res = await f(`${base}${path}`, {
        method,
        headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new BackendError("unavailable", "The backend could not be reached.", 503);
    }
    const json = (await res.json().catch(() => null)) as Envelope<T> | Problem | null;
    if (!res.ok || !json || "error" in json) {
      const problem = json && "error" in json ? json.error : null;
      throw new BackendError((problem?.code ?? "unavailable") as ErrorCode, problem?.message ?? `The backend answered ${res.status}.`, res.status);
    }
    return json;
  }
  const seg = encodeURIComponent;
  return {
    health: () => call("GET", "/health"),
    guru: {
      notebooks: () => call("GET", "/guru/notebooks"),
      sources: (nb) => call("GET", `/guru/notebooks/${seg(nb)}/sources`),
      ask: (nb, req) => call("POST", `/guru/notebooks/${seg(nb)}/ask`, req),
      citation: (id) => call("GET", `/guru/citations/${seg(id)}`),
    },
    nyaya: {
      ask: (req) => call("POST", "/nyaya/ask", req),
      section: (id) => call("GET", `/nyaya/sections/${seg(id)}`),
    },
    kural: {
      message: (req) => call("POST", "/kural/messages", req),
      tickets: () => call("GET", "/kural/tickets"),
      kb: () => call("GET", "/kural/kb"),
      order: (id) => call("GET", `/kural/orders/${seg(id)}`),
      replyToTicket: (id) => call("POST", `/kural/tickets/${seg(id)}/reply`),
    },
    confirmations: {
      decide: (id, req) => call("POST", `/confirmations/${seg(id)}`, req),
    },
  };
}

export type BackendMode = "fixture" | "api";

/** Which backend the workspaces use. Set NEXT_PUBLIC_YAZHI_BACKEND=api to
    send every call through /api/v1; anything else keeps the demo in the
    browser, with no network. */
export function backendMode(): BackendMode {
  return process.env.NEXT_PUBLIC_YAZHI_BACKEND === "api" ? "api" : "fixture";
}

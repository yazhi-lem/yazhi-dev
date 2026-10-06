/** Server-only unary RPC client for yazhi-api's gRPC services.
    THE SINGLE TRANSPORT FOR EVERY BUBBLE PAGE THAT READS yazhi-api.

    yazhi-api's primary surface is gRPC (services/server.py, :50051) with
    bearer-token metadata (services/interceptors.py). Browsers and Next.js
    route code can't speak raw gRPC, so we call it through the Connect
    protocol's JSON mapping, which any Connect/gRPC-JSON gateway (Envoy
    grpc_json_transcoder, connect-python, a Cloudflare Tunnel in front of
    either) serves unchanged:

      POST {YAZHI_RPC_URL}/{package.Service}/{Method}
      Content-Type: application/json   (body = request message, proto3 JSON)
      Authorization: Bearer {YAZHI_API_KEY}

    proto3 JSON uses lowerCamelCase field names and encodes int64 as a
    string — the TS types in each src/lib/<service>/types.ts follow that exactly.
    Adding a new yazhi-api service to Yazhi Dev = add its types + one
    unary<Req, Res>() call. Nothing here is Foundry-specific. */
import "server-only";

const RPC_URL = process.env.YAZHI_RPC_URL?.replace(/\/+$/, "");
const API_KEY = process.env.YAZHI_API_KEY;

export class RpcError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "RpcError";
  }
}

export function rpcConfigured(): boolean {
  return Boolean(RPC_URL);
}

export async function unary<Req extends object, Res>(
  service: string,
  method: string,
  request: Req,
  {
    revalidate = 60,
    tags = [],
    timeoutMs = 8000,
  }: {
    /** seconds to cache; 0 = never cache (per-user calls such as chat
        turns — a cached POST would serve one person's answer to another) */
    revalidate?: number;
    tags?: string[];
    timeoutMs?: number;
  } = {},
): Promise<Res> {
  if (!RPC_URL) throw new RpcError("YAZHI_RPC_URL is not set", "unconfigured");

  let res: Response;
  try {
    res = await fetch(`${RPC_URL}/${service}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Connect-Protocol-Version": "1",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify(request),
      ...(revalidate > 0
        ? { next: { revalidate, tags: [`yazhi-api:${service}`, ...tags] } }
        : { cache: "no-store" as const }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    throw new RpcError(`yazhi-api unreachable: ${(err as Error).message}`, "unavailable");
  }

  if (!res.ok) {
    // Connect error body: { code: "not_found", message: "..." }
    const body = (await res.json().catch(() => null)) as { code?: string; message?: string } | null;
    throw new RpcError(body?.message ?? res.statusText, body?.code ?? "unknown", res.status);
  }
  return (await res.json()) as Res;
}

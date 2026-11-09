/** YazhiApiError — the one error type for every Yazhi API failure.
 *
 *  A leaf module: its only import is `import type` from ./types, which is
 *  erased at compile time. Anything that needs to *name* or *catch* an API
 *  error — a client component, the frozen-route wrapper in ./bubble.ts, the
 *  /app host — can therefore import it without pulling in ./ports or anything
 *  that statically reaches a server module.
 *
 *  Re-exported from ./client for callers that already import from there. */

import type { ApiErrorBody, ApiErrorCode } from "./types";

/** A non-2xx answer, decoded into the contract's { error, code? } shape. */
export class YazhiApiError extends Error {
  readonly status: number;
  readonly code?: ApiErrorCode;
  readonly body: ApiErrorBody;
  /** response headers, lower-cased (retry-after, cache-control, …) */
  readonly headers: Record<string, string>;

  constructor(
    status: number,
    body: ApiErrorBody,
    headers: Record<string, string> = {},
    message?: string
  ) {
    super(message || body.error || `Request failed (${status})`);
    this.name = "YazhiApiError";
    this.status = status;
    this.code = body.code;
    this.body = body;
    this.headers = headers;
  }

  /** 429 / 503: worth retrying (the client already did, unless disabled). */
  get retryable(): boolean {
    return this.status === 429 || this.status === 503;
  }
}

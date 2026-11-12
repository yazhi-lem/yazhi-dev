// Test stub for `@/lib/circle/session` + `@/lib/circle/client`.
//
// The real modules are Next request-context code (httpOnly cookies, a gRPC
// client with TS parameter properties Node's strip-only loader cannot read).
// The api-kernel tests never need either: a handler call carries its caller
// explicitly (HandlerInput.caller), which is exactly what the real
// resolveCaller() fills in from currentAccount(). This stub lets the server
// modules (local-port.ts, handlers/http.ts) import cleanly and makes the
// "nobody is signed in" case the default.

let signedIn = null;

/** Make currentAccount() return this account (or null). */
export function __setAccount(account) {
  signedIn = account;
}

export class CircleCallError extends Error {
  constructor(message, status = 500, grpcCode) {
    super(message);
    this.name = "CircleCallError";
    this.status = status;
    this.grpcCode = grpcCode;
  }
}

export async function currentAccount() {
  return signedIn;
}

export async function writeSession() {}
export async function clearSession() {}

/** Same rule as the real sameOrigin(): an absent Origin is same-origin. */
export function sameOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

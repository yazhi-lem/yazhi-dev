import "server-only";

/** Turning a registry failure into the contract's error response.
 *
 *  Everything the kernel deliberately refuses — a hidden version, a version
 *  conflict, a self-review — arrives as a RegistryError carrying its own
 *  status and code, and is forwarded verbatim. Anything else is a bug or an
 *  upstream failure and is reported as a generic 500 after being logged: a
 *  stack trace or a database message must not reach a partner.
 */

import { RegistryError } from "../registry";
import { fail, type HandlerResult } from "./core";

export function registryErrorResult(err: unknown): HandlerResult {
  if (err instanceof RegistryError) {
    return fail(err.status, err.message, err.code as never);
  }
  // RegistryError-shaped without the class (a stubbed gRPC client throws one)
  if (
    err &&
    typeof err === "object" &&
    (err as { name?: unknown }).name === "RegistryError" &&
    typeof (err as { status?: unknown }).status === "number" &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    const shaped = err as { status: number; code?: string; message: string };
    return fail(shaped.status, shaped.message, (shaped.code ?? "internal") as never);
  }
  console.error("[api] registry call failed:", err);
  return fail(500, "The bubble registry failed. Try again shortly.", "internal");
}

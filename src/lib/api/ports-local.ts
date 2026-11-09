/** The in-process port's entry point — server side only.
 *
 *  `localPort()` runs a bubble through the SAME handler cores the routes use,
 *  with no HTTP hop. It needs a request context (the Circle cookies that
 *  identify the caller), so it only works inside a Route Handler, a Server
 *  Component or a Server Action.
 *
 *  Why this is its own module: Turbopack's client-graph checker follows VALUE
 *  edges. While localPort lived in ./ports, any client component importing
 *  the typed client pulled local-port, then Circle's server-only session
 *  module, onto the client graph — and the build failed. Only this file names
 *  local-port, so ./ports stays a pure client-safe leaf.
 *
 *  Usage (server only):
 *
 *    import { localPort } from "@/lib/api/ports-local";
 *    const client = createClient(await localPort());
 *
 *  A client component uses createClient("/") — the HTTP port — instead. */

import type { YazhiApiPort } from "./ports";

/** Marker on the in-process port, so a caller can tell which side it is on. */
export type LocalPort = YazhiApiPort & { readonly kind: "local" };

/** The in-process port. Dynamically imports ./local-port (and through it the
    handler modules and the Circle session), so nothing server-side loads
    until a call actually happens. */
export async function localPort(): Promise<LocalPort> {
  const { localPortImpl } = await import("./local-port");
  return localPortImpl();
}

import "server-only";

/** POST /api/manifest/validate — public, no session, no network.
 *
 *  Runs checkManifest() from @yazhi/bubble/lib/manifest on an untrusted
 *  manifest and reports what a host would do with it. Never throws: hostile
 *  input (a getter that throws) comes back as an error list. Stateless and
 *  body-only, because a builder's editor calls it as they type.
 */

import { checkManifest } from "@yazhi/bubble/lib/manifest";
import type { ManifestCheckResult } from "../types";
import { fail, json, parseJsonBody, type Handler, type HandlerInput, type HandlerResult } from "./core";

/** Largest body we will read: a manifest is stored as ≤ 64 KiB JSON, so a
 *  request much larger than that cannot be a valid one. */
const MAX_VALIDATE_BYTES = 128 * 1024;

export const validateManifestHandler: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  if (input.body.length > MAX_VALIDATE_BYTES) {
    return fail(413, "Manifest body is too large to validate (limit 128 KiB).", "too_large");
  }
  const parsed = parseJsonBody(input.body);
  if (!parsed.ok) return fail(400, "Request body is not valid JSON.", "invalid_json");

  const body = parsed.value as { manifest?: unknown } | null;
  if (!body || typeof body !== "object") {
    return fail(400, 'Body must be { "manifest": object }.', "bad_request");
  }
  if (!("manifest" in body)) {
    return fail(400, 'Body must be { "manifest": object } — "manifest" is missing.', "bad_request");
  }

  const check = checkManifest(body.manifest);
  const result: ManifestCheckResult = {
    ok: check.ok,
    errors: check.errors,
    warnings: check.warnings,
    detected: check.detected,
  };
  return json(200, result);
};

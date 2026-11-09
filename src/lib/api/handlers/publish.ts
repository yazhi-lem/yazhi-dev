import "server-only";

/** POST /api/bubbles — publish a version of a bubble.
 *
 *  Circle-gated and same-origin. The body carries the manifest and an
 *  optional visibility; everything identity-shaped is stamped here:
 *   - author.circleAccountId comes from the session, never from the body
 *   - the version must be MAJOR.MINOR.PATCH, unused for this name, and
 *     strictly greater than every version already stored
 *   - the manifest must validate as yazhi.bubble/v1
 *   - status starts at "in_review"; only a maintainer's approval publishes it
 *   - the stored manifest is re-signed by the registry (or "unsigned" is
 *     reported when YAZHI_REGISTRY_SECRET is unset)
 *
 *  Rules mirrored from yazhi-api's bubbles.proto. The store is the seam
 *  described in ../registry.ts.
 */

import { checkManifest } from "@yazhi/bubble/lib/manifest";
import { getRegistry, type RegistryActor } from "../registry";
import type { AnyBubbleManifest, BubbleManifestV1 } from "@yazhi/bubble/lib/manifest";
import { MAX_MANIFEST_BYTES, manifestSizeBytes } from "@yazhi/bubble/lib/bubble";
import type { PublishInput, PublishResponse, Visibility } from "../types";
import { VISIBILITIES } from "../types";
import { fail, json, parseJsonBody, type Handler, type HandlerInput, type HandlerResult } from "./core";
import { registryErrorResult } from "./errors";

/** Same origin + a signed-in Circle account, or the error response.
    `action` names what the caller was trying to do, so the 401 tells them
    what signing in would let them do ("publish a bubble", "review it"). */
export function requireCaller(
  input: HandlerInput,
  action = "publish bubbles"
): { error: HandlerResult } | { actor: RegistryActor } {
  if (!input.allowedOrigin) {
    return { error: fail(403, "Cross-site request refused.", "cross_site") };
  }
  if (!input.caller) {
    return {
      error: fail(401, `Sign in with your Circle account to ${action}.`, "unauthorized"),
    };
  }
  return {
    actor: {
      accountId: input.caller.accountId,
      name: input.caller.name,
      maintainer: input.caller.maintainer,
    },
  };
}

export const publishBubble: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  const gate = requireCaller(input);
  if ("error" in gate) return gate.error;
  const actor = gate.actor;

  const parsed = parseJsonBody(input.body);
  if (!parsed.ok) return fail(400, "Request body is not valid JSON.", "invalid_json");
  const body = parsed.value as Partial<PublishInput> | null;
  if (!body || typeof body !== "object" || !("manifest" in body)) {
    return fail(400, 'Body must be { "manifest": object, "visibility"?: "public" | "private" }.', "bad_request");
  }

  const visibility = (body.visibility ?? "public") as Visibility;
  if (!VISIBILITIES.includes(visibility)) {
    return fail(400, 'visibility must be "public" or "private".', "bad_request");
  }

  // size first: a 10 MB "manifest" should not reach the validator
  const bytes = manifestSizeBytes(body.manifest);
  if (bytes > MAX_MANIFEST_BYTES) {
    return fail(413, `The manifest is ${bytes} bytes; the registry stores at most ${MAX_MANIFEST_BYTES}.`, "too_large");
  }

  // validate both as declared and as stored — the registry only holds v1
  const declared = checkManifest(body.manifest);
  if (!declared.ok) {
    return fail(400, `Invalid bubble: ${declared.errors.join(" ")}`, "invalid_manifest");
  }
  if (declared.detected.schema !== "yazhi.bubble/v1") {
    return fail(
      400,
      `The registry publishes yazhi.bubble/v1; this manifest declares ${JSON.stringify(declared.detected.schema)}. Add "languages" and set "schema": "yazhi.bubble/v1".`,
      "invalid_manifest"
    );
  }

  // stamp the author from the session; a body-supplied author cannot survive
  const manifest = {
    ...(body.manifest as BubbleManifestV1),
    author: { circleAccountId: actor.accountId, name: actor.name ?? "" },
  } satisfies BubbleManifestV1;

  // re-check with the stamped author so a hostile body author is caught
  const stamped = checkManifest(manifest);
  if (!stamped.ok) {
    return fail(400, `Invalid bubble: ${stamped.errors.join(" ")}`, "invalid_manifest");
  }

  // The registry signs what it stores (../signing.ts) and reports "unsigned"
  // when YAZHI_REGISTRY_SECRET is unset — one signing path, not two.
  try {
    const registry = await getRegistry();
    const result = await registry.publish({
      actor,
      input: { manifest: manifest as AnyBubbleManifest, visibility },
    });
    const warnings = [...new Set(result.warnings)];
    const response: PublishResponse = { version: result.version, ...(warnings.length ? { warnings } : {}) };
    return json(201, response, { "Cache-Control": "no-store" });
  } catch (err) {
    return registryErrorResult(err);
  }
};

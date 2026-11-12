import "server-only";

/** POST /api/bubbles/<name>/reviews — a maintainer's decision.
 *
 *  Circle + maintainer + same-origin. The body is
 *  { version, decision: "approve" | "reject", note? }.
 *  - approve publishes the version; reject closes it
 *  - a reject (or a withdraw) needs a note, ≤ 2000 characters — the author
 *    must learn why
 *  - nobody reviews their own bubble (403 self_review), enforced in the store
 *    as well as here so no caller can route around it
 *  - not a maintainer → 403 not_maintainer. Maintainers come from
 *    YAZHI_MAINTAINERS (../maintainers.ts) until yazhi-api exposes the
 *    community.maintainer IAM role.
 */

import { getRegistry } from "../registry";
import type { ReviewInput } from "../types";
import { fail, json, parseJsonBody, type Handler, type HandlerInput, type HandlerResult } from "./core";
import { registryErrorResult } from "./errors";
import { requireCaller } from "./publish";

const NOTE_CHARS = 2000;

export const reviewBubble: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  const gate = requireCaller(input, "review bubbles");
  if ("error" in gate) return gate.error;
  if (!gate.actor.maintainer) {
    return fail(403, "Only a community maintainer may review bubbles.", "not_maintainer");
  }
  const name = input.params.name;
  if (!name) return fail(404, "No such bubble.", "not_found");

  const parsed = parseJsonBody(input.body);
  if (!parsed.ok) return fail(400, "Request body is not valid JSON.", "invalid_json");
  const body = parsed.value as Partial<ReviewInput> | null;
  if (!body || typeof body !== "object") {
    return fail(400, 'Body must be { "version": string, "decision": "approve" | "reject", "note"?: string }.', "bad_request");
  }
  const version = typeof body.version === "string" ? body.version.trim() : "";
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    return fail(400, "version must be MAJOR.MINOR.PATCH.", "bad_request");
  }
  if (body.decision !== "approve" && body.decision !== "reject") {
    return fail(400, 'decision must be "approve" or "reject".', "bad_request");
  }
  const note = typeof body.note === "string" ? body.note.trim() : "";
  if (body.decision === "reject" && !note) {
    return fail(400, "A rejection needs a note so the author learns why.", "bad_request");
  }
  if (note.length > NOTE_CHARS) {
    return fail(400, `note must be at most ${NOTE_CHARS} characters.`, "bad_request");
  }

  try {
    const registry = await getRegistry();
    const result = await registry.review({
      actor: gate.actor,
      name,
      input: { version, decision: body.decision, ...(note ? { note } : {}) },
    });
    return json(200, result, { "Cache-Control": "no-store" });
  } catch (err) {
    return registryErrorResult(err);
  }
};

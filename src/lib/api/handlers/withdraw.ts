import "server-only";

/** POST /api/bubbles/<name>/withdraw — take a version (or all of them) back.
 *
 *  The author or a maintainer. Body { version?, reason? }; without a version
 *  every version not yet withdrawn goes at once. WITHDRAWN is terminal: the
 *  version number stays used and is never re-published (bubbles.proto), so a
 *  withdrawn version cannot be quietly swapped for different content.
 */

import { getRegistry } from "../registry";
import type { WithdrawInput, WithdrawResponse } from "../types";
import { fail, json, parseJsonBody, type Handler, type HandlerInput, type HandlerResult } from "./core";
import { registryErrorResult } from "./errors";
import { requireCaller } from "./publish";

const REASON_CHARS = 2000;

export const withdrawBubble: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  const gate = requireCaller(input, "withdraw a bubble");
  if ("error" in gate) return gate.error;

  const name = input.params.name;
  if (!name) return fail(404, "No such bubble.", "not_found");

  const parsed = parseJsonBody(input.body);
  if (!parsed.ok) return fail(400, "Request body is not valid JSON.", "invalid_json");
  const body = (parsed.value ?? {}) as Partial<WithdrawInput>;
  if (typeof body !== "object" || body === null) {
    return fail(400, 'Body must be { "version"?: string, "reason"?: string }.', "bad_request");
  }

  const version = typeof body.version === "string" ? body.version.trim() : "";
  if (version && !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    return fail(400, "version must be MAJOR.MINOR.PATCH.", "bad_request");
  }
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (reason.length > REASON_CHARS) {
    return fail(400, `reason must be at most ${REASON_CHARS} characters.`, "bad_request");
  }

  try {
    const registry = await getRegistry();
    const result = await registry.withdraw({
      actor: gate.actor,
      name,
      input: { ...(version ? { version } : {}), ...(reason ? { reason } : {}) },
    });
    const response: WithdrawResponse = result;
    return json(200, response, { "Cache-Control": "no-store" });
  } catch (err) {
    return registryErrorResult(err);
  }
};

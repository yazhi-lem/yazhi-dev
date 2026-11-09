import "server-only";

/** GET /api/bubbles/<name> — one version.
 *
 *  `?version=<semver>` picks an exact version; without it, the latest version
 *  the caller may see. A bubble the caller may not see, or a name that does
 *  not exist, is 404 in both cases: a probe must not be able to tell a private
 *  bubble from a missing one (bubbles.proto, and ROUTE-CONTRACTS §B).
 */

import { isValidBubbleName } from "@yazhi/bubble/lib/bubble";
import { getRegistry } from "../registry";
import { fail, json, type Handler, type HandlerInput, type HandlerResult } from "./core";
import { registryErrorResult } from "./errors";

export const getBubble: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  const name = input.params.name;
  if (!isValidBubbleName(name)) return fail(404, "No such bubble.", "not_found");

  const version = input.query.get("version")?.trim() || undefined;
  if (version !== undefined && !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    // a malformed version is a client mistake, not a hidden bubble
    return fail(400, "version must be MAJOR.MINOR.PATCH.", "bad_request");
  }

  try {
    const registry = await getRegistry();
    const result = await registry.get({
      actor: input.caller
        ? { accountId: input.caller.accountId, name: input.caller.name, maintainer: input.caller.maintainer }
        : null,
      name,
      ...(version ? { version } : {}),
    });
    return json(200, result, { "Cache-Control": "no-store" });
  } catch (err) {
    return registryErrorResult(err);
  }
};

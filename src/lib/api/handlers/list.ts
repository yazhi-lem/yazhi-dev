import "server-only";

/** GET /api/bubbles — browse the registry.
 *
 *  Visibility follows bubbles.proto: a caller sees published public
 *  versions, their own versions in any state, and (as a maintainer) the whole
 *  in_review queue. Anonymous callers see published public versions only.
 *  A bubble nobody may see is simply absent from the list — never an error.
 *
 *  Query (all optional): q, lang, domain, status, mine, pageSize, pageToken.
 *  pageSize is clamped to 200 and defaults to 50; an unparseable pageSize is
 *  400 rather than silently ignored, because a partner paging through results
 *  needs to know their cursor is meaningless.
 */

import { getRegistry } from "../registry";
import { BUBBLE_STATUSES } from "../types";
import type { BubbleStatus, ListBubblesQuery, ListBubblesResponse } from "../types";
import { fail, json, type Handler, type HandlerInput, type HandlerResult } from "./core";
import { registryErrorResult } from "./errors";

const MAX_QUERY_CHARS = 200;

export function queryFrom(input: HandlerInput): { error: HandlerResult } | { query: ListBubblesQuery } {
  const q = input.query.get("q")?.trim() || undefined;
  const lang = input.query.get("lang")?.trim() || undefined;
  const domain = input.query.get("domain")?.trim().toLowerCase() || undefined;
  const statusRaw = input.query.get("status")?.trim() || undefined;
  const mineRaw = input.query.get("mine")?.trim() || undefined;
  const pageSizeRaw = input.query.get("pageSize")?.trim() || undefined;
  const pageToken = input.query.get("pageToken")?.trim() || undefined;

  for (const [field, value] of Object.entries({ q, lang, domain, pageToken })) {
    if (value && value.length > MAX_QUERY_CHARS) return { error: fail(400, `${field} is too long.`, "bad_request") };
  }

  if (statusRaw && !BUBBLE_STATUSES.includes(statusRaw as BubbleStatus)) {
    return {
      error: fail(400, `status must be one of ${BUBBLE_STATUSES.join(", ")}.`, "bad_request"),
    };
  }

  let mine: boolean | undefined;
  if (mineRaw !== undefined) {
    if (!["true", "false", "1", "0", ""].includes(mineRaw)) {
      return { error: fail(400, "mine must be true or false.", "bad_request") };
    }
    mine = mineRaw === "true" || mineRaw === "1" || (mineRaw === "" && true);
  }

  let pageSize: number | undefined;
  if (pageSizeRaw !== undefined) {
    const parsed = Number(pageSizeRaw);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return { error: fail(400, "pageSize must be a positive integer (at most 200).", "bad_request") };
    }
    pageSize = parsed;
  }

  return {
    query: {
      ...(q ? { q } : {}),
      ...(lang ? { lang } : {}),
      ...(domain ? { domain } : {}),
      ...(statusRaw ? { status: statusRaw as BubbleStatus } : {}),
      ...(mine !== undefined ? { mine } : {}),
      ...(pageSize !== undefined ? { pageSize } : {}),
      ...(pageToken ? { pageToken } : {}),
    },
  };
}

export const listBubbles: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  const parsed = queryFrom(input);
  if ("error" in parsed) return parsed.error;
  try {
    const registry = await getRegistry();
    const result: ListBubblesResponse = await registry.list({
      actor: input.caller
        ? { accountId: input.caller.accountId, name: input.caller.name, maintainer: input.caller.maintainer }
        : null,
      query: parsed.query,
    });
    return json(200, result, { "Cache-Control": "no-store" });
  } catch (err) {
    return registryErrorResult(err);
  }
};

import "server-only";

/** GET /api/health — what a partner (or an uptime check) reads first.
    Public, no session, no network calls: config-driven only, so it answers
    the same way whether or not yazhi-api is up. */

import { allowedModels } from "../env";
import { API_VERSION, DEFAULT_LOCALE, LOCALES } from "../types";
import type { HealthResponse, LocaleTag } from "../types";
import { json, type Handler, type HandlerResult } from "./core";

/** The manifest schema yazhi.dev publishes. Paired with "yazhi.bubble" in the
    contract's shape: { schema: "yazhi.bubble", version: "v1" }. */
const BUBBLE_SCHEMA_VERSION = "v1";

export function healthBody(): HealthResponse {
  const locales: LocaleTag[] = [...LOCALES];
  return {
    status: "ok",
    version: API_VERSION,
    i18n: { locales, default: DEFAULT_LOCALE },
    bubble: { schema: "yazhi.bubble", version: BUBBLE_SCHEMA_VERSION },
    runtimes: ["device", "yazhi-api"],
    models: allowedModels(),
  };
}

export const health: Handler = async (): Promise<HandlerResult> => json(200, healthBody());

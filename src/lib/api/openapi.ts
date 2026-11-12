/** GET /api/openapi.json — the documented public surface.
 *
 *  An OpenAPI 3.1 document for every operation in
 *  docs/team/ROUTE-CONTRACTS-20261109.md §A/§B: health, agents, the bubble
 *  registry (publish/list/get/reviews/withdraw), manifest validation, bubble
 *  run and translate. The page at /bubble#api and docs/API.md describe the
 *  same surface, and a test asserts this document covers every path there.
 *
 *  `openApiDocument()` returns a plain serialisable object — no functions, no
 *  class instances, no reads of process.env at call time that would make the
 *  output non-deterministic. That is deliberate: a partner can import it,
 *  a codegen tool can consume it, and `node --test` can validate it.
 *
 *  This module imports nothing (not even a type) so it can be bundled
 *  anywhere; API_VERSION is duplicated as a literal below and checked against
 *  ../types by the api-kernel test. */

/** Must equal API_VERSION in src/lib/api/types.ts (asserted by the test). */
export const OPENAPI_VERSION = "1.0.0";

type Json = Record<string, unknown>;

const errorBody = {
  type: "object",
  required: ["error"],
  properties: {
    error: { type: "string", description: "Human-readable message, safe to show." },
    code: {
      type: "string",
      description: "Stable machine code (see docs/API.md §Error codes).",
      enum: [
        "bad_request",
        "invalid_json",
        "invalid_manifest",
        "unauthorized",
        "forbidden",
        "cross_site",
        "not_maintainer",
        "self_review",
        "not_found",
        "version_conflict",
        "not_owner",
        "too_large",
        "rate_limited",
        "not_configured",
        "upstream_error",
        "internal",
      ],
    },
    field: { type: "string", description: "Which field or parameter caused it." },
  },
  example: { error: "No such bubble.", code: "not_found" },
} as const;

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

function errorResponse(description: string): Json {
  return { description, content: { "application/json": { schema: ref("Error") } } };
}

/** Every route, as data. The route list is also what docs/API.md's tables and
    the api-kernel test walk. */
export const API_ROUTES: readonly { path: string; methods: readonly string[] }[] = [
  { path: "/api/health", methods: ["get"] },
  { path: "/api/agents", methods: ["get"] },
  { path: "/api/bubbles", methods: ["get", "post"] },
  { path: "/api/bubbles/{name}", methods: ["get"] },
  { path: "/api/bubbles/{name}/reviews", methods: ["post"] },
  { path: "/api/bubbles/{name}/withdraw", methods: ["post"] },
  { path: "/api/manifest/validate", methods: ["post"] },
  { path: "/api/bubble/run", methods: ["post"] },
  { path: "/api/translate", methods: ["get", "post", "options"] },
  { path: "/api/openapi.json", methods: ["get"] },
] as const;

const bubbleVersionSchema = {
  type: "object",
  required: ["id", "name", "version", "authorAccountId", "visibility", "status", "manifest", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string", example: "tamil-tutor@1.0.0" },
    name: { type: "string", example: "tamil-tutor" },
    version: { type: "string", example: "1.0.0", pattern: "^\\d+\\.\\d+\\.\\d+$" },
    authorAccountId: { type: "string", example: "acct_123" },
    visibility: { type: "string", enum: ["public", "private"] },
    status: { type: "string", enum: ["in_review", "published", "rejected", "withdrawn"] },
    manifest: ref("BubbleManifest"),
    signature: {
      type: "string",
      description: "HMAC-SHA256 over the canonical manifest JSON (base64url, prefix v1:). Absent when YAZHI_REGISTRY_SECRET is unset.",
    },
    reviewedByAccountId: { type: "string" },
    reviewDecision: { type: "string", enum: ["approve", "reject"] },
    reviewNote: { type: "string", maxLength: 2000 },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const bubbleManifestSchema = {
  type: "object",
  description: "A yazhi.bubble/v1 manifest. POST /api/manifest/validate accepts v0 as well.",
  required: ["schema", "id", "version", "name", "description", "accent", "size", "agent", "runtime", "permissions", "languages", "createdAt", "updatedAt"],
  properties: {
    schema: { type: "string", enum: ["yazhi.bubble/v1"], example: "yazhi.bubble/v1" },
    id: { type: "string", example: "tamil-tutor", description: "Registry name; the first publisher owns it." },
    version: { type: "string", example: "1.0.0", pattern: "^\\d+\\.\\d+\\.\\d+$" },
    name: { type: "string", maxLength: 60, example: "Tamil Tutor" },
    taName: { type: "string", maxLength: 60, example: "தமிழ் ஆசிரியர்" },
    description: { type: "string", maxLength: 280 },
    accent: { type: "string", pattern: "^#[0-9a-f]{6}$", example: "#d3b36a" },
    size: { type: "string", enum: ["s", "m", "l"] },
    agent: {
      type: "object",
      required: ["systemPrompt", "greeting", "fivePosture"],
      properties: {
        systemPrompt: { type: "string", maxLength: 8000 },
        greeting: { type: "string", maxLength: 1000 },
        fivePosture: { type: "boolean" },
      },
    },
    runtime: {
      type: "object",
      required: ["prefer", "model", "deviceModel"],
      properties: {
        prefer: { type: "string", enum: ["device", "yazhi-api"] },
        model: { type: "string", example: "adhan" },
        deviceModel: { type: "string", example: "adhan-kutty" },
      },
    },
    permissions: { type: "array", items: { type: "string", enum: ["yazhi-api", "clipboard"] } },
    languages: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: { type: "string", example: "ta-IN" },
      description: "BCP-47 tags, most-used first.",
    },
    domain: { type: "string", example: "education" },
    forkedFrom: {
      type: "object",
      required: ["id", "version"],
      properties: { id: { type: "string" }, version: { type: "string" } },
    },
    author: {
      type: "object",
      description: "Stamped by the registry from the Circle session; a body-supplied value is replaced.",
      properties: { circleAccountId: { type: "string" }, name: { type: "string" } },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

/** A streamed response in one transport only (the frozen run route). */
function ndjsonOk(description: string): Json {
  return {
    description,
    content: {
      "application/x-ndjson": {
        schema: { type: "string" },
        example: '{"text":"வணக்கம்"}\n{"done":true}\n',
      },
    },
  };
}

function streamOk(description: string): Json {
  return {
    description,
    content: {
      "application/x-ndjson": {
        schema: { type: "string" },
        example: '{"text":"வணக்கம்"}\n{"done":true}\n',
      },
      "text/event-stream": {
        schema: { type: "string" },
        example: 'data: {"text":"வணக்கம்"}\n\ndata: {"done":true}\n\ndata: [DONE]\n\n',
      },
    },
  };
}

const queryParameter = (name: string, description: string, schema: Json = { type: "string" }): Json => ({
  name,
  in: "query",
  required: false,
  description,
  schema,
});

const nameParameter: Json = {
  name: "name",
  in: "path",
  required: true,
  description: "The bubble's registry name (its manifest id).",
  schema: { type: "string" },
};

const securityCircle = [{ circleCookie: [] }];
const securityPublic: unknown[] = [];
const securityOptional = [{}, { circleCookie: [] }];

export function openApiDocument(): Json {
  const paths: Record<string, Json> = {
    "/api/health": {
      get: {
        operationId: "getHealth",
        summary: "Service health and configuration",
        description: "Public. Config-driven only: no network calls, same answer whether yazhi-api is up or not.",
        tags: ["meta"],
        security: securityPublic,
        responses: {
          "200": {
            description: "Health",
            content: { "application/json": { schema: ref("Health") } },
          },
        },
      },
    },
    "/api/agents": {
      get: {
        operationId: "listAgents",
        summary: "The public agent roster",
        description: "Public. Never includes a system prompt, greeting or persona note.",
        tags: ["meta"],
        security: securityPublic,
        responses: {
          "200": { description: "Agents", content: { "application/json": { schema: ref("AgentsResponse") } } },
        },
      },
    },
    "/api/bubbles": {
      get: {
        operationId: "listBubbles",
        summary: "Browse the bubble registry",
        description:
          "The latest version of each bubble the caller may see — published public versions, the caller's own versions in any state, and (for a maintainer) the review queue. An invisible bubble is absent, never an error.",
        tags: ["registry"],
        security: securityOptional,
        parameters: [
          queryParameter("q", "Free-text match on name, description, Tamil name and domain."),
          queryParameter("lang", 'BCP-47 prefix match on manifest.languages ("ta" matches "ta-IN").'),
          queryParameter("domain", "manifest.domain"),
          queryParameter("status", "Exact status.", { type: "string", enum: ["in_review", "published", "rejected", "withdrawn"] }),
          queryParameter("mine", "Only bubbles the caller authored.", { type: "boolean" }),
          queryParameter("pageSize", "≤ 200, default 50.", { type: "integer", minimum: 1, maximum: 200 }),
          queryParameter("pageToken", "Opaque cursor from a previous response."),
        ],
        responses: {
          "200": { description: "Bubbles", content: { "application/json": { schema: ref("ListBubblesResponse") } } },
          "400": errorResponse("A query parameter is malformed (status, pageSize, pageToken)."),
        },
      },
      post: {
        operationId: "publishBubble",
        summary: "Publish a version of a bubble",
        description:
          "Circle session + same-origin. Validates the manifest (v1), stamps author.circleAccountId from the session, bumps/verifies semver, signs it, and stores it in_review. The first publisher of a name owns it.",
        tags: ["registry"],
        security: securityCircle,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["manifest"],
                properties: {
                  manifest: ref("BubbleManifest"),
                  visibility: { type: "string", enum: ["public", "private"], default: "public" },
                },
              },
              example: { manifest: { schema: "yazhi.bubble/v1", id: "tamil-tutor", version: "1.0.0", languages: ["ta-IN", "en"] }, visibility: "public" },
            },
          },
        },
        responses: {
          "201": { description: "Stored in review", content: { "application/json": { schema: ref("PublishResponse") } } },
          "400": errorResponse("The manifest is invalid or the version is not MAJOR.MINOR.PATCH."),
          "401": errorResponse("No Circle session."),
          "403": errorResponse("Cross-site request, or another account owns this name."),
          "409": errorResponse("The version is not greater than the highest already stored."),
          "413": errorResponse("The manifest exceeds 64 KiB."),
        },
      },
    },
    "/api/bubbles/{name}": {
      get: {
        operationId: "getBubble",
        summary: "One version of a bubble",
        description: "Without ?version, the latest version the caller may see. Invisible or missing is always 404 — never 403, so a probe cannot enumerate.",
        tags: ["registry"],
        security: securityOptional,
        parameters: [nameParameter, queryParameter("version", 'Exact version. Also accepts "latest".', { type: "string" })],
        responses: {
          "200": { description: "The version", content: { "application/json": { schema: ref("BubbleVersion") } } },
          "400": errorResponse("version is not MAJOR.MINOR.PATCH."),
          "404": errorResponse("No such bubble, or not visible to the caller."),
        },
      },
    },
    "/api/bubbles/{name}/reviews": {
      post: {
        operationId: "reviewBubble",
        summary: "A maintainer's decision on a version",
        description:
          "Circle session + community.maintainer (YAZHI_MAINTAINERS until yazhi-api exposes the role) + same-origin. Nobody reviews their own bubble. Approve publishes; reject closes and needs a note.",
        tags: ["registry"],
        security: securityCircle,
        parameters: [nameParameter],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["version", "decision"],
                properties: {
                  version: { type: "string", example: "1.0.0" },
                  decision: { type: "string", enum: ["approve", "reject"] },
                  note: { type: "string", maxLength: 2000 },
                },
              },
              example: { version: "1.0.0", decision: "approve", note: "Clear purpose, Tamil name reviewed." },
            },
          },
        },
        responses: {
          "200": { description: "The reviewed version", content: { "application/json": { schema: ref("BubbleVersion") } } },
          "400": errorResponse("Bad body, or a rejection without a note."),
          "401": errorResponse("No Circle session."),
          "403": errorResponse("Not a maintainer (not_maintainer), or your own bubble (self_review)."),
          "404": errorResponse("No such version."),
          "409": errorResponse("The version is not in_review."),
        },
      },
    },
    "/api/bubbles/{name}/withdraw": {
      post: {
        operationId: "withdrawBubble",
        summary: "Withdraw a version, or every version",
        description: "The author or a maintainer. Withdrawn is terminal and the version number stays used.",
        tags: ["registry"],
        security: securityCircle,
        parameters: [nameParameter],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { version: { type: "string" }, reason: { type: "string", maxLength: 2000 } },
              },
              example: { version: "1.0.0", reason: "Superseded by a corrected Tamil translation." },
            },
          },
        },
        responses: {
          "200": { description: "Withdrawn versions", content: { "application/json": { schema: ref("WithdrawResponse") } } },
          "400": errorResponse("Bad body."),
          "401": errorResponse("No Circle session."),
          "403": errorResponse("Not the author and not a maintainer."),
          "404": errorResponse("No such bubble."),
        },
      },
    },
    "/api/manifest/validate": {
      post: {
        operationId: "validateManifest",
        summary: "Check a manifest before publishing",
        description: "Public, no session, no network. Accepts yazhi.bubble/v0 or /v1 and never throws on hostile input.",
        tags: ["registry"],
        security: securityPublic,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["manifest"], properties: { manifest: { description: "Any JSON." } } },
              example: { manifest: { schema: "yazhi.bubble/v0", id: "tamil-tutor" } },
            },
          },
        },
        responses: {
          "200": { description: "The verdict", content: { "application/json": { schema: ref("ManifestCheck") } } },
          "400": errorResponse("The request body is not JSON, or has no manifest field."),
          "413": errorResponse("The body exceeds 128 KiB."),
        },
      },
    },
    "/api/bubble/run": {
      post: {
        operationId: "runBubble",
        summary: "Run a bubble's agent on yazhi-api",
        description:
          "Circle session + same-origin. This route predates the kernel: its validations, stream source and NDJSON-only transport are those of src/app/api/bubble/run/route.ts and are frozen. It accepts no ?format=sse — read NDJSON. The system prompt is assembled server-side from the manifest.",
        tags: ["run"],
        security: securityCircle,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["manifest", "messages"],
                properties: {
                  manifest: ref("BubbleManifest"),
                  messages: {
                    type: "array",
                    maxItems: 40,
                    items: {
                      type: "object",
                      required: ["role", "content"],
                      properties: { role: { type: "string", enum: ["user", "assistant"] }, content: { type: "string", maxLength: 8000 } },
                    },
                  },
                },
              },
              example: { manifest: { schema: "yazhi.bubble/v1", id: "tamil-tutor" }, messages: [{ role: "user", content: "கற்க கசடற என்பதன் பொருள்?" }] },
            },
          },
        },
        responses: {
          "200": ndjsonOk("A stream of { text } chunks ending in { done: true }."),
          "400": errorResponse("Invalid manifest, unknown model, or messages not an array."),
          "401": errorResponse("No Circle session."),
          "403": errorResponse("Cross-site, or the bubble has not declared the yazhi-api permission."),
        },
      },
    },
    "/api/translate": {
      get: {
        operationId: "lookupTranslation",
        summary: "Translation-memory lookup",
        description:
          "Public and cached (implemented by i18n-core). Returns the reviewed translation when the memory has one; a miss is `text: null` with `origin: null`, never an error. Answers 400 for a bad or missing locale/q, and 413 when q exceeds 2000 characters.",
        tags: ["i18n"],
        security: securityPublic,
        parameters: [
          queryParameter("locale", "Target locale.", { type: "string", enum: ["ta", "en", "hi"], example: "hi" }),
          queryParameter("q", "Source text to look up (≤ 2000 characters).", { type: "string", example: "Guardian" }),
        ],
        responses: {
          "200": {
            description: "Memory hit or miss (text null when absent)",
            content: {
              "application/json": {
                schema: ref("TranslateLookupResponse"),
                example: { source: "Guardian", locale: "hi", text: "संरक्षक", origin: "tm" },
              },
            },
          },
          "400": errorResponse("locale is not ta/en/hi, or q is missing/empty."),
          "413": errorResponse("q is longer than 2000 characters."),
        },
      },
      post: {
        operationId: "translate",
        summary: "Translate entries into a locale (Circle-gated)",
        description:
          "Implemented by i18n-core (src/lib/translate-core.ts). Circle session + same-origin. ≤ 200 entries, ≤ 2000 characters each; the body may spell the list `strings` (i18n-core's name) or `entries` (the typed client's), and each item `text` or `source`. Provider precedence YAZHI_TRANSLATE_URL+KEY, then YAZHI_API_URL.\n\n**An unconfigured provider is not an error.** The route answers 200, returns every entry as a draft (`origin: \"mt\"`, `reviewRequired: true`) and adds `warnings: [\"translation memory unavailable: no provider configured\"]`. AI/provider output is always saved reviewRequired and is never served as reviewed.\n\nMethods other than GET/POST/OPTIONS answer 405 with `Allow: GET, POST, OPTIONS`.",
        tags: ["i18n"],
        security: securityCircle,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description:
                  "Send exactly one of `strings` or `entries` — they are the same list under two names and `strings` wins if both are present. `parseTranslatePost` requires at least one of them.",
                required: ["locale"],
                properties: {
                  locale: { type: "string", enum: ["ta", "en", "hi"], example: "hi" },
                  source: {
                    type: "string",
                    enum: ["en"],
                    default: "en",
                    description: "The language the inputs are written in. Only en is supported today.",
                  },
                  strings: {
                    type: "array",
                    maxItems: 200,
                    description: "The entry list (i18n-core's name; `entries` is the accepted alias).",
                    items: {
                      type: "object",
                      required: ["key"],
                      properties: {
                        key: { type: "string", example: "site.nav.guardian" },
                        text: { type: "string", maxLength: 2000, description: "The text to translate. `source` is the accepted alias; one of the two is required." },
                        source: { type: "string", maxLength: 2000, description: "Alias of `text`, used by the typed client." },
                        context: { type: "string" },
                      },
                    },
                  },
                  entries: {
                    type: "array",
                    maxItems: 200,
                    description: "Alias of `strings`, accepted so the typed client can send the same shape it uses elsewhere.",
                    items: {
                      type: "object",
                      required: ["key"],
                      properties: {
                        key: { type: "string" },
                        source: { type: "string", maxLength: 2000, description: "Alias of `text`." },
                        text: { type: "string", maxLength: 2000 },
                        context: { type: "string" },
                      },
                    },
                  },
                },
              },
              example: { locale: "hi", strings: [{ key: "site.nav.guardian", text: "Guardian" }] },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Translations — including the unconfigured-provider case, which is a 200 with warnings and draft entries.",
            content: {
              "application/json": {
                schema: ref("TranslateResponse"),
                example: {
                  locale: "hi",
                  translations: [{ key: "site.nav.guardian", text: "Guardian", origin: "mt", reviewRequired: true }],
                  warnings: ["translation memory unavailable: no provider configured"],
                },
              },
            },
          },
          "400": errorResponse("Malformed JSON, a bad locale, a missing/empty list, or source not \"en\"."),
          "401": errorResponse("No Circle session."),
          "403": errorResponse("Cross-site request."),
          "405": errorResponse("A method other than GET/POST/OPTIONS (carries `Allow`)."),
          "413": errorResponse("The body, the number of entries, or one entry's text is too large."),
          "422": errorResponse("An entry or field has the wrong type."),
          "503": errorResponse("Circle itself is unreachable (never used for a missing provider)."),
        },
      },
      options: {
        operationId: "optionsTranslate",
        summary: "CORS preflight / proxy probe",
        description:
          "Answers 204 with `Allow: GET, POST, OPTIONS`, so the route never looks absent to a proxy or a browser preflight. Other methods (PUT/PATCH/DELETE) answer 405 with the same `Allow` header.",
        tags: ["i18n"],
        security: securityPublic,
        responses: {
          "204": { description: "No content; see the `Allow` header.", headers: { Allow: { schema: { type: "string", example: "GET, POST, OPTIONS" } } } },
          "405": errorResponse("A method other than GET/POST/OPTIONS."),
        },
      },
    },
    "/api/openapi.json": {
      get: {
        operationId: "getOpenApi",
        summary: "This document",
        description: "The documented v1 surface. Version 1.0.0.",
        tags: ["meta"],
        security: securityPublic,
        responses: {
          "200": { description: "OpenAPI 3.1 document", content: { "application/json": { schema: { type: "object" } } } },
        },
      },
    },
  };

  return {
    openapi: "3.1.0",
    info: {
      title: "Yazhi API",
      version: OPENAPI_VERSION,
      summary: "The typed surface yazhi.dev and every partner call: the bubble registry, health, agents, runs and translation.",
      description: [
        "Every JSON error is `{ error, code?, field? }` with an HTTP status. Every stream line is `{ text }`, `{ error }` or `{ done: true }`.",
        "Paths are unversioned in the Next app; this document is the `v1` public surface.",
        "Auth: browser callers hold httpOnly Circle session cookies; no bearer token is ever exposed to a page. Partner API keys are not issued yet (docs/API.md §Not yet built).",
      ].join("\n\n"),
      contact: { name: "Yazhi", url: "https://yazhi.dev" },
      license: { name: "See /LICENSE in the repository" },
    },
    servers: [{ url: "/", description: "Same origin" }],
    tags: [
      { name: "meta", description: "Health, roster, this document." },
      { name: "registry", description: "Publishing and browsing bubbles." },
      { name: "run", description: "Streaming a bubble's answer." },
      { name: "i18n", description: "Translation memory and drafts." },
    ],
    paths,
    components: {
      securitySchemes: {
        circleCookie: {
          type: "apiKey",
          in: "cookie",
          name: "yz_circle_at",
          description: "httpOnly Circle session access token, set by /api/circle/signin. Not readable from JavaScript.",
        },
      },
      schemas: {
        Error: errorBody,
        BubbleManifest: bubbleManifestSchema,
        BubbleVersion: bubbleVersionSchema,
        ListBubblesResponse: {
          type: "object",
          required: ["bubbles"],
          properties: {
            bubbles: { type: "array", items: ref("BubbleVersion") },
            nextPageToken: { type: "string", description: "Absent when the listing is complete." },
          },
        },
        PublishResponse: {
          type: "object",
          required: ["version"],
          properties: {
            version: ref("BubbleVersion"),
            warnings: {
              type: "array",
              items: { type: "string" },
              description: 'Registry notes, e.g. "unsigned" when YAZHI_REGISTRY_SECRET is unset.',
            },
          },
        },
        WithdrawResponse: {
          type: "object",
          required: ["withdrawn"],
          properties: { withdrawn: { type: "array", items: ref("BubbleVersion") } },
        },
        ManifestCheck: {
          type: "object",
          required: ["ok", "errors", "warnings", "detected"],
          properties: {
            ok: { type: "boolean" },
            errors: { type: "array", items: { type: "string" } },
            warnings: { type: "array", items: { type: "string" }, example: ["unsigned"] },
            detected: {
              type: "object",
              required: ["schema"],
              properties: {
                schema: { type: "string", example: "yazhi.bubble/v1" },
                name: { type: "string" },
                version: { type: "string" },
                languages: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
        Health: {
          type: "object",
          required: ["status", "version", "i18n", "bubble", "runtimes", "models"],
          properties: {
            status: { type: "string", enum: ["ok"] },
            version: { type: "string", example: "1.0.0" },
            i18n: {
              type: "object",
              required: ["locales", "default"],
              properties: {
                locales: { type: "array", items: { type: "string" }, example: ["ta", "en", "hi"] },
                default: { type: "string", example: "ta" },
              },
            },
            bubble: {
              type: "object",
              required: ["schema", "version"],
              properties: { schema: { type: "string", example: "yazhi.bubble" }, version: { type: "string", example: "v1" } },
            },
            runtimes: { type: "array", items: { type: "string", enum: ["device", "yazhi-api"] } },
            models: { type: "array", items: { type: "string" }, example: ["adhan"] },
          },
        },
        AgentSummary: {
          type: "object",
          required: ["id", "name", "provider", "model", "hasTa"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            taName: { type: "string", description: "Draft until a native speaker reviews it." },
            provider: { type: "string", enum: ["adhan", "gemini", "openai"] },
            model: { type: "string" },
            hasTa: { type: "boolean" },
          },
        },
        AgentsResponse: {
          type: "object",
          required: ["agents"],
          properties: { agents: { type: "array", items: ref("AgentSummary") } },
        },
        TranslateResponse: {
          type: "object",
          required: ["locale", "translations", "warnings"],
          properties: {
            locale: { type: "string", enum: ["ta", "en", "hi"], example: "hi" },
            translations: {
              type: "array",
              items: {
                type: "object",
                required: ["key", "text", "origin", "reviewRequired"],
                properties: {
                  key: { type: "string", example: "site.nav.guardian" },
                  text: { type: "string", example: "संरक्षक" },
                  origin: { type: "string", enum: ["tm", "reviewed", "ai", "mt"] },
                  reviewRequired: {
                    type: "boolean",
                    description: "True for every draft (origin ai/mt). A draft is never presented as reviewed.",
                  },
                },
              },
            },
            warnings: {
              type: "array",
              items: { type: "string" },
              description:
                "Empty when a provider ran. Carries \"translation memory unavailable: no provider configured\" when none is set — that is a 200 with draft entries, not an error.",
              example: [],
            },
          },
        },
        TranslateLookupResponse: {
          type: "object",
          required: ["source", "locale", "text", "origin"],
          properties: {
            source: { type: "string", example: "Guardian" },
            locale: { type: "string", enum: ["ta", "en", "hi"] },
            text: { type: ["string", "null"], description: "null on a memory miss." },
            origin: { type: ["string", "null"], enum: ["tm", "reviewed", null] },
          },
        },
      },
    },
  };
}

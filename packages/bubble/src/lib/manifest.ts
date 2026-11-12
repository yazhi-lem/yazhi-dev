/** Bubble manifest — the contract between a bubble a developer builds and
    the Bubble UI host that runs it. Plain data; safe on server
    and client. Documented for builders at /bubble#manifest.

    Two schema versions are accepted:
      yazhi.bubble/v0  the original shape, still what every shipped bubble
                       uses. validateManifest() and its messages are frozen:
                       /api/bubble/run reports them verbatim, so changing one
                       changes a public response.
      yazhi.bubble/v1  adds `languages` (BCP-47, required), `domain` and
                       `forkedFrom`, and optionally a signed `author`. This is
                       what the registry (POST /api/bubbles) accepts. */

export const BUBBLE_SCHEMA = "yazhi.bubble/v0" as const;
export const BUBBLE_SCHEMA_V1 = "yazhi.bubble/v1" as const;

/** Where a bubble's model runs.
    - "device":    an OpenAI-compatible model server on this machine or LAN
                   (llama.cpp, Ollama, a yazhi-one box). Works with no internet.
    - "yazhi-api": Adhan through yazhi-api, reached via yazhi.dev's server.
                   Needs a Circle session and a network path to yazhi-api. */
export type BubbleRuntime = "device" | "yazhi-api";

/** What a bubble asks the host for. The host grants nothing undeclared. */
export type BubblePermission = "yazhi-api" | "clipboard";

export type BubbleSize = "s" | "m" | "l";

export interface BubbleManifest {
  schema: typeof BUBBLE_SCHEMA;
  /** reverse-dns style id, e.g. "circle.<account>.tamil-tutor" */
  id: string;
  version: string;
  name: string;
  /** Tamil display name — draft until a native speaker reviews it */
  taName?: string;
  description: string;
  /** hex accent for the bubble in the tray */
  accent: string;
  size: BubbleSize;
  agent: {
    systemPrompt: string;
    greeting: string;
    /** wrap the prompt in the Five-Posture Reasoning Kernel */
    fivePosture: boolean;
  };
  runtime: {
    /** tried first; the host falls back to "device" when offline */
    prefer: BubbleRuntime;
    /** model id on yazhi-api (allow-listed server-side) */
    model: string;
    /** model id on the device server, e.g. "adhan-kutty" or "qwen3:4b" */
    deviceModel: string;
  };
  permissions: BubblePermission[];
  /** the publishing builder's Circle account; absent on unsigned
      manifests */
  author?: { circleAccountId: string; name: string };
  createdAt: string;
  updatedAt: string;
}

/** v1: everything v0 has, plus a language contract and provenance.
    `languages` is what /api/bubbles?lang= filters on, so it is required —
    a bubble nobody can find by language is not publishable. */
export interface BubbleManifestV1 extends Omit<BubbleManifest, "schema" | "author"> {
  schema: typeof BUBBLE_SCHEMA_V1;
  /** BCP-47 tags the bubble speaks, most-used first, e.g. ["ta-IN", "en"].
      "ta" matches "ta-IN", "ta-LK" and "ta" (prefix match, see languageMatches). */
  languages: string[];
  /** free-form domain label used by /api/bubbles?domain= ("education",
      "health", "civic", "commerce", …). A convention, not a closed list. */
  domain?: string;
  /** the bubble this one was forked from. Provenance only; it grants no
      special rights to the fork's author. */
  forkedFrom?: { id: string; version: string };
  /** stamped by the registry on publish, never by the builder */
  author?: { circleAccountId: string; name: string };
}

/** Either version, as the registry or a host may hold it. */
export type AnyBubbleManifest = BubbleManifest | BubbleManifestV1;

export interface BubbleMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** which runtime produced an assistant message */
  via?: BubbleRuntime;
}

/** Wraps a system prompt in the Five-Posture Reasoning Kernel that every
    Yazhi agent runs through (Aram harness §4). */
export function withFivePosture(systemPrompt: string): string {
  return [
    systemPrompt.trim(),
    "",
    "Before you answer, work through these five postures silently and let them shape the reply:",
    "1. Context (சூழல் அறிதல்) — who is asking, which language mix they use, which rules apply.",
    "2. Reason (ஆய்தல்) — which sources support the answer, and what is missing.",
    "3. Plan (திட்டமிடல்) — the steps, and which of them need a human to confirm.",
    "4. Respond (உரைத்தல்) — answer in the user's register; cite sources you rely on.",
    "5. Reflect (மீளாய்வு) — if you cannot support a claim, say \"தெரியவில்லை / I don't know\".",
  ].join("\n");
}

/** The system prompt actually sent to a model for this bubble. */
export function effectiveSystemPrompt(m: BubbleManifest): string {
  return m.agent.fivePosture ? withFivePosture(m.agent.systemPrompt) : m.agent.systemPrompt;
}

const HEX = /^#[0-9a-f]{6}$/i;
const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
export const MAX_PROMPT_CHARS = 8000;

/** Validate untrusted manifest JSON (an import, or a /api/bubble/run body).
    Returns a list of problems; empty means valid.

    FROZEN: /api/bubble/run returns these strings to the builder, so the
    wording and order are part of that route's behaviour. Add new checks in
    validateManifestV1() instead. */
export function validateManifest(input: unknown): string[] {
  const errors: string[] = [];
  const m = input as Partial<BubbleManifest> | null;
  if (!m || typeof m !== "object") return ["Manifest must be a JSON object."];
  if (m.schema !== BUBBLE_SCHEMA) errors.push(`schema must be "${BUBBLE_SCHEMA}".`);
  if (typeof m.id !== "string" || !ID.test(m.id) || m.id.length > 120)
    errors.push("id must be lowercase letters, digits, dots or dashes.");
  if (typeof m.name !== "string" || !m.name.trim() || m.name.length > 60)
    errors.push("name is required (max 60 characters).");
  if (m.taName !== undefined && (typeof m.taName !== "string" || m.taName.length > 60))
    errors.push("taName must be text (max 60 characters).");
  if (typeof m.description !== "string" || m.description.length > 280)
    errors.push("description must be text (max 280 characters).");
  if (typeof m.accent !== "string" || !HEX.test(m.accent)) errors.push("accent must be a #rrggbb colour.");
  if (!["s", "m", "l"].includes(m.size as string)) errors.push('size must be "s", "m" or "l".');
  const a = m.agent;
  if (!a || typeof a.systemPrompt !== "string" || !a.systemPrompt.trim())
    errors.push("agent.systemPrompt is required.");
  else if (a.systemPrompt.length > MAX_PROMPT_CHARS)
    errors.push(`agent.systemPrompt must be at most ${MAX_PROMPT_CHARS} characters.`);
  if (!a || typeof a.greeting !== "string" || a.greeting.length > 1000)
    errors.push("agent.greeting must be text (max 1000 characters).");
  if (!a || typeof a.fivePosture !== "boolean") errors.push("agent.fivePosture must be true or false.");
  const r = m.runtime;
  if (!r || !["device", "yazhi-api"].includes(r.prefer as string))
    errors.push('runtime.prefer must be "device" or "yazhi-api".');
  if (!r || typeof r.model !== "string" || r.model.length > 80) errors.push("runtime.model must be text.");
  if (!r || typeof r.deviceModel !== "string" || r.deviceModel.length > 80)
    errors.push("runtime.deviceModel must be text.");
  if (!Array.isArray(m.permissions) || m.permissions.some((p) => !["yazhi-api", "clipboard"].includes(p)))
    errors.push('permissions may only contain "yazhi-api" and "clipboard".');
  return errors;
}

/** BCP-47 tag as we accept it: language[-Script][-REGION], 2–3 letter
    primary subtag. Deliberately loose — the registry filters by prefix, it
    does not build a locale. */
const LANG_TAG = /^[a-z]{2,3}(?:-[a-z0-9]{1,8})*$/i;

export function isLanguageTag(tag: unknown): tag is string {
  return typeof tag === "string" && tag.length <= 35 && LANG_TAG.test(tag);
}

/** Does a manifest language tag match a query tag? Prefix match, either way
    and case-insensitive: "ta" matches "ta-IN" and "ta-LK"; "ta-IN" matches
    "ta" (a bubble that answers in generic Tamil is listed for ta-IN). */
export function languageMatches(manifestTag: string, queryTag: string): boolean {
  const a = manifestTag.toLowerCase();
  const b = queryTag.toLowerCase();
  return a === b || a.startsWith(`${b}-`) || b.startsWith(`${a}-`);
}

const SEMVER_V1 = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const DOMAIN = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/;

/** Validate a yazhi.bubble/v1 manifest. Returns problems (empty = valid).
    Looks like validateManifest() plus the v1 fields — and like
    validateManifest(), it never throws on hostile input.
    (`existing` lets a publisher prove a version bump; the registry passes
    the versions already stored for that name.) */
export function validateManifestV1(
  input: unknown,
  existing?: { versions?: string[]; ownerAccountId?: string }
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return ["Manifest must be a JSON object."];
  const v1 = input as Partial<BubbleManifestV1>;

  // the fields both versions share: reuse the frozen checks on a v0-shaped view
  const shared = validateManifest({ ...(input as object), schema: BUBBLE_SCHEMA });
  // drop the schema complaint — v1 is the expected schema here
  errors.push(...shared.filter((e) => !e.startsWith("schema must be")));

  if (!Array.isArray(v1.languages) || v1.languages.length === 0) {
    errors.push("languages must list at least one BCP-47 tag (e.g. [\"ta-IN\", \"en\"]).");
  } else {
    if (v1.languages.length > 12) errors.push("languages may list at most 12 tags.");
    const bad = v1.languages.filter((tag) => !isLanguageTag(tag));
    if (bad.length) errors.push(`languages must be BCP-47 tags; not: ${bad.map((t) => JSON.stringify(t)).join(", ")}.`);
    const seen = new Set<string>();
    for (const tag of v1.languages) {
      if (typeof tag !== "string") continue;
      const key = tag.toLowerCase();
      if (seen.has(key)) errors.push(`languages lists "${tag}" twice.`);
      seen.add(key);
    }
  }
  if (v1.domain !== undefined && (typeof v1.domain !== "string" || v1.domain.length > 32 || !DOMAIN.test(v1.domain)))
    errors.push("domain must be a short lowercase label (letters, digits, dashes), e.g. \"education\".");
  if (v1.forkedFrom !== undefined) {
    const f = v1.forkedFrom;
    if (!f || typeof f !== "object" || typeof f.id !== "string" || !ID.test(f.id) || f.id.length > 120)
      errors.push("forkedFrom.id must be a bubble id.");
    else if (typeof f.version !== "string" || !SEMVER_V1.test(f.version))
      errors.push("forkedFrom.version must be MAJOR.MINOR.PATCH.");
    if (f && typeof f === "object" && typeof f.id === "string" && f.id === v1.id)
      errors.push("forkedFrom.id must differ from id — a bubble cannot fork itself.");
  }
  if (v1.author !== undefined) {
    const a = v1.author;
    if (!a || typeof a !== "object" || typeof a.circleAccountId !== "string" || !a.circleAccountId)
      errors.push("author.circleAccountId must be text (the registry stamps it).");
    else if (typeof a.name !== "string" || a.name.length > 120) errors.push("author.name must be text.");
  }

  // the version is required, must be MAJOR.MINOR.PATCH, and must be new. A
  // published version number is used up for good (bubbles.proto: WITHDRAWN is
  // terminal, the number stays used).
  if (typeof v1.version !== "string" || !SEMVER_V1.test(v1.version)) {
    errors.push("version must be MAJOR.MINOR.PATCH.");
  } else {
    const used = existing?.versions ?? [];
    if (used.includes(v1.version)) {
      errors.push(`version ${v1.version} is already published — bump it (e.g. ${nextVersionHint(v1.version)}).`);
    }
  }
  return errors;
}

function nextVersionHint(version: string): string {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
  return m ? `${m[1]}.${m[2]}.${Number(m[3]) + 1}` : "0.1.0";
}

export type ManifestNoteLevel = "error" | "warning";

export interface ManifestNote {
  level: ManifestNoteLevel;
  message: string;
}

export interface ManifestCheck {
  ok: boolean;
  errors: string[];
  warnings: string[];
  detected: {
    schema: string;
    name?: string;
    version?: string;
    languages?: string[];
  };
  /** the same findings, with a severity, for a UI that wants to colour them */
  notes: ManifestNote[];
}

/** Validate a manifest of either version and describe it. Never throws —
    this is what POST /api/manifest/validate runs on a builder's JSON, and
    what a client can call before publishing. `ok` means "publishable as
    declared"; warnings do not stop a publish (they are shown to the
    builder, and "unsigned" is one of them). */
export function checkManifest(input: unknown): ManifestCheck {
  const detected: ManifestCheck["detected"] = { schema: "" };
  const errors: string[] = [];
  const warnings: string[] = [];
  try {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return finish(["Manifest must be a JSON object."], [], detected);
    }
    const m = input as Record<string, unknown>;
    const schema = typeof m.schema === "string" ? m.schema : "";
    detected.schema = schema;
    if (typeof m.id === "string") detected.name = m.id;
    if (typeof m.version === "string") detected.version = m.version;
    if (Array.isArray(m.languages)) {
      detected.languages = (m.languages as unknown[]).filter((t): t is string => typeof t === "string");
    }

    if (schema === BUBBLE_SCHEMA_V1) {
      errors.push(...validateManifestV1(input));
      detectUnsigned(input, warnings);
      if (!detected.languages?.length && !errors.some((e) => e.startsWith("languages"))) {
        warnings.push("No languages declared — /api/bubbles?lang= will not list this bubble.");
      }
    } else if (schema === BUBBLE_SCHEMA) {
      errors.push(...validateManifest(input));
      const m0 = input as unknown as BubbleManifest;
      if (typeof m0.runtime?.prefer === "string" && m0.runtime.prefer === "yazhi-api" && !m0.permissions?.includes("yazhi-api")) {
        warnings.push('runtime.prefer is "yazhi-api" but the "yazhi-api" permission is not declared; the host will run it on-device.');
      }
      if (m0.agent && m0.agent.fivePosture === false) {
        warnings.push("fivePosture is off — Yazhi's agents run the Five-Posture Reasoning Kernel by default.");
      }
      if (m0.taName === undefined) {
        warnings.push("No taName — Tamil is the default language, so a Tamil display name is expected.");
      }
      warnings.push(`${BUBBLE_SCHEMA} is a preview schema — publish to the registry with ${BUBBLE_SCHEMA_V1} (add "languages").`);
      detectUnsigned(input, warnings);
    } else {
      errors.push(`schema must be "${BUBBLE_SCHEMA_V1}" (or "${BUBBLE_SCHEMA}" for a local bubble); got ${JSON.stringify(schema)}.`);
    }
  } catch (err) {
    // hostile input (a getter that throws, a proxy) must not crash a route
    errors.push(`Manifest could not be read: ${err instanceof Error ? err.message : "unknown error"}.`);
  }
  return finish(errors, warnings, detected);
}

function detectUnsigned(input: unknown, warnings: string[]): void {
  const author = (input as { author?: { circleAccountId?: unknown } }).author;
  if (!author || typeof author !== "object" || typeof author.circleAccountId !== "string" || !author.circleAccountId) {
    warnings.push("unsigned");
  }
}

function finish(errors: string[], warnings: string[], detected: ManifestCheck["detected"]): ManifestCheck {
  const unique = [...new Set(errors)];
  const notes: ManifestNote[] = [
    ...unique.map((message) => ({ level: "error" as const, message })),
    ...warnings.map((message) => ({ level: "warning" as const, message })),
  ];
  return { ok: unique.length === 0, errors: unique, warnings, detected, notes };
}

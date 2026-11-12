/**
 * api-kernel — tests for the pure parts of the Yazhi API kernel.
 *
 * Run (Node 26 strips TypeScript natively; the hook supplies the tsconfig path
 * aliases and stubs Next's request context and the Circle session):
 *
 *   node --import ./scripts/api-kernel.hooks.mjs --test scripts/api-kernel.test.mjs
 *
 * Covers, per task-2's acceptance criteria:
 *   - manifest validation for v0 and v1, and checkManifest on hostile input
 *   - semver compare / bump / version matching, language prefix matching
 *   - canonical JSON and HMAC signing with and without YAZHI_REGISTRY_SECRET
 *   - the in-memory registry lifecycle: publish → list → review → withdraw,
 *     including ownership, version ordering, visibility and terminal states
 *   - the handler cores end to end (health, agents, validate, publish, get,
 *     list, review, withdraw)
 *   - the OpenAPI document: 3.1, version 1.0.0, every operation has responses
 *     and a security entry, and every documented path exists
 *   - streaming: NDJSON and SSE encodings decode back to the same chunks
 *   - the typed client: httpPort decoding, error mapping, 429/503 retry
 *   - bounded request bodies: 413 before a large read (declared and chunked)
 *   - the "no server secret in a client module" rule, including the
 *     ports / ports-local split that keeps Circle out of the client graph
 *   - the OpenAPI translate operation matches i18n-core's 200-with-warnings
 *     fallback rather than a 503
 *
 * Assertions: 300+ `assert` calls across 34 tests.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── modules under test (imported through the hook) ─────────────────────── */

const manifestMod = await import("@yazhi/bubble/lib/manifest");
const bubbleMod = await import("@yazhi/bubble/lib/bubble");
const signingMod = await import("@/lib/api/signing");
const registryMod = await import("@/lib/api/registry");
const typesMod = await import("@/lib/api/types");
const sseMod = await import("@/lib/api/sse");
const openapiMod = await import("@/lib/api/openapi");
const clientMod = await import("@/lib/api/client");
const portsMod = await import("@/lib/api/ports");
const maintainersMod = await import("@/lib/api/maintainers");
const healthMod = await import("@/lib/api/handlers/health");
const agentsMod = await import("@/lib/api/handlers/agents");
const validateMod = await import("@/lib/api/handlers/manifest");
const publishMod = await import("@/lib/api/handlers/publish");
const listMod = await import("@/lib/api/handlers/list");
const getMod = await import("@/lib/api/handlers/get");
const reviewMod = await import("@/lib/api/handlers/review");
const withdrawMod = await import("@/lib/api/handlers/withdraw");
const coreMod = await import("@/lib/api/handlers/core");
const httpMod = await import("@/lib/api/handlers/http");
const envMod = await import("@/lib/api/env");

const {
  BUBBLE_SCHEMA,
  BUBBLE_SCHEMA_V1,
  validateManifest,
  validateManifestV1,
  checkManifest,
  isLanguageTag,
  languageMatches,
} = manifestMod;
const { compareVersion, bumpVersion, isVersion, latestVersion, versionDelta, isValidBubbleName } = bubbleMod;
const { canonicalJson, signManifest, verifyManifest } = signingMod;
const { InMemoryRegistry, RegistryError, canSee, memoryRegistry, encodePageToken, decodePageToken, clampPageSize } = registryMod;
const { API_VERSION } = typesMod;
const sse = sseMod;
const { openApiDocument, API_ROUTES, OPENAPI_VERSION } = openapiMod;
const { createClient, YazhiApiError } = clientMod;
const { httpPort, decodeStream } = portsMod;
const { health } = healthMod;
const { agents } = agentsMod;
const { validateManifestHandler } = validateMod;
const { publishBubble } = publishMod;
const { listBubbles } = listMod;
const { getBubble } = getMod;
const { reviewBubble } = reviewMod;
const { withdrawBubble } = withdrawMod;
const { baseInput } = coreMod;

/* ── fixtures ───────────────────────────────────────────────────────────── */

const AUTHOR = { accountId: "acct_author", name: "Ari", email: "ari@yazhi.dev", maintainer: false };
const MAINTAINER = { accountId: "acct_maint", name: "Meena", email: "meena@yazhi.dev", maintainer: true };
const OTHER = { accountId: "acct_other", name: "Oviya", email: "oviya@yazhi.dev", maintainer: false };

function v1Manifest(overrides = {}) {
  return {
    schema: BUBBLE_SCHEMA_V1,
    id: "tamil-tutor",
    version: "1.0.0",
    name: "Tamil Tutor",
    taName: "தமிழ் ஆசிரியர்",
    description: "A patient Tamil tutor for beginners — drafts pending native review.",
    accent: "#d3b36a",
    size: "m",
    agent: {
      systemPrompt: "You are a patient Tamil tutor. Answer Tamil first, then English.",
      greeting: "வணக்கம்!",
      fivePosture: true,
    },
    runtime: { prefer: "yazhi-api", model: "adhan", deviceModel: "adhan-kutty" },
    permissions: ["yazhi-api"],
    languages: ["ta-IN", "en"],
    domain: "education",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

function v0Manifest(overrides = {}) {
  return {
    schema: BUBBLE_SCHEMA,
    id: "local-toy",
    version: "0.1.0",
    name: "Local Toy",
    description: "Runs on the device.",
    accent: "#4a8ab5",
    size: "s",
    agent: { systemPrompt: "Be brief.", greeting: "hi", fivePosture: true },
    runtime: { prefer: "device", model: "adhan", deviceModel: "adhan-kutty" },
    permissions: ["clipboard"],
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

/** A handler call as an adapter would build it. */
function call(overrides = {}) {
  return baseInput({
    caller: null,
    query: new URLSearchParams(),
    body: "",
    format: "ndjson",
    allowedOrigin: true,
    ...overrides,
  });
}

/** A fresh in-memory registry per test (the module-level store is shared). */
function freshRegistry() {
  registryMod.__resetMemoryRegistry();
  return memoryRegistry();
}

/* ── 1. manifest: v0 frozen, v1 additive, checkManifest never throws ───── */

test("validateManifest is byte-for-byte the v0 contract", () => {
  assert.deepEqual(validateManifest(v0Manifest()), []);
  assert.deepEqual(validateManifest(null), ["Manifest must be a JSON object."]);
  const wrongSchema = validateManifest(v1Manifest());
  assert.ok(wrongSchema[0].includes(`schema must be "${BUBBLE_SCHEMA}"`));
  const badAccent = validateManifest(v0Manifest({ accent: "#zzz" }));
  assert.deepEqual(badAccent, ["accent must be a #rrggbb colour."]);
  assert.equal(BUBBLE_SCHEMA, "yazhi.bubble/v0");
  assert.equal(BUBBLE_SCHEMA_V1, "yazhi.bubble/v1");
});

test("validateManifestV1 requires the v1 additions and rejects bad values", () => {
  assert.deepEqual(validateManifestV1(v1Manifest()), []);
  assert.ok(validateManifestV1(v1Manifest({ languages: [] })).join(" ").includes("languages must list"));
  assert.ok(validateManifestV1(v1Manifest({ languages: ["ta-IN", "ta-in"] })).join(" ").includes("twice"));
  assert.ok(validateManifestV1(v1Manifest({ languages: ["not a tag!"] })).join(" ").includes("BCP-47"));
  assert.ok(validateManifestV1(v1Manifest({ domain: "Not A Domain" })).join(" ").includes("domain must be"));
  assert.ok(
    validateManifestV1(v1Manifest({ forkedFrom: { id: "tamil-tutor", version: "1.0.0" } })).join(" ").includes("cannot fork itself")
  );
  assert.ok(validateManifestV1(v1Manifest({ version: "1.0" })).join(" ").includes("version must be MAJOR.MINOR.PATCH"));
  // an already-published version cannot come back
  assert.ok(
    validateManifestV1(v1Manifest(), { versions: ["1.0.0"] }).join(" ").includes("already published")
  );
});

test("checkManifest accepts v0 or v1, warns, and never throws", () => {
  const v1 = checkManifest(v1Manifest());
  assert.equal(v1.ok, true);
  assert.equal(v1.detected.schema, BUBBLE_SCHEMA_V1);
  assert.equal(v1.detected.name, "tamil-tutor");
  assert.deepEqual(v1.detected.languages, ["ta-IN", "en"]);
  assert.ok(v1.warnings.includes("unsigned"));

  const v0 = checkManifest(v0Manifest({ taName: "உள்ளூர்" }));
  assert.equal(v0.ok, true);
  assert.ok(v0.warnings.some((w) => w.includes("preview schema")));

  // runtime.prefer yazhi-api without the permission is a warning, not an error
  const noPerm = checkManifest(v0Manifest({ runtime: { prefer: "yazhi-api", model: "adhan", deviceModel: "x" }, taName: "ஓ" }));
  assert.equal(noPerm.ok, true);
  assert.ok(noPerm.warnings.some((w) => w.includes("permission")));

  // hostile input
  assert.equal(checkManifest(undefined).ok, false);
  assert.equal(checkManifest([]).ok, false);
  assert.equal(checkManifest("nope").ok, false);
  assert.equal(checkManifest({ schema: "yazhi.bubble/v9" }).ok, false);
  const thrower = {
    get schema() {
      throw new Error("boom");
    },
  };
  const hostile = checkManifest(thrower);
  assert.equal(hostile.ok, false);
  assert.ok(hostile.errors[0].startsWith("Manifest could not be read"));
  // every finding is also in notes, with a level
  assert.ok(v1.notes.every((n) => n.level === "error" || n.level === "warning"));
});

test("language matching is a case-insensitive BCP-47 prefix either way", () => {
  assert.equal(languageMatches("ta-IN", "ta"), true);
  assert.equal(languageMatches("ta", "ta-IN"), true);
  assert.equal(languageMatches("TA-lk", "ta"), true);
  assert.equal(languageMatches("ta", "en"), false);
  assert.equal(languageMatches("ta-IN", "tam"), false); // no partial subtag match
  assert.equal(isLanguageTag("ta"), true);
  assert.equal(isLanguageTag("zh-Hant-TW"), true);
  assert.equal(isLanguageTag("x"), false);
  assert.equal(isLanguageTag("ta_"), false);
});

/* ── 2. semver ─────────────────────────────────────────────────────────── */

test("compareVersion and bumpVersion order MAJOR.MINOR.PATCH", () => {
  assert.ok(compareVersion("1.0.0", "1.0.1") < 0);
  assert.ok(compareVersion("1.10.0", "1.9.9") > 0); // numeric, not lexical
  assert.equal(compareVersion("2.0.0", "2.0.0"), 0);
  assert.ok(compareVersion("10.0.0", "9.9.9") > 0);
  assert.equal(bumpVersion("1.2.3", "patch"), "1.2.4");
  assert.equal(bumpVersion("1.2.3", "minor"), "1.3.0");
  assert.equal(bumpVersion("1.2.3", "major"), "2.0.0");
  assert.equal(bumpVersion("1.2.3"), "1.2.4"); // patch is the default
  assert.equal(bumpVersion("nonsense"), "0.1.0");
  assert.equal(isVersion("1.0.0"), true);
  assert.equal(isVersion("01.0.0"), false); // no leading zeros
  assert.equal(isVersion("1.0.0-rc.1"), false);
  assert.equal(latestVersion(["1.0.0", "2.1.0", "1.5.2"]), "2.1.0");
  assert.equal(latestVersion(["nope"]), null);
  assert.equal(versionDelta("1.0.0", "1.1.0"), "minor");
  assert.equal(versionDelta("1.0.0", "1.0.0"), null);
});

test("bubble names and manifest size helpers agree with validateManifest", () => {
  assert.equal(isValidBubbleName("tamil-tutor"), true);
  assert.equal(isValidBubbleName("circle.abc.tutor"), true);
  assert.equal(isValidBubbleName("Tamil"), false);
  assert.equal(isValidBubbleName("-tutor"), false);
  assert.ok(bubbleMod.manifestSizeBytes(v1Manifest()) < bubbleMod.MAX_MANIFEST_BYTES);
  assert.equal(bubbleMod.manifestSizeBytes(BigInt(1)), Number.POSITIVE_INFINITY);
});

/* ── 3. signing ────────────────────────────────────────────────────────── */

test("canonical JSON is key-order independent at every depth", () => {
  const a = { b: 1, a: { z: [1, { y: 2, x: 3 }], c: "ta" } };
  const b = { a: { c: "ta", z: [1, { x: 3, y: 2 }] }, b: 1 };
  assert.equal(canonicalJson(a), canonicalJson(b));
  assert.equal(canonicalJson(a), '{"a":{"c":"ta","z":[1,{"x":3,"y":2}]},"b":1}');
  assert.equal(canonicalJson({ a: undefined, b: 1 }), '{"b":1}');
  assert.equal(canonicalJson(() => 1), null);
});

test("signManifest/verifyManifest with and without YAZHI_REGISTRY_SECRET", () => {
  const saved = process.env.YAZHI_REGISTRY_SECRET;
  try {
    delete process.env.YAZHI_REGISTRY_SECRET;
    const unsigned = signManifest(v1Manifest());
    assert.equal(unsigned.signed, false);
    assert.equal(unsigned.signature, undefined);
    assert.deepEqual(unsigned.warnings, ["unsigned"]);
    assert.equal(verifyManifest(v1Manifest(), undefined).reason, "unsigned");

    process.env.YAZHI_REGISTRY_SECRET = "test-secret-not-a-real-one";
    const signed = signManifest(v1Manifest());
    assert.equal(signed.signed, true);
    assert.ok(signed.signature.startsWith("v1:"));
    assert.deepEqual(signed.warnings, []);
    assert.equal(verifyManifest(v1Manifest(), signed.signature).valid, true);

    // key order does not matter; content does
    const reordered = Object.fromEntries(Object.entries(v1Manifest()).reverse());
    assert.equal(verifyManifest(reordered, signed.signature).valid, true);
    assert.equal(verifyManifest(v1Manifest({ name: "Tampered" }), signed.signature).reason, "mismatch");
    assert.equal(verifyManifest(v1Manifest(), "v2:abc").reason, "bad_format");
    assert.equal(verifyManifest(v1Manifest(), undefined).reason, "missing_signature");

    // a different secret cannot verify
    assert.equal(verifyManifest(v1Manifest(), signed.signature, "another-secret").reason, "mismatch");
  } finally {
    if (saved === undefined) delete process.env.YAZHI_REGISTRY_SECRET;
    else process.env.YAZHI_REGISTRY_SECRET = saved;
  }
});

/* ── 4. registry lifecycle ─────────────────────────────────────────────── */

test("publish → list → review → withdraw lifecycle", async () => {
  const registry = freshRegistry();
  registryMod.__resetRegistrySelection();
  const published = await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest() } });
  assert.equal(published.version.status, "in_review");
  assert.equal(published.version.authorAccountId, AUTHOR.accountId);
  assert.equal(published.version.name, "tamil-tutor");
  assert.equal(published.version.visibility, "public");
  assert.deepEqual(published.warnings, ["unsigned"]); // no secret in this test
  assert.equal(published.version.manifest.author.circleAccountId, AUTHOR.accountId);
  assert.match(published.version.createdAt, /^\d{4}-\d\d-\d\dT/);

  // the author sees it, a stranger does not, and "not found" is not "forbidden"
  const mine = await registry.list({ actor: AUTHOR, query: { mine: true } });
  assert.equal(mine.bubbles.length, 1);
  assert.equal(mine.bubbles[0].status, "in_review");
  assert.deepEqual((await registry.list({ actor: OTHER, query: {} })).bubbles, []);
  assert.deepEqual((await registry.list({ actor: null, query: {} })).bubbles, []);
  await assert.rejects(registry.get({ actor: OTHER, name: "tamil-tutor" }), (err) => {
    assert.ok(err instanceof RegistryError);
    assert.equal(err.status, 404);
    assert.equal(err.code, "not_found");
    return true;
  });

  // the maintainer sees the review queue
  const queue = await registry.list({ actor: MAINTAINER, query: { status: "in_review" } });
  assert.equal(queue.bubbles.length, 1);

  // review: nobody reviews their own bubble; reject needs a note; approve publishes
  await assert.rejects(
    registry.review({ actor: { ...MAINTAINER, accountId: AUTHOR.accountId }, name: "tamil-tutor", input: { version: "1.0.0", decision: "approve" } }),
    (err) => err.code === "self_review" && err.status === 403
  );
  await assert.rejects(
    registry.review({ actor: MAINTAINER, name: "tamil-tutor", input: { version: "1.0.0", decision: "reject" } }),
    (err) => err.status === 400
  );
  const approved = await registry.review({
    actor: MAINTAINER,
    name: "tamil-tutor",
    input: { version: "1.0.0", decision: "approve", note: "Tamil name reviewed." },
  });
  assert.equal(approved.status, "published");
  assert.equal(approved.reviewedByAccountId, MAINTAINER.accountId);
  assert.equal(approved.reviewDecision, "approve");
  // now anonymous callers see it
  assert.equal((await registry.list({ actor: null, query: {} })).bubbles.length, 1);

  // queries: lang prefix, domain, q, status
  assert.equal((await registry.list({ actor: null, query: { lang: "ta" } })).bubbles.length, 1);
  assert.equal((await registry.list({ actor: null, query: { lang: "hi" } })).bubbles.length, 0);
  assert.equal((await registry.list({ actor: null, query: { domain: "education" } })).bubbles.length, 1);
  assert.equal((await registry.list({ actor: null, query: { q: "தமிழ்" } })).bubbles.length, 1);
  assert.equal((await registry.list({ actor: null, query: { status: "in_review" } })).bubbles.length, 0);

  // withdraw: author or maintainer; terminal; the number stays used
  const first = await registry.withdraw({ actor: AUTHOR, name: "tamil-tutor", input: { reason: "Superseded." } });
  assert.equal(first.withdrawn.length, 1);
  assert.equal(first.withdrawn[0].status, "withdrawn");
  assert.deepEqual((await registry.list({ actor: null, query: {} })).bubbles.length, 0);
  await assert.rejects(
    registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest() } }),
    (err) => err.status === 409 && err.code === "version_conflict"
  );
  // the next version must be greater than every stored one
  const next = await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest({ version: "1.0.1" }) } });
  assert.equal(next.version.version, "1.0.1");
});

test("ownership and version ordering are enforced across accounts", async () => {
  const registry = freshRegistry();
  await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest() } });
  await assert.rejects(
    registry.publish({ actor: OTHER, input: { manifest: v1Manifest({ version: "1.0.1" }) } }),
    (err) => err.status === 403 && err.code === "not_owner"
  );
  await assert.rejects(
    registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest({ version: "0.9.0" }) } }),
    (err) => err.status === 409
  );
  // equal to the highest is also refused
  await assert.rejects(
    registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest({ version: "1.0.0" }) } }),
    (err) => err.status === 409
  );
  await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest({ version: "1.0.1" }) } });
  const latest = await registry.get({ actor: AUTHOR, name: "tamil-tutor" });
  assert.equal(latest.version, "1.0.1");
  assert.equal((await registry.get({ actor: AUTHOR, name: "tamil-tutor", version: "1.0.0" })).version, "1.0.0");
});

test("visibility: published+public ∪ own ∪ maintainer; private hides from strangers", async () => {
  const registry = freshRegistry();
  await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest(), visibility: "private" } });
  await registry.review({ actor: MAINTAINER, name: "tamil-tutor", input: { version: "1.0.0", decision: "approve" } });
  assert.equal((await registry.list({ actor: null, query: {} })).bubbles.length, 0); // published but private
  assert.equal((await registry.list({ actor: AUTHOR, query: {} })).bubbles.length, 1);
  assert.equal((await registry.list({ actor: MAINTAINER, query: {} })).bubbles.length, 1);
  assert.equal((await registry.list({ actor: OTHER, query: {} })).bubbles.length, 0);
  await assert.rejects(registry.get({ actor: OTHER, name: "tamil-tutor" }), (err) => err.code === "not_found");

  assert.equal(canSee({ status: "published", visibility: "public", authorAccountId: "x" }, null), true);
  assert.equal(canSee({ status: "in_review", visibility: "public", authorAccountId: "x" }, null), false);
  assert.equal(canSee({ status: "in_review", visibility: "public", authorAccountId: "x" }, OTHER), false);
  assert.equal(canSee({ status: "rejected", visibility: "public", authorAccountId: "x" }, { ...OTHER, maintainer: true }), true);
});

test("paging is cursor-based and bounded", async () => {
  const registry = freshRegistry();
  for (const n of ["a-bubble", "b-bubble", "c-bubble"]) {
    await registry.publish({ actor: AUTHOR, input: { manifest: v1Manifest({ id: n, version: "1.0.0", languages: ["ta"], domain: "misc" }) } });
    await registry.review({ actor: MAINTAINER, name: n, input: { version: "1.0.0", decision: "approve" } });
  }
  const page1 = await registry.list({ actor: null, query: { pageSize: 2 } });
  assert.deepEqual(page1.bubbles.map((b) => b.name), ["a-bubble", "b-bubble"]);
  assert.ok(page1.nextPageToken);
  const page2 = await registry.list({ actor: null, query: { pageSize: 2, pageToken: page1.nextPageToken } });
  assert.deepEqual(page2.bubbles.map((b) => b.name), ["c-bubble"]);
  assert.equal(page2.nextPageToken, undefined);
  assert.equal(clampPageSize(undefined), 50);
  assert.equal(clampPageSize(9999), 200);
  assert.equal(decodePageToken(encodePageToken(7)), 7);
  assert.throws(() => decodePageToken("not-a-token"), (err) => err.status === 400);
});

test("YAZHI_GRPC_TARGET alone does not switch the registry; the toggle does", async () => {
  const savedTarget = process.env.YAZHI_GRPC_TARGET;
  const savedToggle = process.env.YAZHI_REGISTRY_GRPC;
  try {
    process.env.YAZHI_GRPC_TARGET = "127.0.0.1:50051";
    delete process.env.YAZHI_REGISTRY_GRPC;
    registryMod.__resetRegistrySelection();
    assert.equal((await registryMod.getRegistry()).kind, "memory");

    process.env.YAZHI_REGISTRY_GRPC = "1";
    registryMod.__resetRegistrySelection();
    const grpc = await registryMod.getRegistry();
    assert.equal(grpc.kind, "grpc");
    // the stub is honest: a typed 503, not a crash or a fake success
    await assert.rejects(grpc.list({ actor: null, query: {} }), (err) => err.status === 503 && err.code === "not_configured");

    delete process.env.YAZHI_GRPC_TARGET;
    delete process.env.YAZHI_REGISTRY_GRPC;
    registryMod.__resetRegistrySelection();
    assert.equal((await registryMod.getRegistry()).kind, "memory");
  } finally {
    if (savedTarget === undefined) delete process.env.YAZHI_GRPC_TARGET;
    else process.env.YAZHI_GRPC_TARGET = savedTarget;
    if (savedToggle === undefined) delete process.env.YAZHI_REGISTRY_GRPC;
    else process.env.YAZHI_REGISTRY_GRPC = savedToggle;
    registryMod.__resetRegistrySelection();
  }
});

/* ── 5. maintainers (fail-closed) ──────────────────────────────────────── */

test("maintainers come from YAZHI_MAINTAINERS and default to nobody", () => {
  const saved = process.env.YAZHI_MAINTAINERS;
  try {
    delete process.env.YAZHI_MAINTAINERS;
    assert.equal(maintainersMod.isMaintainer({ accountId: "acct_maint" }), false);
    assert.equal(maintainersMod.isMaintainer(null), false);

    process.env.YAZHI_MAINTAINERS = " acct_maint , Meena@Yazhi.dev ";
    assert.equal(maintainersMod.isMaintainer({ accountId: "acct_maint" }), true);
    assert.equal(maintainersMod.isMaintainer({ accountId: "x", email: "meena@yazhi.dev" }), true);
    assert.equal(maintainersMod.isMaintainer({ accountId: "x", email: "someone@yazhi.dev" }), false);

    process.env.YAZHI_MAINTAINERS = "   ";
    assert.equal(maintainersMod.isMaintainer({ accountId: "acct_maint" }), false);
  } finally {
    if (saved === undefined) delete process.env.YAZHI_MAINTAINERS;
    else process.env.YAZHI_MAINTAINERS = saved;
  }
});

/* ── 6. handler cores ──────────────────────────────────────────────────── */

test("GET /api/health has the contract shape", async () => {
  process.env.YAZHI_BUBBLE_MODELS = "adhan,adhan-kutty";
  const result = await health(call());
  assert.equal(result.kind, "json");
  assert.equal(result.status, 200);
  const body = result.body;
  assert.equal(body.status, "ok");
  assert.equal(body.version, "1.0.0");
  assert.deepEqual(body.i18n, { locales: ["ta", "en", "hi"], default: "ta" });
  assert.deepEqual(body.bubble, { schema: "yazhi.bubble", version: "v1" });
  assert.deepEqual(body.runtimes, ["device", "yazhi-api"]);
  assert.deepEqual(body.models, ["adhan", "adhan-kutty"]);
  delete process.env.YAZHI_BUBBLE_MODELS;
  assert.deepEqual((await health(call())).body.models, ["adhan"]);
});

test("GET /api/agents never leaks a system prompt", async () => {
  const result = await agents(call());
  assert.equal(result.status, 200);
  const { agents: roster } = result.body;
  assert.ok(roster.length >= 5);
  for (const agent of roster) {
    assert.equal(typeof agent.id, "string");
    assert.equal(typeof agent.name, "string");
    assert.equal(typeof agent.hasTa, "boolean");
    assert.ok(["adhan", "gemini", "openai"].includes(agent.provider));
    assert.equal("systemPrompt" in agent, false);
    assert.equal("greeting" in agent, false);
  }
  const pulavar = roster.find((a) => a.id === "pulavar");
  assert.equal(pulavar.hasTa, true);
  assert.equal(pulavar.taName, "புலவர்");
});

test("POST /api/manifest/validate is public, tolerant, and shaped right", async () => {
  const ok = await validateManifestHandler(call({ body: JSON.stringify({ manifest: v1Manifest() }) }));
  assert.equal(ok.status, 200);
  assert.equal(ok.body.ok, true);
  assert.deepEqual(ok.body.detected, { schema: BUBBLE_SCHEMA_V1, name: "tamil-tutor", version: "1.0.0", languages: ["ta-IN", "en"] });

  const bad = await validateManifestHandler(call({ body: JSON.stringify({ manifest: { schema: "x" } }) }));
  assert.equal(bad.status, 200); // validation ran; the verdict says no
  assert.equal(bad.body.ok, false);
  assert.ok(bad.body.errors.length > 0);

  assert.equal((await validateManifestHandler(call({ body: "{not json" }))).status, 400);
  assert.equal((await validateManifestHandler(call({ body: JSON.stringify({}) }))).status, 400);
  assert.equal((await validateManifestHandler(call({ body: JSON.stringify({ manifest: v1Manifest() }) }))).kind, "json");
});

test("POST /api/bubbles gates on sign-in, same-origin and a v1 manifest", async () => {
  freshRegistry();
  const body = JSON.stringify({ manifest: v1Manifest() });

  const anon = await publishBubble(call({ body }));
  assert.equal(anon.status, 401);
  assert.equal(anon.body.code, "unauthorized");

  const crossSite = await publishBubble(call({ body, caller: AUTHOR, allowedOrigin: false }));
  assert.equal(crossSite.status, 403);
  assert.equal(crossSite.body.code, "cross_site");

  const v0 = await publishBubble(call({ body: JSON.stringify({ manifest: v0Manifest() }), caller: AUTHOR }));
  assert.equal(v0.status, 400);
  assert.ok(v0.body.error.includes("yazhi.bubble/v1"));

  const badVisibility = await publishBubble(call({ body: JSON.stringify({ manifest: v1Manifest(), visibility: "secret" }), caller: AUTHOR }));
  assert.equal(badVisibility.status, 400);

  const created = await publishBubble(call({ body, caller: AUTHOR }));
  assert.equal(created.status, 201);
  assert.equal(created.body.version.status, "in_review");
  assert.equal(created.body.version.authorAccountId, AUTHOR.accountId);
  assert.deepEqual(created.body.warnings, ["unsigned"]);
  assert.equal(created.headers["Cache-Control"], "no-store");

  // a body-supplied author cannot impersonate
  const spoofed = await publishBubble(
    call({ body: JSON.stringify({ manifest: v1Manifest({ version: "1.0.1", author: { circleAccountId: "acct_victim", name: "X" } }) }), caller: AUTHOR })
  );
  assert.equal(spoofed.status, 201);
  assert.equal(spoofed.body.version.authorAccountId, AUTHOR.accountId);
  assert.equal(spoofed.body.version.manifest.author.circleAccountId, AUTHOR.accountId);
});

test("publish signs when a secret is configured", async () => {
  freshRegistry();
  process.env.YAZHI_REGISTRY_SECRET = "kernel-test-secret";
  try {
    const created = await publishBubble(call({ body: JSON.stringify({ manifest: v1Manifest() }), caller: AUTHOR }));
    assert.equal(created.status, 201);
    assert.equal(created.body.warnings, undefined); // signed: the field is omitted
    assert.match(created.body.version.signature, /^v1:/);
    assert.equal(verifyManifest(created.body.version.manifest, created.body.version.signature).valid, true);
  } finally {
    delete process.env.YAZHI_REGISTRY_SECRET;
  }
});

test("GET /api/bubbles and /api/bubbles/<name> respect visibility and 404 rules", async () => {
  freshRegistry();
  await publishBubble(call({ body: JSON.stringify({ manifest: v1Manifest() }), caller: AUTHOR }));
  await publishBubble(call({ body: JSON.stringify({ manifest: v1Manifest({ version: "1.0.1" }), visibility: "private" }), caller: AUTHOR }));

  // anonymous: nothing (not published, or published but private)
  assert.deepEqual((await listBubbles(call())).body.bubbles, []);
  // the author: both
  assert.equal((await listBubbles(call({ caller: AUTHOR }))).body.bubbles.length, 1);
  // latest visible is 1.0.1 for the author
  assert.equal((await getBubble(call({ caller: AUTHOR, params: { name: "tamil-tutor" } }))).body.version, "1.0.1");
  // a stranger gets 404, never 403
  const stranger = await getBubble(call({ caller: OTHER, params: { name: "tamil-tutor" } }));
  assert.equal(stranger.status, 404);
  assert.equal(stranger.body.code, "not_found");

  // query validation
  assert.equal((await listBubbles(call({ query: new URLSearchParams("status=weird") }))).status, 400);
  assert.equal((await listBubbles(call({ query: new URLSearchParams("pageSize=0") }))).status, 400);
  assert.equal((await listBubbles(call({ query: new URLSearchParams("mine=true") }))).body.bubbles.length, 0);
  assert.equal((await listBubbles(call({ query: new URLSearchParams("mine=true"), caller: AUTHOR }))).body.bubbles.length, 1);
  assert.equal((await listBubbles(call({ query: new URLSearchParams("pageToken=garbage") }))).status, 400);
});

test("reviews and withdraw enforce maintainer, self-review and notes", async () => {
  freshRegistry();
  await publishBubble(call({ body: JSON.stringify({ manifest: v1Manifest() }), caller: AUTHOR }));
  const review = (caller, body) => reviewBubble(call({ caller, params: { name: "tamil-tutor" }, body: JSON.stringify(body) }));

  assert.equal((await review(null, { version: "1.0.0", decision: "approve" })).status, 401);
  const notMaintainer = await review(OTHER, { version: "1.0.0", decision: "approve" });
  assert.equal(notMaintainer.status, 403);
  assert.equal(notMaintainer.body.code, "not_maintainer");
  // the author is not a maintainer either; even if made one, self-review fails
  const self = await review({ ...AUTHOR, maintainer: true }, { version: "1.0.0", decision: "approve" });
  assert.equal(self.status, 403);
  assert.equal(self.body.code, "self_review");

  assert.equal((await review(MAINTAINER, { version: "1.0.0", decision: "reject" })).status, 400); // no note
  assert.equal((await review(MAINTAINER, { version: "1.0.0", decision: "maybe" })).status, 400);
  assert.equal((await review(MAINTAINER, { version: "1.0", decision: "approve" })).status, 400);
  assert.equal((await review(MAINTAINER, { version: "9.9.9", decision: "approve" })).status, 404);

  const approved = await review(MAINTAINER, { version: "1.0.0", decision: "approve", note: "ok" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.status, "published");
  assert.equal((await review(MAINTAINER, { version: "1.0.0", decision: "reject", note: "again" })).status, 409);

  // withdraw: the author can, a stranger cannot
  const strangerWithdraw = await withdrawBubble(
    call({ caller: OTHER, params: { name: "tamil-tutor" }, body: JSON.stringify({ reason: "no" }) })
  );
  // OTHER cannot see it once published public? it can see it — but may not withdraw
  assert.equal(strangerWithdraw.status, 403);
  const withdrawn = await withdrawBubble(call({ caller: AUTHOR, params: { name: "tamil-tutor" }, body: "{}" }));
  assert.equal(withdrawn.status, 200);
  assert.equal(withdrawn.body.withdrawn.length, 1);
  assert.equal(withdrawn.body.withdrawn[0].status, "withdrawn");
  assert.equal((await withdrawBubble(call({ caller: AUTHOR, params: { name: "ghost" }, body: "{}" }))).status, 404);
});

/* ── 7. streaming wire formats ─────────────────────────────────────────── */

test("NDJSON and SSE carry the same chunks", () => {
  const chunks = [{ text: "வணக்கம்" }, { text: ", world" }, { done: true }];
  const ndjson = chunks.map((c) => new TextDecoder().decode(sse.encodeChunk(c, "ndjson"))).join("");
  const sseText = chunks.map((c) => new TextDecoder().decode(sse.encodeChunk(c, "sse"))).join("");
  assert.equal(ndjson.split("\n").filter(Boolean).length, 3);
  assert.ok(sseText.includes("data: "));
  assert.ok(sseText.endsWith("data: [DONE]\n\n"));
  assert.equal(sse.contentTypeFor("sse"), "text/event-stream; charset=utf-8");
  assert.equal(sse.contentTypeFor("ndjson"), "application/x-ndjson; charset=utf-8");
  assert.equal(sse.streamFormat(new URLSearchParams("format=sse")), "sse");
  assert.equal(sse.streamFormat(new URLSearchParams("format=json")), "ndjson");
  assert.equal(sse.streamFormat(new URLSearchParams("")), "ndjson");

  // decoding each format back gives the same chunk sequence
  const fromNdjson = ndjson.split("\n").map(sse.parseChunkLine).filter(Boolean);
  const fromSse = sseText.split("\n").map(sse.parseChunkLine).filter(Boolean);
  assert.deepEqual(fromNdjson, [{ text: "வணக்கம்" }, { text: ", world" }, { done: true }]);
  assert.deepEqual(fromSse, fromNdjson);
  assert.equal(sse.parseChunkLine('data: [DONE]'), null);
  assert.equal(sse.parseChunkLine('{"error":"boom"}').error, "boom");
  assert.equal(sse.parseChunkLine("not json"), null);
});

test("decodeStream handles split UTF-8 and partial lines", async () => {
  const source = [
    new TextEncoder().encode('{"text":"வ ண'),
    new TextEncoder().encode('க்கம்"}\n{"done":true}\n'),
  ];
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of source) controller.enqueue(chunk);
      controller.close();
    },
  });
  const chunks = [];
  for await (const chunk of decodeStream(stream)) chunks.push(chunk);
  assert.deepEqual(chunks, [{ text: "வ ணக்கம்" }, { done: true }]);
});

/* ── 8. typed client ───────────────────────────────────────────────────── */

test("createClient(httpPort) decodes JSON, streams and maps errors", async () => {
  const calls = [];
  const fakeFetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith("/api/health")) {
      return new Response(JSON.stringify({ status: "ok", version: "1.0.0" }), { status: 200 });
    }
    if (String(url).endsWith("/api/bubble/run")) {
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"text":"நன்றி"}\n'));
          controller.enqueue(new TextEncoder().encode('{"done":true}\n'));
          controller.close();
        },
      });
      return new Response(body, { status: 200 });
    }
    if (String(url).includes("/api/bubbles/ghost")) {
      return new Response(JSON.stringify({ error: "No such bubble.", code: "not_found" }), { status: 404 });
    }
    return new Response("[DONE]", { status: 200 });
  };

  const client = createClient("https://api.test", { fetchImpl: fakeFetch });
  assert.equal(client.kind, "http");
  assert.equal((await client.health()).status, "ok");
  assert.equal(await clientMod.collectRun(client.runBubble(v1Manifest(), [{ role: "user", content: "hi" }])), "நன்றி");
  await assert.rejects(client.getBubble("ghost"), (err) => {
    assert.ok(err instanceof YazhiApiError);
    assert.equal(err.status, 404);
    assert.equal(err.code, "not_found");
    assert.equal(err.retryable, false);
    return true;
  });
  // a non-JSON error page still yields a typed error
  const proxy = createClient("https://api.test", {
    fetchImpl: async () => new Response("<html>Bad gateway</html>", { status: 502 }),
    attempts: 1,
  });
  await assert.rejects(proxy.health(), (err) => err instanceof YazhiApiError && err.status === 502);
  assert.equal(calls.length, 3); // health, run, getBubble(404) — the proxy client below is separate
});

test("createClient retries 429 and 503 with backoff, then gives up", async () => {
  let attempts = 0;
  const sleeps = [];
  const flaky = createClient("https://api.test", {
    attempts: 3,
    sleep: async (ms) => {
      sleeps.push(ms);
    },
    fetchImpl: async () => {
      attempts += 1;
      if (attempts < 3) {
        return new Response(JSON.stringify({ error: "busy", code: "rate_limited" }), {
          status: 429,
          headers: { "retry-after": "0" },
        });
      }
      return new Response(JSON.stringify({ status: "ok", version: "1.0.0" }), { status: 200 });
    },
  });
  assert.equal((await flaky.health()).status, "ok");
  assert.equal(attempts, 3);
  assert.equal(sleeps.length, 2);

  attempts = 0;
  const alwaysDown = createClient("https://api.test", {
    attempts: 2,
    sleep: async () => {},
    fetchImpl: async () => {
      attempts += 1;
      return new Response(JSON.stringify({ error: "down", code: "upstream_error" }), { status: 503 });
    },
  });
  await assert.rejects(alwaysDown.health(), (err) => err instanceof YazhiApiError && err.status === 503 && err.retryable);
  assert.equal(attempts, 2);

  // 400 is not retried
  attempts = 0;
  const badRequest = createClient("https://api.test", {
    sleep: async () => {},
    fetchImpl: async () => {
      attempts += 1;
      return new Response(JSON.stringify({ error: "nope", code: "bad_request" }), { status: 400 });
    },
  });
  await assert.rejects(badRequest.health(), (err) => err.status === 400);
  assert.equal(attempts, 1);
});

test("createClient accepts a lazy port thunk (the /app host's path)", async () => {
  let built = 0;
  const client = createClient(async () => {
    built += 1;
    return httpPort("https://api.test", {
      fetchImpl: async () => new Response(JSON.stringify({ agents: [{ id: "pulavar", name: "Pulavar", provider: "adhan", model: "adhan", hasTa: true }] }), { status: 200 }),
    });
  });
  assert.equal(client.kind, "deferred");
  assert.equal(built, 0); // nothing loaded until the first call
  const roster = await client.agents();
  assert.equal(roster[0].id, "pulavar");
  await client.agents();
  assert.equal(built, 1); // the thunk runs once
});

/* ── 9. OpenAPI ────────────────────────────────────────────────────────── */

test("the OpenAPI document is 3.1, versioned, and complete", () => {
  const doc = openApiDocument();
  assert.equal(doc.openapi, "3.1.0");
  assert.equal(doc.info.version, "1.0.0");
  assert.equal(OPENAPI_VERSION, API_VERSION);
  assert.equal(doc.info.version, API_VERSION);

  // every documented route and method exists, with responses and a summary
  for (const route of API_ROUTES) {
    const item = doc.paths[route.path];
    assert.ok(item, `missing path ${route.path}`);
    for (const method of route.methods) {
      const op = item[method];
      assert.ok(op, `missing ${method.toUpperCase()} ${route.path}`);
      assert.ok(Object.keys(op.responses).length > 0, `${method} ${route.path} has no responses`);
      assert.equal(typeof op.summary, "string");
      assert.equal(typeof op.operationId, "string");
      assert.ok(Array.isArray(op.security), `${method} ${route.path} has no security entry`);
    }
  }
  // and nothing undocumented
  for (const [p, item] of Object.entries(doc.paths)) {
    for (const m of Object.keys(item)) {
      assert.ok(API_ROUTES.some((r) => r.path === p && r.methods.includes(m)), `undocumented ${m} ${p}`);
    }
  }
  // the registry operations are present under the contract's names
  const ops = new Set(Object.values(doc.paths).flatMap((item) => Object.values(item).map((op) => op.operationId)));
  for (const id of ["getHealth", "listAgents", "publishBubble", "listBubbles", "getBubble", "reviewBubble", "withdrawBubble", "validateManifest", "runBubble", "translate"]) {
    assert.ok(ops.has(id), `missing operationId ${id}`);
  }
  // plain serialisable, and self-contained ($refs only point at local schemas)
  const json = JSON.stringify(doc);
  assert.deepEqual(JSON.parse(json), doc);
  for (const match of json.matchAll(/"\$ref":"#\/components\/schemas\/([A-Za-z]+)"/g)) {
    assert.ok(doc.components.schemas[match[1]], `dangling $ref ${match[1]}`);
  }
});

/* ── 10. secrets never reachable from client modules ───────────────────── */

test("server secrets stay out of client-importable kernel modules", () => {
  const clientSafe = [
    "src/lib/api/types.ts",
    "src/lib/api/ports.ts",
    "src/lib/api/client.ts",
    "src/lib/api/error.ts",
    "src/lib/api/bubble.ts",
    "src/lib/api/sse.ts",
    "src/lib/api/openapi.ts",
  ];
  for (const rel of clientSafe) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.equal(/^import\s+"server-only"/m.test(source), false, `${rel} imports server-only`);
    assert.equal(/from\s+"node:/.test(source), false, `${rel} imports a node: built-in`);
    assert.equal(/require\(["']node:/.test(source), false, `${rel} requires a node: built-in`);
    // a secret may be mentioned in a comment (types.ts documents the shape),
    // but must never appear in executable code
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");
    // naming a secret in a description is fine (the OpenAPI doc documents it);
    // reading one is not
    assert.equal(/process\.env\.[A-Z_]*(SECRET|KEY|TOKEN)/.test(code), false, `${rel} reads a secret from the environment`);
    assert.equal(/process\.env/.test(code), false, `${rel} reads process.env`);
    // and it does not statically pull a server module
    assert.equal(/from\s+"\.\/handlers\//.test(source), false, `${rel} statically imports a handler`);
    assert.equal(/from\s+"\.\/local-port"/.test(source), false, `${rel} statically imports local-port`);
  }
  // the client graph has no VALUE edge to ports-local or local-port: a client
  // component importing @/lib/api/client must not drag the Circle session in.
  // (Turbopack follows value edges, including dynamic import() in some modes,
  // so neither may be named at all from a client-safe module.)
  for (const rel of [
    "src/lib/api/ports.ts",
    "src/lib/api/client.ts",
    "src/lib/api/error.ts",
    "src/lib/api/bubble.ts",
    "src/lib/api/types.ts",
    "src/lib/api/sse.ts",
    "src/lib/api/openapi.ts",
  ]) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.equal(/ports-local|local-port/.test(source.replace(/\/\*[\s\S]*?\*\//g, "")), false, `${rel} must not name ports-local/local-port in code`);
  }
  // the server modules are marked
  for (const rel of ["src/lib/api/registry.ts", "src/lib/api/signing.ts", "src/lib/api/maintainers.ts", "src/lib/api/registry-grpc.ts", "src/lib/api/local-port.ts"]) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.ok(/^import\s+"server-only"/m.test(source), `${rel} must import server-only`);
  }
  // ports-local is the ONLY module naming local-port, and it does so lazily
  const localEntry = readFileSync(path.join(REPO, "src/lib/api/ports-local.ts"), "utf8");
  assert.ok(/await import\("\.\/local-port"\)/.test(localEntry), "ports-local must dynamically import local-port");
  assert.equal(/^import\s+"server-only"/m.test(localEntry), false, "ports-local stays importable (it is lazy by design)");
  // every handler file is server-only too
  const handlerDir = path.join(REPO, "src/lib/api/handlers");
  for (const file of readdirSync(handlerDir)) {
    if (!file.endsWith(".ts")) continue;
    const source = readFileSync(path.join(handlerDir, file), "utf8");
    assert.ok(/^import\s+"server-only"/m.test(source), `handlers/${file} must import server-only`);
  }
  // YazhiApiError lives in the leaf ./error and is re-exported from ./client
  const errorLeaf = readFileSync(path.join(REPO, "src/lib/api/error.ts"), "utf8");
  assert.ok(/export class YazhiApiError/.test(errorLeaf), "error.ts must define YazhiApiError");
  assert.ok(!/from\s+"\.\/(ports|client)"/.test(errorLeaf), "error.ts must not import ports or client");
  const clientSrc = readFileSync(path.join(REPO, "src/lib/api/client.ts"), "utf8");
  assert.ok(/import \{ YazhiApiError \} from "\.\/error"/.test(clientSrc), "client.ts imports the error from the leaf");
  assert.ok(/export \{ YazhiApiError \}/.test(clientSrc), "client.ts re-exports YazhiApiError");
});

test("pure package files import no Node built-ins either", () => {
  for (const rel of ["packages/bubble/src/lib/manifest.ts", "packages/bubble/src/lib/bubble.ts"]) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.equal(/from\s+"node:/.test(source), false, `${rel} imports a node: built-in`);
    assert.equal(/process\.env/.test(source), false, `${rel} reads process.env`);
  }
  // the package's own entry point still lists the original v0 exports
  const index = readFileSync(path.join(REPO, "packages/bubble/src/index.ts"), "utf8");
  assert.ok(index.includes('export { BUBBLE_SCHEMA, validateManifest, effectiveSystemPrompt, withFivePosture'));
  assert.ok(index.includes("checkManifest"));
  assert.ok(index.includes("compareVersion"));
});

/* ── 11. every route file is thin and wired ────────────────────────────── */

/* ── 12. bounded request bodies (413 before a large read) ──────────────── */

/** A NextRequest look-alike: readBoundedBody only needs headers, body, method. */
function fakeRequest({ body = "", declared, method = "POST" } = {}) {
  const bytes = new TextEncoder().encode(body);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  const headers = new Headers();
  if (declared !== undefined) headers.set("content-length", String(declared));
  return { method, url: "http://localhost/api/test", headers, body: stream };
}

test("readBoundedBody refuses an oversized Content-Length without reading", async () => {
  let pulled = 0;
  // highWaterMark 0: the stream does not pre-pull, so `pulled` counts only
  // what readBoundedBody actually asked for
  const stream = new ReadableStream(
    {
      pull(controller) {
        pulled += 1;
        controller.enqueue(new TextEncoder().encode("x".repeat(1024)));
      },
    },
    { highWaterMark: 0 }
  );
  const req = {
    method: "POST",
    url: "http://localhost/api/test",
    headers: new Headers({ "content-length": String(5 * 1024 * 1024) }),
    body: stream,
  };
  const result = await httpMod.readBoundedBody(req, 128 * 1024);
  assert.equal(result.ok, false);
  assert.equal(result.limit, 128 * 1024);
  assert.equal(pulled, 0); // the stream was never touched

  // a body within its cap is read whole
  const small = await httpMod.readBoundedBody(fakeRequest({ body: "hello", declared: 5 }), 128 * 1024);
  assert.equal(small.ok, true);
  assert.equal(small.body, "hello");
});

test("readBoundedBody still caps a chunked body that lies about its size", async () => {
  // no Content-Length at all (chunked), body far over the cap
  const big = "y".repeat(40 * 1024);
  const result = await httpMod.readBoundedBody(fakeRequest({ body: big }), 16 * 1024);
  assert.equal(result.ok, false);
  assert.equal(result.limit, 16 * 1024);

  // a Content-Length that understates the real body is also caught
  const liars = await httpMod.readBoundedBody(fakeRequest({ body: big, declared: 10 }), 16 * 1024);
  assert.equal(liars.ok, false);

  // exactly at the cap is fine
  const exact = await httpMod.readBoundedBody(fakeRequest({ body: "z".repeat(16 * 1024) }), 16 * 1024);
  assert.equal(exact.ok, true);
  assert.equal(exact.body.length, 16 * 1024);
});

test("the OpenAPI translate operation matches i18n-core's honest fallback", () => {
  const doc = openApiDocument();
  const translate = doc.paths["/api/translate"].post;
  assert.ok(translate, "translate POST must exist");

  // an unconfigured provider is a 200 with warnings, never a 503 for that case
  const description = translate.description;
  assert.ok(/translation memory unavailable: no provider configured/.test(description), "documents the exact warning string");
  assert.ok(/answers 200|is a 200|200 with/i.test(description), "says the unconfigured case is 200");
  assert.equal("503" in translate.responses, true, "503 is still listed");
  assert.ok(/never used for a missing provider/.test(translate.responses["503"].description), "503 is Circle-down only");

  // the status surface i18n-core implements
  for (const status of ["200", "400", "401", "403", "405", "413", "422", "503"]) {
    assert.ok(translate.responses[status], `translate POST documents ${status}`);
  }
  // and the preflight surface
  const options = doc.paths["/api/translate"].options;
  assert.ok(options, "translate OPTIONS must be documented");
  assert.ok(options.responses["204"], "OPTIONS answers 204");
  assert.ok(options.responses["405"], "other methods answer 405");

  // both body spellings are described, because translate-core accepts both
  const schema = translate.requestBody.content["application/json"].schema;
  const properties = schema.properties;
  assert.ok(properties.strings, "documents `strings` (i18n-core's spelling)");
  assert.ok(properties.entries, "documents `entries` (the typed client's spelling)");
  // neither list can be `required`: parseTranslatePost accepts either one
  assert.deepEqual(schema.required, ["locale"], "only `locale` is required — `strings` and `entries` are alternatives");
  // each item may carry `text` or its alias `source`
  for (const list of ["strings", "entries"]) {
    const item = properties[list].items.properties;
    assert.ok(item.text, `${list}[].text documented`);
    assert.ok(item.source, `${list}[].source documented as the alias`);
  }
  // the alias precedence statement is present, so a partner knows which wins
  assert.ok(/`strings` wins/.test(schema.description), "states that `strings` wins when both are sent");
  assert.ok(/at least one of them/i.test(schema.description), "states that one of the two lists is required");

  // the response schema is what the route returns, not the old `results` shape
  const response = doc.components.schemas.TranslateResponse;
  assert.deepEqual(response.required, ["locale", "translations", "warnings"]);
  assert.equal("results" in response.properties, false, "the old `results` shape is gone");
  assert.ok(response.properties.translations.items.properties.reviewRequired, "every hit carries reviewRequired");
  assert.ok(doc.components.schemas.TranslateLookupResponse, "the GET lookup has its own schema");
});

test("inputFromRequest returns a 413 marker instead of an oversized body", async () => {
  const over = await httpMod.inputFromRequest(
    fakeRequest({ body: "x".repeat(200 * 1024) }),
    {},
    "publish"
  );
  assert.ok("tooLarge" in over);
  assert.equal(over.limit, envMod.BODY_LIMITS.publish);

  const fine = await httpMod.inputFromRequest(
    fakeRequest({ body: "{}", declared: 2 }),
    {},
    "publish"
  );
  assert.ok(!("tooLarge" in fine));
  assert.equal(fine.body, "{}");
  assert.equal(fine.format, "ndjson");

  // the 413 body itself is the contract's shape
  const response = httpMod.tooLargeResponse(envMod.BODY_LIMITS.small);
  assert.equal(response.status, 413);
  const body = JSON.parse(await response.text());
  assert.equal(body.code, "too_large");
  assert.ok(body.error.includes(String(envMod.BODY_LIMITS.small)));
});

test("every body-accepting kernel route declares a transport limit", () => {
  const limited = {
    "src/app/api/manifest/validate/route.ts": "validate",
    "src/app/api/bubbles/route.ts": "publish",
    "src/app/api/bubbles/[name]/reviews/route.ts": "small",
    "src/app/api/bubbles/[name]/withdraw/route.ts": "small",
  };
  for (const [rel, kind] of Object.entries(limited)) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.ok(source.includes(`limit: "${kind}"`), `${rel} should cap its body as "${kind}"`);
  }
  // every kernel route now goes through handle(), so none can skip the cap
  for (const rel of ["src/app/api/health/route.ts", "src/app/api/agents/route.ts", "src/app/api/bubbles/[name]/route.ts"]) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.ok(/from "@\/lib\/api\/handlers\/http"/.test(source), `${rel} imports the adapter`);
    assert.ok(/return handle\(/.test(source), `${rel} should call handle()`);
  }
  // each limit leaves room for the handler's own semantic check
  assert.ok(envMod.BODY_LIMITS.publish >= bubbleMod.MAX_MANIFEST_BYTES);
  assert.ok(envMod.BODY_LIMITS.validate >= 128 * 1024);
});

test("every route file exists, is dynamic, nodejs and thin", () => {
  const routes = [
    "src/app/api/health/route.ts",
    "src/app/api/agents/route.ts",
    "src/app/api/bubbles/route.ts",
    "src/app/api/bubbles/[name]/route.ts",
    "src/app/api/bubbles/[name]/reviews/route.ts",
    "src/app/api/bubbles/[name]/withdraw/route.ts",
    "src/app/api/manifest/validate/route.ts",
    "src/app/api/openapi.json/route.ts",
  ];
  for (const rel of routes) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.ok(/export const runtime = "nodejs"/.test(source), `${rel} runtime`);
    assert.ok(/export const dynamic = "force-dynamic"/.test(source), `${rel} dynamic`);
    // every route delegates to a shared handler; openapi.json is the one
    // exception (it renders the plain document from ../openapi.ts)
    const delegates =
      /from "@\/lib\/api\/handlers\//.test(source) ||
      (rel.endsWith("openapi.json/route.ts") && /from "@\/lib\/api\/openapi"/.test(source));
    assert.ok(delegates, `${rel} should delegate to shared code`);
    assert.ok(source.split("\n").length < 30, `${rel} should stay thin`);
  }
  // the frozen routes are untouched by the kernel
  const frozen = ["src/app/api/bubble/run/route.ts", "src/app/api/chat/route.ts"];
  for (const rel of frozen) {
    const source = readFileSync(path.join(REPO, rel), "utf8");
    assert.equal(/@\/lib\/api/.test(source), false, `${rel} must not import the kernel`);
  }
});

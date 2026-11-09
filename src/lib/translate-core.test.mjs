// Tests for the pure half of /api/translate (`src/lib/translate-core.ts`).
//
//   node --test --experimental-strip-types --import ./packages/i18n/scripts/register.mjs src/lib/translate-core.test.mjs
//
// These cover everything the route decides before it touches a session or a
// provider: request-shape validation and the honest fallback payload. The
// stateful half (`src/lib/translate.ts`) needs a provider and a process
// global, so it is exercised by the route itself, not here.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MAX_TRANSLATE_CHARS,
  MAX_TRANSLATE_ENTRIES,
  TRANSLATION_UNAVAILABLE_WARNING,
  boundedBody,
  fallbackResults,
  parseTranslatePost,
  validateGet,
} from "./translate-core.ts";

const ok = (entries) => ({ locale: "hi", strings: entries });

test("parseTranslatePost: accepts the Lead's {locale, strings:[{key,text}]}", () => {
  const result = parseTranslatePost(ok([{ key: "site.adhan.cta", text: "View Adhan →" }]));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.locale, "hi");
  assert.equal(result.value.source, "en");
  assert.deepEqual(result.value.strings, [{ key: "site.adhan.cta", text: "View Adhan →" }]);
});

test("parseTranslatePost: accepts the kernel's {entries:[{key,source}]}", () => {
  const result = parseTranslatePost({ locale: "hi", entries: [{ key: "k", source: "Hello" }] });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.strings[0].text, "Hello");
});

test("parseTranslatePost: optional context is carried, absent context omitted", () => {
  const result = parseTranslatePost(ok([{ key: "k", text: "Hi", context: "button label" }, { key: "j", text: "Yo" }]));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.strings[0].context, "button label");
  assert.equal("context" in result.value.strings[1], false);
});

test("parseTranslatePost: rejects a bad locale, source or body", () => {
  const bad = [
    [null, 422],
    [{ locale: "fr", strings: [{ key: "k", text: "x" }] }, 400],
    [{ locale: "hi", strings: [{ key: "k", text: "x" }], source: "ta" }, 400],
    [{ locale: "hi" }, 400],
    [{ locale: "hi", strings: [] }, 400],
    [{ locale: "hi", strings: ["nope"] }, 422],
    [{ locale: "hi", strings: [{ key: "", text: "x" }] }, 422],
    [{ locale: "hi", strings: [{ key: "k", text: "   " }] }, 422],
  ];
  for (const [body, status] of bad) {
    const result = parseTranslatePost(body);
    assert.equal(result.ok, false, `expected rejection for ${JSON.stringify(body)}`);
    if (!result.ok) assert.equal(result.status, status);
  }
});

test("parseTranslatePost: entry-count and entry-length caps are enforced", () => {
  const many = Array.from({ length: MAX_TRANSLATE_ENTRIES + 1 }, (_, i) => ({ key: `k${i}`, text: "x" }));
  const tooMany = parseTranslatePost({ locale: "hi", strings: many });
  assert.equal(tooMany.ok, false);
  if (!tooMany.ok) assert.equal(tooMany.status, 413);

  const justEnough = parseTranslatePost({ locale: "hi", strings: many.slice(0, MAX_TRANSLATE_ENTRIES) });
  assert.equal(justEnough.ok, true);

  const long = parseTranslatePost({ locale: "hi", strings: [{ key: "k", text: "x".repeat(MAX_TRANSLATE_CHARS + 1) }] });
  assert.equal(long.ok, false);
  if (!long.ok) assert.equal(long.status, 413);

  const edge = parseTranslatePost({ locale: "hi", strings: [{ key: "k", text: "x".repeat(MAX_TRANSLATE_CHARS) }] });
  assert.equal(edge.ok, true);
});

test("validateGet: locale and q are required and bounded", () => {
  const params = (q) => new URLSearchParams(q);
  const good = validateGet(params("locale=hi&q=Guardian"));
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.equal(good.value.locale, "hi");
    assert.equal(good.value.q, "Guardian");
  }
  assert.equal(validateGet(params("q=Guardian")).ok, false);
  assert.equal(validateGet(params("locale=fr&q=x")).ok, false);
  assert.equal(validateGet(params("locale=hi")).ok, false);
  assert.equal(validateGet(params("locale=hi&q=%20")).ok, false);
  const tooLong = validateGet(params(`locale=hi&q=${"x".repeat(MAX_TRANSLATE_CHARS + 1)}`));
  assert.equal(tooLong.ok, false);
  if (!tooLong.ok) assert.equal(tooLong.status, 413);
});

test("fallbackResults: the unconfigured answer is honest, per entry", () => {
  const results = fallbackResults([
    { key: "a", text: "Abhan" },
    { key: "b", text: "Guardian" },
  ]);
  assert.equal(results.length, 2);
  for (const r of results) {
    assert.equal(r.origin, "mt");
    assert.equal(r.reviewRequired, true); // never served as reviewed
  }
  // the source text is returned unchanged: nothing is invented
  assert.equal(results[0].text, "Abhan");
  assert.equal(results[1].text, "Guardian");
  assert.match(TRANSLATION_UNAVAILABLE_WARNING, /translation memory unavailable/);
});

test("boundedBody: an honest Content-Length over the cap is refused unread", async () => {
  let read = false;
  const req = {
    headers: { get: (name) => (name === "content-length" ? "2048" : null) },
    body: {
      getReader() {
        read = true;
        throw new Error("must not read a refused body");
      },
    },
  };
  const result = await boundedBody(req, 1024);
  assert.equal(result.ok, false);
  assert.equal(result.limit, 1024);
  assert.equal(read, false);
});

test("boundedBody: a chunked body is bounded by reading, not by trusting headers", async () => {
  const chunk = new Uint8Array(600);
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(chunk);
      controller.enqueue(chunk); // 1200 bytes > 1024
      controller.close();
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = { headers: { get: () => null }, body: stream };
  const result = await boundedBody(req, 1024);
  // The guard is the *work* boundedBody does, not a flag on the source stream:
  // a ReadableStream whose start() already enqueued everything has nothing
  // left to cancel, so asserting `cancelled` would test the WHATWG queue, not
  // our code. What must hold is: over-cap is rejected, at the cap, and the
  // caller is told the limit. (`cancel()` IS reached on a live request body,
  // where the next chunk has not been enqueued yet.)
  assert.equal(result.ok, false);
  assert.equal(result.limit, 1024);
  assert.equal(cancelled, false, "an already-closed source stream has nothing to cancel");
});

test("boundedBody: a body exactly at the cap is accepted", async () => {
  const bytes = new Uint8Array(1024).fill(32);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  const result = await boundedBody({ headers: { get: () => null }, body: stream }, 1024);
  assert.equal(result.ok, true);
});

test("boundedBody: a declared Content-Length over the cap is refused before reading", async () => {
  // A real Request, so this tests the byte path the route actually sees.
  // getReader() is counted: a refused-by-header body must never be pulled.
  const req = new Request("http://yazhi.dev/api/translate", {
    method: "POST",
    headers: { "content-length": "5000" },
    body: "x".repeat(5000),
  });
  let readers = 0;
  const realGetReader = req.body.getReader.bind(req.body);
  req.body.getReader = () => {
    readers += 1;
    return realGetReader();
  };
  const result = await boundedBody({ headers: req.headers, body: req.body }, 1024);
  assert.equal(result.ok, false);
  assert.equal(result.limit, 1024);
  assert.equal(readers, 0, "the body must not be read at all");
});

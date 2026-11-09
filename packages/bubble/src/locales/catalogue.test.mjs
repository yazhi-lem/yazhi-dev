// Integrity of the Bubble UI library's own catalogue.
//
//   node --test --experimental-strip-types --import ./packages/i18n/scripts/ts-resolve.mjs \
//     packages/bubble/src/locales/catalogue.test.mjs
//
// Three kinds of check, all of which have caught real drift before:
//   1. catalogue invariants — ta/en/hi key parity, no empty values, equal
//      `{placeholder}` sets, Hindi drafts marked review-required, Tamil not
//      left as Latin-only;
//   2. the lookup seam — locale → Tamil → key, interpolation, and the
//      standalone default (Tamil) a component sees with no scope above it;
//   3. a source scan — no bare English text node or user-facing attribute
//      left in the library's component, module, page, mission, sound and
//      tinai trees.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUBBLE_CATALOGUES,
  BUBBLE_CATALOGUE,
  bubbleCatalogueKeys,
  bubbleLabelPair,
  bubbleT,
} from "./index.ts";
import { placeholders } from "@yazhi/i18n";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..");

const textOf = (value) => (typeof value === "string" ? value : value?.text ?? "");
const taKeys = Object.keys(BUBBLE_CATALOGUES.ta).sort();
const enKeys = Object.keys(BUBBLE_CATALOGUES.en).sort();
const hiKeys = Object.keys(BUBBLE_CATALOGUES.hi).sort();

/* ------------------------------------------------------------ catalogue */

test("catalogue: ta, en and hi have identical key sets", () => {
  assert.ok(taKeys.length > 100, `expected the full library catalogue, got ${taKeys.length} keys`);
  assert.deepEqual(enKeys, taKeys);
  assert.deepEqual(hiKeys, taKeys);
  assert.deepEqual(bubbleCatalogueKeys(), taKeys);
});

test("catalogue: every key sits under the bubble. namespace", () => {
  const stray = taKeys.filter((key) => !key.startsWith("bubble."));
  assert.deepEqual(stray, [], `keys outside bubble.*: ${stray.join(", ")}`);
});

test("catalogue: no empty values, no U+FFFD anywhere", () => {
  for (const locale of ["ta", "en", "hi"]) {
    for (const key of taKeys) {
      const text = textOf(BUBBLE_CATALOGUES[locale][key]);
      assert.ok(text.trim(), `${locale}: empty value for ${key}`);
      assert.ok(!text.includes("\uFFFD"), `${locale}: replacement char in ${key}`);
    }
  }
});

test("catalogue: {placeholders} agree across locales", () => {
  for (const key of taKeys) {
    const ta = placeholders(textOf(BUBBLE_CATALOGUES.ta[key]));
    const en = placeholders(textOf(BUBBLE_CATALOGUES.en[key]));
    const hi = placeholders(textOf(BUBBLE_CATALOGUES.hi[key]));
    assert.deepEqual(en, ta, `placeholders differ for ${key} (en)`);
    assert.deepEqual(hi, ta, `placeholders differ for ${key} (hi)`);
  }
});

test("catalogue: Hindi is machine-drafted and every entry says so", () => {
  for (const key of hiKeys) {
    const entry = BUBBLE_CATALOGUES.hi[key];
    assert.equal(typeof entry, "object", `${key}: Hindi must carry its provenance`);
    assert.equal(entry.origin, "mt", `${key}: Hindi origin must be "mt"`);
    assert.equal(entry.reviewRequired, true, `${key}: Hindi must be reviewRequired`);
  }
});

test("catalogue: nothing Tamil-only where English is prose", () => {
  // A Tamil line that is Latin text is either a proper noun or bug.
  const latinOnly = /^[A-Za-z0-9\s\p{P}]+$/u;
  // product/brand names and code identifiers that are not translated
  const properNoun =
    /^(Yazhi|yazhi-api|Circle|Adhan|Thirukkural|Tirukkural|Bubble UI|AI|API|Open Sangam|Kural Desk|Maduraikanchi|India Code|DLSA)$/;
  // Keys whose *value* is English by design: the English half of a
  // bilingual label (`.…En`), shown as the second half of "machine draft".
  const englishHalf = /\.(machineDraft|sample)En$/;
  const offenders = taKeys.filter((key) => {
    const ta = textOf(BUBBLE_CATALOGUES.ta[key]);
    if (englishHalf.test(key)) return false;
    return latinOnly.test(ta) && !properNoun.test(ta);
  });
  assert.deepEqual(offenders, [], `Tamil entries with no Tamil: ${offenders.join(", ")}`);
});

test("catalogue: Tamil uses Tamil script, Hindi uses Devanagari", () => {
  const tamil = /[\u0B80-\u0BFF]/;
  const devanagari = /[\u0900-\u097F]/;
  for (const key of taKeys) {
    const ta = textOf(BUBBLE_CATALOGUES.ta[key]);
    const hi = textOf(BUBBLE_CATALOGUES.hi[key]);
    // Both tags carry legitimate exceptions — a key whose value is a brand
    // name, a bare identifier or a punctuation-only label.
    const isCode = (s) => /^[\p{P}\p{S}\s]*$|^(yazhi-api|machine draft|sample data|\{name\}|\{title\}|\{who\}|\{what\}|\{word\}|✓.*)$/u.test(s);
    if (!isCode(ta)) assert.ok(tamil.test(ta), `ta: no Tamil script in ${key}: ${ta}`);
    if (!isCode(hi)) assert.ok(devanagari.test(hi), `hi: no Devanagari in ${key}: ${hi}`);
  }
});

/* --------------------------------------------------------------- lookup */

test("lookup: resolves per locale, falls back to Tamil, then to the key", () => {
  assert.equal(bubbleT("bubble.composer.send", "en"), "Send");
  assert.equal(bubbleT("bubble.composer.send", "ta"), "அனுப்பு");
  assert.equal(bubbleT("bubble.composer.send", "hi"), "भेजें");
  // the standalone default is Tamil, the language of the ecosystem
  assert.equal(bubbleT("bubble.composer.send"), "அனுப்பு");
  // an unknown key is returned verbatim, never blank
  assert.equal(bubbleT("bubble.nope.missing", "en"), "bubble.nope.missing");
  // an unknown locale resolves to the Tamil catalogue, not a throw
  assert.equal(bubbleT("bubble.composer.send", "xx"), "அனுப்பு");
});

test("lookup: interpolation fills holes and leaves absent ones intact", () => {
  assert.equal(bubbleT("bubble.citation.label", "en", { n: 3, title: "Thirukkural", locator: "423" }), "Source 3: Thirukkural, 423");
  assert.equal(bubbleT("bubble.citation.label", "en", { n: 3 }), "Source 3: {title}, {locator}");
  assert.equal(bubbleT("bubble.answer.matched", "ta", { pct: 97 }), "97% பொருந்தியது");
  assert.equal(bubbleT("bubble.hintLadder.next", "hi", { next: 2, total: 3 }).includes("2"), true);
});

test("lookup: each compiled catalogue falls back to Tamil", () => {
  assert.equal(BUBBLE_CATALOGUE.ta.locale, "ta");
  assert.equal(BUBBLE_CATALOGUE.hi.locale, "hi");
  assert.equal(BUBBLE_CATALOGUE.hi.fallback, BUBBLE_CATALOGUES.ta);
  assert.equal(BUBBLE_CATALOGUE.en.fallback, BUBBLE_CATALOGUES.ta);
});

test("display: the bilingual pair follows the display preference", () => {
  const both = bubbleLabelPair("இயந்திர வரைவு", "machine draft", "both");
  assert.equal(both.text, "இயந்திர வரைவு · machine draft");
  assert.equal(bubbleLabelPair("இயந்திர வரைவு", "machine draft", "ta").text, "இயந்திர வரைவு");
  assert.equal(bubbleLabelPair("இயந்திர வரைவு", "machine draft", "en").text, "machine draft");
});

/* -------------------------------------------------------- source scan */

/** Every .tsx under the trees the task names, recursively. */
function tsxFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full));
    else if (name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const COMPONENT_TREES = ["components", "modules", "pages", "mission", "sound", "tinai"];
const COMPONENT_FILES = COMPONENT_TREES.flatMap((tree) => tsxFiles(join(SRC, tree)));

/** Text the scan tolerates: product names, symbols and units that are the
    same in every language. Kept short on purpose — anything new that needs
    adding here is a decision worth a reviewer's eye. */
const ALLOWED_TEXT = new Set([
  "yazhi-api", // the runtime's name, not a word
  "Guru", // app name, also the persona
  "Annachi", // persona name
  "Kural Desk",
  "Yazh",
  "✓",
  "✕",
  "?",
  "·",
  "—",
  "↗",
]);

/** Remove comments, keeping line structure so nothing else shifts. Block
    comments and `//` comments are both dropped; `//` after a `:` (as in
    `https://` or `color-mix(in oklab, …)`) is part of a string/regex, not a
    comment, so it is kept. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ""))
    .replace(/(^|[^:\w"'`])\/\/.*$/gm, "$1");
}

/**
 * The text nodes of a JSX file, found with a small state machine rather than
 * a regex: a regex cannot tell a closing `>` from the greater-than in
 * `(a > b)` without parsing, and that mismatch is exactly how a scan like
 * this fails open.
 *
 * The machine tracks:
 *   - tags (`<Name …>`, quotes and `{}` expressions inside them), skipped
 *     whole — they are not text;
 *   - a **brace depth** across the file, incremented by `{` and decremented
 *     by `}`. "Outside braces" is code, and a `<` there is never JSX. An
 *     unterminated apostrophe in a comment (`don't`) therefore cannot make
 *     every later tag look like text — the failure mode that a quote-tracking
 *     version has;
 *   - text: what follows a tag's `>` (or the end of an expression) at brace
 *     depth 0, up to the next tag or `{`.
 */
function jsxTextNodes(source) {
  const nodes = [];
  let depth = 0;
  let i = 0;
  while (i < source.length) {
    // comments are not code: a `//` line or a block comment may hold braces
    // (a JSDoc `{@link x}`, a note in prose) that would otherwise unbalance
    // the depth and hide every tag after them.
    if (source[i] === "/" && source[i + 1] === "/") {
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (source[i] === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    const ch = source[i];
    if (ch === "{") {
      depth++;
      i++;
      continue;
    }
    if (ch === "}") {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }
    // A tag may appear anywhere — JSX normally sits inside a function body,
    // i.e. at brace depth ≥ 1 — so depth does not decide it. The shape does:
    // an opening tag is `<` + an uppercase name (`<Pill`, `<span`, `<svg`),
    // and a closing tag is `</`. A TypeScript generic is `<` + a lowercase
    // type name (`useRef<HTMLDivElement>`) or a type parameter (`<V extends
    // string>`), so it is never mistaken for JSX — which is what makes this
    // rule exact rather than a heuristic. Every file in the scanned trees
    // uses JSX only in return values and JSX text only between tags.
    // The character before `<` decides too: inside a generic its left
    // neighbour is an identifier, `,`, `>`, `[`, `{` or `(` — never an
    // operator or the start of a statement, where a tag can realistically
    // begin. (`(` is allowed because `return (` puts JSX on the next line.)
    // A tag begins at a token boundary: after `(`, `=`, `>`, `:`, `,`, `&`,
    // `?`, `[`, or a line start (whitespace). A generic never does — its `<`
    // follows an identifier or a type name — and neither does arithmetic
    // (`a < b`).
    const before = source.slice(0, i).match(/(\S)$/)?.[1] ?? "";
    const atBoundary = before === "" || "([{:=,>?&|;".includes(before);
    const opensTag = ch === "<" && /[A-Z\/]/.test(source[i + 1] ?? "") && atBoundary;
    if (opensTag) {
      const close = skipTag(source, i);
      const isClosing = source[i + 1] === "/";
      // A self-closing tag carries no children: whatever follows it on the
      // same line is code, not text (`cond ? <TypingDots /> : children`).
      const selfClosing = source[close - 1] === "/";
      i = close + 1;
      // Only an opening tag can be followed by text, and only on the same
      // line up to the next tag, `{` or line end. That keeps a closing tag
      // (`</p>`), a self-closing tag, and the code after either
      // (`return (`) out of the text.
      if (isClosing || selfClosing) continue;
      const textStart = i;
      while (i < source.length && source[i] !== "<" && source[i] !== "{" && source[i] !== "\n") i++;
      if (i > textStart) nodes.push(source.slice(textStart, i));
      continue;
    }
    i++;
  }
  return nodes;
}

/**
 * Index of the `>` that closes the tag opening at `at`.
 *
 * A `>` inside a quoted attribute or an attribute expression
 * (`title={a > b ? "x" : "y"}`) does not close the tag, so both are skipped
 * whole — but `{}` in a tag nest *within the tag*: an attribute expression
 * that ends must not be read as the end of a `{` from the code around it, or
 * the caller's brace depth desyncs and every later tag is missed.
 */
function skipTag(source, at) {
  let i = at + 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(source, i) + 1;
      continue;
    }
    if (ch === "{") {
      i = skipExpression(source, i) + 1;
      continue;
    }
    if (ch === ">") return i;
    i++;
  }
  return source.length;
}

/** Index of the quote closing the string opening at `at`. */
function skipString(source, at) {
  const quote = source[at];
  for (let i = at + 1; i < source.length; i++) {
    if (source[i] === "\\") {
      i++;
      continue;
    }
    if (source[i] === quote) return i;
  }
  return source.length;
}

/** Index of the `}` closing the expression opening at `at`. */
function skipExpression(source, at) {
  let depth = 0;
  let quote = null;
  for (let i = at; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === quote && source[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return source.length;
}

test("source scan: no bare English text node in the component trees", () => {
  const offenders = [];
  for (const file of COMPONENT_FILES) {
    const source = readFileSync(file, "utf8");
    for (const raw of jsxTextNodes(source)) {
      // text between the closing `>` of one tag and the `<` of the next;
      // expressions were cut out by the parser above
      const text = raw.replace(/\s+/g, " ").trim();
      if (!text || ALLOWED_TEXT.has(text)) continue;
      // JSX entities, punctuation and whitespace carry no language
      if (!/[A-Za-z\u0B80-\u0BFF\u0900-\u097F]/.test(text)) continue;
      if (/^(&[a-z]+;|\s|·|—|↗|✓|✕|\?|\d)+$/i.test(text)) continue;
      offenders.push(`${relative(SRC, file)}: "${text}"`);
    }
  }
  assert.deepEqual(offenders, [], `English text left in JSX — move it to src/locales:\n${offenders.join("\n")}`);
});

test("source scan: no bare English user-facing attribute", () => {
  // title/aria-label/placeholder/alt written as a literal attribute...
  const LITERAL = /\b(?:title|aria-label|placeholder|alt|legend)="(?![{:#])([^"]*[A-Za-z][^"]*)"/g;
  // ...or as a default parameter value (`title = "Sources"`), which silently
  // bypasses the catalogue for every caller that omits the prop.
  const DEFAULT_PARAM = /\b(?:title|placeholder|sendLabel|stopLabel|label|what)\s*=\s*"([^"]*[A-Za-z][^"]*)"/g;
  const offenders = [];
  for (const file of COMPONENT_FILES) {
    const source = stripComments(readFileSync(file, "utf8"));
    for (const re of [LITERAL, DEFAULT_PARAM]) {
      for (const match of source.matchAll(re)) {
        if (ALLOWED_TEXT.has(match[1].trim())) continue;
        offenders.push(`${relative(SRC, file)}: "${match[1]}"`);
      }
    }
  }
  assert.deepEqual(offenders, [], `English attribute copy left in components:\n${offenders.join("\n")}`);
});

test("source scan: the files scanned are the trees the task names", () => {
  // Guards the two scans above against a silently empty file list.
  assert.ok(COMPONENT_FILES.length >= 25, `expected the component trees, found ${COMPONENT_FILES.length} files`);
  for (const tree of COMPONENT_TREES) {
    assert.ok(COMPONENT_FILES.some((f) => f.includes(`${"/"}${tree}${"/"}`)), `no .tsx found under ${tree}/`);
  }
});

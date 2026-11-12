// Unit tests for @yazhi/i18n — Node 26's built-in runner.
//
//   node --test --experimental-strip-types --import ./scripts/ts-resolve.mjs src/i18n.test.mjs
//   (or, from packages/i18n: npm test)
//
// Node 26 strips TypeScript types natively; scripts/ts-resolve.mjs lets the
// extensionless relative imports inside src/*.ts resolve to *.ts.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  isLocale,
  toBcp47,
  normalizeLocale,
  localeDir,
  localesNeedingReview,
  nextLocale,
} from "./locale.ts";

import {
  createCatalogue,
  createCatalogues,
  interpolate,
  placeholders,
  t,
  hasKey,
  missingKeys,
  extraKeys,
  keysNeedingReview,
} from "./catalogue.ts";

import {
  DISPLAYS,
  DEFAULT_DISPLAY,
  isDisplay,
  normalizeDisplay,
  nextDisplay,
  displayedLocales,
} from "./display.ts";

import {
  graphemes,
  aksaraCount,
  truncateAkshara,
  sliceAkshara,
  isTamilText,
  isMostlyTamil,
  isDevanagariText,
  scriptLocale,
} from "./tamil.ts";

import { UI, ui, languageName, languageLabel } from "./locales/ui.ts";
import { isCompiled, messagesOf } from "./catalogue.ts";
import { toTranslationEntries } from "./translate.ts";

/** The task's fixture: படித்து + கொண்டு + இரு + ந் + த் + ஏ + ன்.
    27 code points, 19 UTF-16 code units, 9 visible units. */
const WORD = "படித்துக்கொண்டிருந்தேன்";

const en = { "a.hello": "Hello, {name}!", "a.only": "English only" };
const ta = { "a.hello": "வணக்கம், {name}!", "a.only": "தமிழ் மட்டும்", "a.tamilOnly": "தமிழில் மட்டும்" };

test("locales: the set, the type guard and the default", () => {
  assert.deepEqual([...LOCALES], ["ta", "en", "hi"]);
  assert.equal(DEFAULT_LOCALE, "ta");
  assert.ok(isLocale("ta") && isLocale("en") && isLocale("hi"));
  assert.ok(!isLocale("fr"));
  assert.ok(!isLocale(undefined));
  assert.ok(!isLocale("TA")); // tags are lowercase in our catalogue ids
});

test("locales: BCP-47 mapping and normalisation", () => {
  assert.equal(toBcp47("ta"), "ta-IN");
  assert.equal(toBcp47("en"), "en-IN");
  assert.equal(toBcp47("hi"), "hi-IN");
  assert.equal(toBcp47("fr-CA"), "fr-CA"); // unknown passes through untouched
  assert.equal(normalizeLocale("en-GB"), "en");
  assert.equal(normalizeLocale("ta_IN"), "ta");
  assert.equal(normalizeLocale("fr"), "ta"); // unsupported → default
  assert.equal(normalizeLocale(null), "ta");
});

test("locales: metadata, direction and review flags", () => {
  assert.equal(LOCALE_META.ta.nativeName, "தமிழ்");
  assert.equal(LOCALE_META.hi.nativeName, "हिन्दी");
  assert.equal(localeDir("ta"), "ltr");
  assert.equal(LOCALE_META.ta.needsNativeReview, false);
  assert.deepEqual(localesNeedingReview(), ["hi"]);
  assert.equal(nextLocale("ta"), "en");
  assert.equal(nextLocale("hi"), "ta"); // wraps
});

test("display: separate from locale, TAM → ENG → BOTH", () => {
  assert.deepEqual([...DISPLAYS], ["ta", "en", "both"]);
  assert.equal(DEFAULT_DISPLAY, "both");
  assert.equal(nextDisplay("ta"), "en");
  assert.equal(nextDisplay("en"), "both");
  assert.equal(nextDisplay("both"), "ta");
  assert.ok(isDisplay("both") && !isDisplay("hi")); // a locale is not a display
  assert.equal(normalizeDisplay("garbage"), "both");
  assert.deepEqual(displayedLocales("both"), ["ta", "en"]);
  assert.deepEqual(displayedLocales("ta"), ["ta"]);
});

test("catalogue: locale → Tamil → key fallback", () => {
  const compiled = createCatalogue(en, "en", ta);
  assert.equal(t(compiled, "a.hello"), "Hello, {name}!");
  assert.equal(t(compiled, "a.tamilOnly"), "தமிழில் மட்டும்"); // Tamil fallback
  assert.equal(t(compiled, "a.missing"), "a.missing"); // key, never ""
  assert.equal(t(undefined, "a.hello"), "a.hello");
  assert.ok(hasKey(compiled, "a.only"));
  assert.ok(!hasKey(compiled, "a.tamilOnly")); // own-locale only
  assert.ok(!hasKey(compiled, "a.missing"));
});

test("catalogue: empty text falls through to Tamil", () => {
  const compiled = createCatalogue({ "a.hello": "", "a.only": "x" }, "en", ta);
  assert.equal(t(compiled, "a.hello"), "வணக்கம், {name}!");
});

test("catalogue: interpolation, incl. missing params left intact", () => {
  assert.equal(interpolate("Hello, {name}!", { name: "Yazhi" }), "Hello, Yazhi!");
  assert.equal(interpolate("Hello, {name}! {count} items", { name: "A" }), "Hello, A! {count} items");
  assert.deepEqual(placeholders("Hello, {name}! {count}"), ["count", "name"]);
  const compiled = createCatalogue(en, "en", ta);
  assert.equal(t(compiled, "a.hello", { name: "யாழி" }), "Hello, யாழி!");
  assert.equal(t(compiled, "a.hello"), "Hello, {name}!"); // no params, no throw
});

test("catalogue: missingKeys / extraKeys / review list", () => {
  const tamil = createCatalogue(ta, "ta");
  const english = createCatalogue(en, "en", ta);
  assert.deepEqual(missingKeys(tamil, english), ["a.tamilOnly"]);
  assert.deepEqual(extraKeys(tamil, english), []);
  const hi = createCatalogue(
    {
      "a.hello": { text: "नमस्ते, {name}!", origin: "ai", reviewRequired: true },
      "a.only": { text: "केवल अंग्रेज़ी", origin: "reviewed" },
    },
    "hi",
    ta
  );
  assert.deepEqual(missingKeys(tamil, hi), ["a.tamilOnly"]);
  assert.deepEqual(keysNeedingReview(hi), ["a.hello"]); // reviewed entries excluded
});

test("catalogue: createCatalogues wires the Tamil fallback for every locale", () => {
  const all = createCatalogues({ ta, en });
  assert.equal(all.ta.locale, "ta");
  assert.equal(all.en.locale, "en");
  assert.equal(t(all.en, "a.tamilOnly"), "தமிழில் மட்டும்");
  assert.ok(!all.hi); // absent locales are simply absent
});

test("tamil: grapheme counts — never .length", () => {
  assert.equal(WORD.length, 23); // UTF-16 code units — wrong unit for UI sizing
  assert.equal([...WORD].length, 23); // code points — still wrong: vowel signs count alone
  assert.equal(aksaraCount(WORD), 12); // visible units: ப|டி|த்|து|க்|கொ|ண்|டி|ரு|ந்|தே|ன்
  assert.equal(graphemes("யாழி").length, 2); // யா | ழி — and .length would say 4
  assert.equal(aksaraCount(""), 0);
  assert.deepEqual(graphemes("கொ"), ["கொ"]); // one akshara, two code points
});

test("tamil: truncation and slicing cut between akshara, not inside one", () => {
  const cut = truncateAkshara(WORD, 3);
  assert.equal(cut, "படித்…");
  assert.equal(aksaraCount(cut), 4); // 3 + the ellipsis grapheme
  assert.equal(truncateAkshara(WORD, 99), WORD);
  assert.equal(truncateAkshara(WORD, 0), "");
  assert.equal(sliceAkshara("யாழி கவிதை", 3), "கவிதை"); // space is its own cluster
  assert.equal(sliceAkshara("யாழி", 0, 2), "யாழி"); // யா + ழி are two clusters
});

test("tamil: script detection", () => {
  assert.ok(isTamilText("யாழி"));
  assert.ok(!isTamilText("Yazhi"));
  assert.ok(isMostlyTamil("யாழி கவிதை Yazhi")); // 8 Tamil akshara vs 5 Latin letters
  assert.ok(!isMostlyTamil("Yazhi யாழி and more English"));
  assert.ok(!isMostlyTamil(""));
  assert.ok(isDevanagariText("हिन्दी"));
  assert.equal(scriptLocale("யாழி"), "ta");
  assert.equal(scriptLocale("हिन्दी"), "hi");
  assert.equal(scriptLocale("Yazhi"), null);
});

test("ui catalogue: all three locales cover every key, Tamil fallback works", () => {
  const keys = Object.keys(UI.ta.messages).sort();
  assert.ok(keys.length >= 15);
  assert.deepEqual(Object.keys(UI.en.messages).sort(), keys);
  assert.deepEqual(Object.keys(UI.hi.messages).sort(), keys);
  assert.equal(ui("language.name", "ta"), "மொழி");
  assert.equal(ui("language.name", "en"), "Language");
  assert.equal(ui("language.name", "hi"), "भाषा");
  assert.equal(ui("ui.display.label.both", "ta"), "தமிழும் ஆங்கிலமும்");
  assert.equal(languageName("ta"), "தமிழ்");
  assert.equal(languageLabel("hi", "ta"), "இந்தி");
  assert.equal(languageLabel("hi", "en"), "Hindi");
});

test("display → Bi line selection: which languages a mode shows", () => {
  // What <Bi> derives from the display preference, expressed on the pure helpers.
  assert.deepEqual(displayedLocales(normalizeDisplay("both")), ["ta", "en"]);
  assert.deepEqual(displayedLocales(normalizeDisplay("ta")), ["ta"]);
  assert.deepEqual(displayedLocales(normalizeDisplay("en")), ["en"]);
  // A locale is never silently accepted as a display value.
  assert.equal(normalizeDisplay("hi"), "both");
});

test("catalogue helpers accept both a bare map and a compiled catalogue", () => {
  const compiled = createCatalogue(en, "en", ta);
  assert.ok(isCompiled(compiled));
  assert.ok(!isCompiled(en));
  assert.equal(messagesOf(compiled), en);
  assert.equal(messagesOf(en), en);
});

test("translate: TM hits become reviewed entries, AI drafts stay flagged", () => {
  const entries = toTranslationEntries([
    { key: "a.hello", text: "नमस्ते", origin: "tm" },
    { key: "a.only", text: "केवल", origin: "ai" },
  ]);
  assert.deepEqual(entries["a.hello"], { text: "नमस्ते", origin: "reviewed", reviewRequired: false });
  assert.deepEqual(entries["a.only"], { text: "केवल", origin: "ai", reviewRequired: true });
  assert.deepEqual(Object.keys(toTranslationEntries([{ key: "x", text: "", origin: "ai" }])), []);
});

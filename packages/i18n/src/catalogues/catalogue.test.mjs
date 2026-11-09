// Catalogue integrity for the site (`site.*`) and in-app chrome catalogues.
//
//   node --test --experimental-strip-types --import ./scripts/ts-resolve.mjs src/catalogues/catalogue.test.mjs
//
// Checks the invariants the extractor (`scripts/i18n-extract.mjs --check`)
// enforces, plus the copy rules that need the catalogue in hand: Tamil is
// never Latin-only where English is prose, no replacement characters, and
// the Hindi drafts are all marked review-required.

import { test } from "node:test";
import assert from "node:assert/strict";

import { SITE_CATALOGUE, siteCatalogueKeys } from "./index.ts";
import { UI_STRINGS, UI_CATALOGUES, ui, uiKeys } from "../strings/index.ts";
import { placeholders } from "../catalogue.ts";
import { graphemes } from "../tamil.ts";
import { siteText, siteHasKey } from "../../../../src/lib/site-copy.ts";
import { LOCALE_COOKIE, readLocaleFromCookies, serializeLocaleCookie, localeFromCookieString } from "../../../../src/lib/locale-cookie.ts";

const textOf = (value) => (typeof value === "string" ? value : value?.text ?? "");
const taKeys = Object.keys(SITE_CATALOGUE.ta).sort();
const enKeys = Object.keys(SITE_CATALOGUE.en).sort();
const hiKeys = Object.keys(SITE_CATALOGUE.hi).sort();

test("site catalogue: ta, en and hi have identical key sets", () => {
  assert.ok(taKeys.length > 100, `expected the full site catalogue, got ${taKeys.length} keys`);
  assert.deepEqual(enKeys, taKeys);
  assert.deepEqual(hiKeys, taKeys);
  assert.deepEqual(siteCatalogueKeys(), taKeys);
});

test("site catalogue: no empty values, no U+FFFD anywhere", () => {
  for (const locale of ["ta", "en", "hi"]) {
    for (const key of taKeys) {
      const text = textOf(SITE_CATALOGUE[locale][key]);
      assert.ok(text.trim(), `${locale}: empty value for ${key}`);
      assert.ok(!text.includes("\uFFFD"), `${locale}: replacement char in ${key}`);
    }
  }
});

test("site catalogue: {placeholders} agree across locales", () => {
  for (const key of taKeys) {
    const ta = placeholders(textOf(SITE_CATALOGUE.ta[key]));
    const en = placeholders(textOf(SITE_CATALOGUE.en[key]));
    const hi = placeholders(textOf(SITE_CATALOGUE.hi[key]));
    assert.deepEqual(en, ta, `placeholders differ for ${key}`);
    assert.deepEqual(hi, ta, `placeholders differ for ${key} (hi)`);
  }
});

test("site catalogue: Tamil prose is not Latin-only where English is prose", () => {
  const latinOnly = /^[A-Za-z0-9\s\p{P}]+$/u;
  // brand names, cited terms and the language names in the token-tax table
  const properNoun = /^(Yazhi|Discord|GitHub|Adhan|Open Sangam|Bubble UI|AI|API|SKILL\.md|good first issue|[A-Z][a-z]+ et al\.|[A-Z][a-z]+ [A-Z][a-z]+)$/;
  const offenders = taKeys.filter((key) => {
    const ta = textOf(SITE_CATALOGUE.ta[key]);
    const en = textOf(SITE_CATALOGUE.en[key]);
    return latinOnly.test(ta) && !latinOnly.test(en) && !properNoun.test(ta);
  });
  assert.deepEqual(offenders, []);
});

test("site catalogue: every Hindi draft is machine-marked for review", () => {
  for (const key of taKeys) {
    const entry = SITE_CATALOGUE.hi[key];
    assert.equal(typeof entry, "object", `${key} should be a TranslationEntry`);
    assert.equal(entry.origin, "mt", `${key} origin`);
    assert.equal(entry.reviewRequired, true, `${key} reviewRequired`);
  }
});

test("site catalogue: Tamil and English are bare native strings", () => {
  for (const key of taKeys) {
    assert.equal(typeof SITE_CATALOGUE.ta[key], "string", `ta ${key}`);
    assert.equal(typeof SITE_CATALOGUE.en[key], "string", `en ${key}`);
  }
});

test("site catalogue: the Maduraikkanci verse is not translated", () => {
  // The verse is never a catalogue key — it renders verbatim from content.ts.
  for (const key of taKeys) {
    assert.ok(!/madurai.*verse|verse.*madurai/i.test(key), `verse must not be a catalogue key: ${key}`);
    assert.ok(!textOf(SITE_CATALOGUE.hi[key]).includes("ஓங்கு திரை"), "the verse must not be machine-translated");
  }
});

test("site copy: locale → ta / en / hi, unknown key returns the key", () => {
  assert.equal(siteText("site.adhan.name", "ta"), "ஆதன்");
  assert.equal(siteText("site.adhan.name", "en"), "Adhan");
  assert.equal(siteText("site.yazh.cta", "ta"), "தொடங்குக");
  assert.equal(siteText("site.yazh.cta", "en"), "Get started");
  assert.equal(siteText("site.no.such.key", "ta"), "site.no.such.key");
  assert.ok(siteHasKey("site.adhan.name"));
  assert.ok(!siteHasKey("site.no.such.key"));
});

test("site copy: {name} holes interpolate, a missing param stays", () => {
  const key = "site.onboarding.nodeRegion";
  assert.ok(textOf(SITE_CATALOGUE.en[key]).includes("{region}"));
  assert.ok(siteText(key, "en").includes("{region}"));
});

test("site copy: the language: option forces one language", () => {
  // the hero's second line is English in every locale — the site's signature
  const en = siteText("site.identity.tagline", "ta", { language: "en" });
  assert.equal(en, "Sovereign AI for Indian languages");
  assert.equal(siteText("site.identity.tagline", "ta"), "இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு");
});

test("site copy: Tamil lines survive grapheme-safe (pulli + vowel signs intact)", () => {
  const ta = siteText("site.identity.tagline", "ta");
  assert.ok(graphemes(ta).length > 10);
  assert.ok(ta.includes("\u0BCD"), "pulli must survive");
  assert.equal(graphemes(ta).join(""), ta);
});

test("chrome catalogue: three locales, identical key sets, all filled", () => {
  const keys = uiKeys();
  assert.ok(keys.length > 150);
  assert.deepEqual(Object.keys(UI_CATALOGUES.en).sort(), keys);
  assert.deepEqual(Object.keys(UI_CATALOGUES.hi).sort(), keys);
  for (const key of keys) {
    for (const locale of ["ta", "en", "hi"]) {
      assert.ok(textOf(UI_CATALOGUES[locale][key]).trim(), `${locale}: empty chrome value for ${key}`);
    }
    const trio = UI_STRINGS[key];
    assert.equal(trio.length, 3, `${key} must be a [ta, en, hi] triple`);
    assert.deepEqual(placeholders(trio[2]), placeholders(trio[0]), `placeholders differ (hi) for ${key}`);
  }
});

test("chrome catalogue: ui() resolves, interpolates, and degrades to the key", () => {
  assert.equal(ui("chat.send", "ta"), "அனுப்பு");
  assert.equal(ui("chat.send", "en"), "Send");
  assert.equal(ui("chat.placeholder", "en", { agent: "Yazh Guide" }), "Message to Yazh Guide…");
  assert.equal(ui("chat.placeholder", "ta"), "{agent} உடன் எழுதுங்கள்…");
  assert.deepEqual(ui("chat.placeholder", "ta", { agent: "யாழ்" }), "யாழ் உடன் எழுதுங்கள்…");
  assert.equal(ui("no.such.chrome.key", "ta"), "no.such.chrome.key");
});

test("locale cookie: read, serialize, parse — never throws on bad input", () => {
  assert.equal(LOCALE_COOKIE, "yazhi-locale");
  assert.equal(readLocaleFromCookies("ta"), "ta");
  assert.equal(readLocaleFromCookies("en-GB"), "en");
  assert.equal(readLocaleFromCookies("fr"), "ta");
  assert.equal(readLocaleFromCookies(undefined), "ta");
  assert.equal(readLocaleFromCookies("%E0%AE%A4"), "ta"); // malformed → default
  const cookie = serializeLocaleCookie("hi");
  assert.match(cookie, /^yazhi-locale=hi; Path=\/; SameSite=Lax; Max-Age=31536000/);
  assert.equal(localeFromCookieString("a=1; yazhi-locale=en; b=2"), "en");
  assert.equal(localeFromCookieString("a=1"), "ta");
});

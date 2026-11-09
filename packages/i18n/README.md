# @yazhi/i18n

The multilingual foundation for **yazhi.dev**: typed locales, catalogues with a Tamil
fallback, grapheme-safe Tamil helpers, and the translation-memory client.

No build step. The app imports it through the `@yazhi/i18n` path alias in the repo's
`tsconfig.json`, exactly like `@yazhi/bubble`.

```ts
import {
  LOCALES, DEFAULT_LOCALE, type Locale, toBcp47,      // locale.ts
  createCatalogue, t, missingKeys, placeholders,        // catalogue.ts
  DEFAULT_DISPLAY, nextDisplay, type Display,           // display.ts
  aksaraCount, truncateAkshara, graphemes, isTamilText, // tamil.ts
} from "@yazhi/i18n";
```

## Two ideas that must stay apart

| | What it is | Where it lives |
|---|---|---|
| **Locale** — `"ta" \| "en" \| "hi"` | the *language* the page is in: sets `lang`, selects the catalogue, drives `<html lang>`/`hreflang` | `src/locale.ts` |
| **Display** — `"ta" \| "en" \| "both"` | *how much text is shown side by side*: Tamil only, English only, or both lines (today's TAM/ENG/BOTH toggle, default `both`) | `src/display.ts` |

A Hindi reader with `display: "both"` still sees Tamil and English lines — the display
preference and the locale are independent. Do not merge them; the boundary is agreed in
`docs/team/BOUNDARIES-20261109.md`.

**Tamil is the default** (`DEFAULT_LOCALE = "ta"`). Every lookup falls back
**locale → Tamil → the key itself**, so an untranslated label shows its dotted key
instead of a blank button.

## Catalogue shape

Flat, dotted keys — `"site.hero.tagline"`, `"bubble.mission.theme"`, `"ui.language.name"`.

```ts
// a bare string is native copy
const ta = { "site.hero.tagline": "இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு" };

// machine drafts carry their provenance
const hi = {
  "site.hero.tagline": { text: "भारतीय भाषाओं के लिए संप्रभु एआई", origin: "ai", reviewRequired: true },
};

const cat = createCatalogue(hi, "hi", ta);        // hi, with Tamil as the fallback
t(cat, "site.hero.tagline");                      // → the Hindi draft
t(cat, "site.missing.key");                       // → "site.missing.key"
t(cat, "site.greeting", { name: "யாழி" });        // {name} holes; a missing param stays as {name}
```

`origin` is `"native"` (written by us), `"reviewed"` (a native speaker signed it off),
`"ai"` or `"mt"` (drafts). **AI and MT drafts are never served as `reviewed`.**

## Adding a language in four steps

1. **Register it** — add the tag to `LOCALES` in `src/locale.ts` and an entry to
   `LOCALE_META` (native name, English name, BCP-47 tag, script, `dir`, and
   `needsNativeReview: true` while the copy is a draft).
2. **Translate** — add `src/../catalogues/<tag>.ts` (site copy) and the `<tag>`
   block in `src/locales/ui.ts` (the switcher's own strings), keyed identically to
   the Tamil catalogue. Run `missingKeys(tamilCatalogue, newCatalogue)` — it must
   return `[]`; that list is the reviewer's to-do list. Machine drafts get
   `{ origin: "mt" | "ai", reviewRequired: true }`.
3. **Wire it** — `createCatalogues()` picks the new locale up automatically (every
   locale falls back to Tamil). Set the cookie/default in `src/lib/locale-cookie.ts`
   and add a font with the right script coverage in `src/app/layout.tsx` (the Lead owns
   that file: Devanagari for `hi`).
4. **Review** — a native speaker signs each string off, changing
   `origin: "reviewed", reviewRequired: false`, and drops `needsNativeReview` in
   `LOCALE_META`. Only then does the locale count as shipped: **nothing ships
   without native review.**

## Tamil is measured in akshara, never `.length`

```ts
const WORD = "படித்துக்கொண்டிருந்தேன்";
WORD.length                    // 23 — UTF-16 code units, meaningless for UI sizing
aksaraCount(WORD)              // 12 — visible units (கொ is one, த்து is two)
truncateAkshara(WORD, 3)       // "படித்…" — cuts between akshara, never inside one
```

`graphemes()`, `aksaraCount()`, `truncateAkshara()` and `sliceAkshara()` go through
`Intl.Segmenter` (`granularity: "grapheme"`); `isTamilText()`, `isMostlyTamil()`,
`scriptLocale()` classify text by script.

## Translation memory

`src/translate.ts` is the browser half of `/api/translate`
(`docs/team/ROUTE-CONTRACTS-20261109.md` §A). **It holds no secrets** — provider keys
stay in the route handler. `lookupTranslation()` returns a lookup hit, or
`{ text: null }` (no hit *and* network failure — an absent translation is not an error);
`requestTranslations()` returns `{ results, error? }` and never throws.

## Tests

```bash
cd repos/yazhi-dev/packages/i18n
npm test        # node --test, Node 26 strips the types natively
```

Or from the repo root:

```bash
node --test --experimental-strip-types --import ./packages/i18n/scripts/ts-resolve.mjs packages/i18n/src/i18n.test.mjs
```

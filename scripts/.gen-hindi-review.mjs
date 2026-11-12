// Generates docs/i18n/HINDI-REVIEW.md from the catalogues (one row per key).
// Run: node --experimental-strip-types --import ./packages/i18n/scripts/register.mjs scripts/.gen-hindi-review.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { SITE_CATALOGUE } from "../packages/i18n/src/catalogues/index.ts";
import { UI_STRINGS } from "../packages/i18n/src/strings/index.ts";
import { taBubbleCatalogue } from "../packages/bubble/src/locales/ta.ts";
import { enBubbleCatalogue } from "../packages/bubble/src/locales/en.ts";
import { hiBubbleCatalogue } from "../packages/bubble/src/locales/hi.ts";

const esc = (v) => String(v).replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
const text = (v) => (typeof v === "string" ? v : v?.text ?? "");
const keys = Object.keys(SITE_CATALOGUE.ta).sort();
const chromeKeys = Object.keys(UI_STRINGS).sort();
const bubbleKeys = Object.keys(taBubbleCatalogue).sort();

let out = `# Hindi review — every machine-drafted string, with its English source

**Status: MACHINE DRAFT. NONE OF THIS IS REVIEWED.** Every row below is
\`{ origin: "mt", reviewRequired: true }\` in the code, and Hindi is never
served as \`reviewed\` until a native speaker signs the line off here.

Generated from the catalogues by \`scripts/.gen-hindi-review.mjs\` — regenerate
after each review pass; do not hand-edit the tables.

## How to review

1. Read the **Hindi (draft)** against the **English source**, and against the
   Tamil original where the file has one (\`src/lib/content.ts\`). Tamil is the
   site's voice; where Tamil and English differ, translate the Tamil.
2. Fix the Hindi in the file named in the **where** column:
   - \`src/lib/content.hi.ts\` — site copy (\`site.*\`)
   - \`packages/i18n/src/locales/ui.ts\` — the language switcher's own chrome
   - \`packages/i18n/src/strings/{chat,app}.ts\` — in-app chrome
   - \`packages/bubble/src/locales/hi.ts\` — the Bubble UI library's own copy
     (the words *inside* a bubble: composer, citations, guardrails, Mission
     Control, the Kadai product row)
3. Sign a line off by setting \`origin: "reviewed", reviewRequired: false\`
   (site: in \`content.hi.ts\`; chrome: in the triple files). Clear
   \`needsNativeReview\` in \`LOCALE_META\` only when every row is signed off.
4. Keep the terms transliterated, never re-concepted: याझी (Yazhi), याझ (Yazh),
   आधन (Adhan), संगम (Sangam), तिणै (thinai), अकम / पुरम (akam / puram),
   याझी एपीआई (yazhi-api), मिशन कंट्रोल (Mission Control), बबल UI (Bubble UI).
   Copy \`{placeholders}\` verbatim (the order may change). Never translate the
   Maduraikkanci verse, the demo transcript or agent system prompts — none of
   them are in these tables.

## Tamil review, separately

Tamil written for the first time in Wave B is marked
\`// DRAFT: native review pending\` in \`src/lib/content.ts\` and
\`packages/i18n/src/strings/*.ts\`: the LANGUAGE_ROADMAP steps,
THINAI_WORLD moods and bodies, the English-only \`body\` fields of
YAZHI_SECTION / ADHAN / GUARDIAN / SANGAM / DEVELOPERS, \`REPOS[].what\`,
About / Privacy body copy, onboarding and profile chrome, and chat / Circle /
builder chrome. A native reviewer should read those beside the English source
in the same table below (the Tamil column of \`content.ts\`'s \`SITE_PAIRS\`).

## Site copy — \`site.*\` (${keys.length} keys)

| # | Key | Hindi (draft, MT) | English source | Where |
|---|---|---|---|---|
`;
keys.forEach((k, i) => {
  out += `| ${i + 1} | \`${k}\` | ${esc(text(SITE_CATALOGUE.hi[k]))} | ${esc(text(SITE_CATALOGUE.en[k]))} | src/lib/content.hi.ts |\n`;
});

out += `\n## In-app chrome — ${chromeKeys.length} keys\n\n| # | Key | Hindi (draft, MT) | English source | Where |\n|---|---|---|---|---|\n`;
chromeKeys.forEach((k, i) => {
  const where = k.startsWith("chat.") ? "packages/i18n/src/strings/chat.ts" : "packages/i18n/src/strings/app.ts";
  out += `| ${i + 1} | \`${k}\` | ${esc(UI_STRINGS[k][2])} | ${esc(UI_STRINGS[k][1])} | ${where} |\n`;
});

out += `\n## Bubble UI library — ${bubbleKeys.length} keys\n\nThe words inside a bubble (\`@yazhi/bubble\`), drafted from the English\nsource the library shipped with and the Tamil written beside it. Tamil is\nthe ecosystem's voice, so where the two disagree translate the Tamil.\n\n| # | Key | Hindi (draft, MT) | English source | Where |\n|---|---|---|---|---|\n`;
bubbleKeys.forEach((k, i) => {
  out += `| ${i + 1} | \`${k}\` | ${esc(text(hiBubbleCatalogue[k]))} | ${esc(text(enBubbleCatalogue[k]))} | packages/bubble/src/locales/hi.ts |\n`;
});

mkdirSync("docs/i18n", { recursive: true });
writeFileSync("docs/i18n/HINDI-REVIEW.md", out);
console.log(
  `wrote docs/i18n/HINDI-REVIEW.md — ${keys.length} site rows + ${chromeKeys.length} chrome rows + ${bubbleKeys.length} bubble rows`
);

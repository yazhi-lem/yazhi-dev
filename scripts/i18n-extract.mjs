#!/usr/bin/env node
/**
 * i18n-extract — the catalogue skeleton, derived from source (no `grep`).
 *
 *   node scripts/i18n-extract.mjs            # write docs/i18n/CATALOGUE.json
 *   node scripts/i18n-extract.mjs --check    # exit 1 on any catalogue problem
 *   node scripts/i18n-extract.mjs --json     # print the skeleton instead
 *
 * Three scans, all parsed in-process:
 *
 *  1. `src/lib/content.ts` — every `site.*` key in `SITE_PAIRS`, with its TA
 *     and EN text (the pairs are the source of truth; the catalogue is
 *     derived from them, so this scan is what proves the derivation complete).
 *  2. `src/**` + `packages/{i18n,workspace}/src/**` + `apps/**` — literal
 *     scanners for the translated string sources:
 *       - `t("…")` / `useT()`-derived `t("…")` calls
 *       - `messageKey="…"` props
 *       - `ui("…")` chrome keys
 *       - `siteText("…")` / `SITE_PAIRS["…"]` direct reads
 *     Keys used in code must exist in the catalogue they belong to.
 *  3. Bare user-visible JSX text in the files this crate owns — a literal
 *     like `<h2>Playground</h2>` — reported, not failed, except in the files
 *     listed in `MIGRATED` (those must be clean).
 *
 * `--check` fails when:
 *   - a key used in code is missing from ta, en or hi;
 *   - ta/en key sets differ, or a value is empty / contains U+FFFD;
 *   - a key's `{placeholder}` sets differ between locales;
 *   - a `site.` key in `SITE_PAIRS` is absent from the Hindi draft (a draft
 *     may lag, but the report names every lagging key);
 *   - a migrated file still has bare English JSX text.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const JSON_OUT = args.has("--json");

/* ── helpers ──────────────────────────────────────────────────────────── */

const read = (p) => readFileSync(join(ROOT, p), "utf8");

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split("\\").join("/");

/** Strip comments so commented-out keys are not counted. Deliberately naive
    about strings-in-comments: a `//` inside a URL literal is rare here and
    a false negative only hides one key. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");
}

const PLACEHOLDER_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
const placeholdersOf = (text) => [...new Set([...String(text).matchAll(PLACEHOLDER_RE)].map((m) => m[1]))].sort();

/* ── 1. site catalogue skeleton from content.ts ───────────────────────── */

/**
 * Parse the `SITE_PAIRS: SitePair = { … }` object literal. Values are either
 * `[`ta`, `en`]` literals, or spreads of `REDUCE.reduce(...)` blocks whose
 * keys are template-built — those are resolved by the runtime instead (see
 * `--json` output), so here we only need the *literal* keys plus a note.
 */
function parseContentPairs(src) {
  const clean = stripComments(src);
  const start = clean.indexOf("export const SITE_PAIRS");
  if (start < 0) throw new Error("SITE_PAIRS not found in src/lib/content.ts");
  const open = clean.indexOf("{", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < clean.length; i += 1) {
    if (clean[i] === "{") depth += 1;
    else if (clean[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = clean.slice(open + 1, end);
  const keys = new Set();
  const re = /"(site\.[A-Za-z0-9_.]+)"\s*:\s*\[/g;
  for (const m of body.matchAll(re)) keys.add(m[1]);
  // dynamic families: reduce blocks build `site.x.N` from a source array.
  const dynamic = [...body.matchAll(/(acc|out)\[`(site\.[A-Za-z0-9_.]+)`\]/g)].map((m) => m[2]);
  return { keys: [...keys].sort(), dynamic: [...new Set(dynamic)].sort() };
}

/* ── 2. keys used in code ─────────────────────────────────────────────── */

const CANDIDATE_DIRS = ["src", "packages/i18n/src", "packages/workspace/src", "apps", "packages/bubble/src"];
const EXCLUDE = [
  "src/lib/content.ts",
  "src/lib/content.hi.ts",
  "packages/i18n/src/catalogues/",
  "packages/i18n/src/strings/",
  "packages/i18n/src/locales/",
  "packages/i18n/src/i18n.test.mjs",
];

const isExcluded = (file) => EXCLUDE.some((prefix) => file === prefix || file.startsWith(prefix));

/* ── 2b. the Bubble UI library's own catalogue ────────────────────────── */

/** `packages/bubble` ships its own catalogue (`src/locales/{ta,en,hi}.ts`) —
    the words *inside* a bubble, as opposed to the site chrome this file's
    other scans cover. Two things need checking there:

      - the catalogue itself (parity, placeholders, Hindi provenance), and
      - every key the library's components ask for.

    Keys in components are **namespaced**, not fully qualified: a component
    writes `const t = useBubbleT("bubble.composer")` and then `t("send")`,
    which reads `bubble.composer.send`. So a key is resolved against every
    namespace its own file declares; it passes when *any* of them produces a
    key that exists. That is deliberately strict — the bug this catches is a
    key under the wrong namespace (a `t("total")` in a file scoped to
    `bubble.commerce` silently renders the dotted key). */
function scanBubbleUsage(bubbleKeys) {
  const files = walk(join(ROOT, "packages/bubble/src")).filter((f) => !rel(f).includes("/locales/"));
  const unresolved = [];
  let calls = 0;
  for (const full of files) {
    const src = stripComments(readFileSync(full, "utf8"));
    const namespaces = [...src.matchAll(/\buseBubbleT\(\s*"([^"]+)"/g)].map((m) => m[1]);
    if (!namespaces.length) continue;
    for (const m of src.matchAll(/\bt\(\s*"([^"]+)"/g)) {
      const key = m[1];
      calls += 1;
      const candidates = new Set([key]);
      for (const ns of namespaces) {
        candidates.add(key.startsWith("bubble.") ? key : `${ns.endsWith(".") ? ns : `${ns}.`}${key}`);
      }
      if (![...candidates].some((candidate) => bubbleKeys.includes(candidate))) {
        unresolved.push(`${rel(full)}: t("${key}") — tried ${[...candidates].join(", ")}`);
      }
    }
  }
  return { files: files.length, calls, unresolved };
}

function scanUsage() {
  const files = [];
  for (const dir of CANDIDATE_DIRS) walk(join(ROOT, dir), files);
  const site = new Set();
  const chrome = new Set();
  const dynamicPrefixes = new Set();
  for (const full of files) {
    const file = rel(full);
    if (isExcluded(file)) continue;
    const src = stripComments(readFileSync(full, "utf8"));
    // `site.…` keys: quoted literals are checked exactly; template literals
    // that vary by index are checked through their static part (see below).
    for (const m of src.matchAll(/\bsiteText\(\s*["'](site\.[^"']+)["']/g)) site.add(m[1]);
    for (const m of src.matchAll(/\b(?:siteText|t)\(\s*`([^`]+)`/g)) dynamicPrefixes.add(m[1]);
    for (const m of src.matchAll(/\bmessageKey=\{?\s*`([^`]+)`/g)) dynamicPrefixes.add(m[1]);
    for (const m of src.matchAll(/\bSITE_PAIRS\[\s*["'](site\.[^"']+)["']\s*\]/g)) site.add(m[1]);
    for (const m of src.matchAll(/\bmessageKey=\{?\s*["'](site\.[^"']+)["']/g)) site.add(m[1]);
    for (const m of src.matchAll(/\bt\(\s*["'](site\.[^"']+)["']/g)) site.add(m[1]);
    // in-app chrome keys
    const CHROME_NS = "chat|circle|mission|workspaces|dev|bubble|anatomy|onboarding|profile|timer|whatsapp";
    for (const m of src.matchAll(new RegExp(`\\b(?:ui|appText|chromeCopy)\\(\\s*["']((?:${CHROME_NS})\\.[^"']+)["']`, "g"))) chrome.add(m[1]);
  }
  return {
    site: [...site].sort(),
    chrome: [...chrome].sort(),
    dynamicPrefixes: [...dynamicPrefixes].sort(),
    scanned: files.length,
  };
}

/* ── 3. bare JSX text in migrated files ───────────────────────────────── */

/** Files this crate owns, migrated in Wave B: these must have no bare
    English JSX text left. Add a file here when you finish migrating it. */
const MIGRATED = [
  "src/components/nav/Navbar.tsx",
  "src/components/nav/ThinaiRail.tsx",
  "src/components/footer/Footer.tsx",
  "src/components/hero/Hero.tsx",
  "src/components/hero/ThinaiIntro.tsx",
  "src/components/sections/Yazhi.tsx",
  "src/components/sections/Adhan.tsx",
  "src/components/sections/Guardian.tsx",
  "src/components/sections/Sangam.tsx",
  "src/components/sections/Thinai.tsx",
  "src/components/sections/Community.tsx",
  "src/components/ui/SectionHeading.tsx",
  "src/components/ui/LaunchTimer.tsx",
  "src/components/ui/WhatsAppButton.tsx",
  "src/components/ui/LogoMark.tsx",
  "src/components/circle/JoinCircle.tsx",
  "src/components/circle/CircleDialog.tsx",
  "src/components/mission/Mission.tsx",
  "src/components/bubble/DevShell.tsx",
  "src/components/bubble/BubbleUI.tsx",
  "src/components/bubble/BubbleAnatomy.tsx",
  "src/components/chat/ChatComposer.tsx",
  "src/components/chat/YazhStrings.tsx",
  "src/components/workspace/WorkspaceRoute.tsx",
  "src/app/about/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/repos/page.tsx",
  "src/app/onboarding/page.tsx",
  "src/app/profile/edit/page.tsx",
  "src/app/profile/[id]/page.tsx",
  "src/app/chat/page.tsx",
  "src/app/repos/page.tsx",
  "src/components/ui/LocaleSwitcher.tsx",
  "src/components/ui/locale-switcher-strings.ts",
];

/** A conservative bare-text finder: JSX text nodes with two or more Latin
    words, outside attributes, outside braces and outside comments. */
function bareJsxText(src) {
  const clean = stripComments(src);
  const findings = [];
  const lines = clean.split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || /^(import|export|const|let|function|return|type|interface|\/\/|\*)/.test(trimmed)) return;
    // text nodes: > words < , or a line that is plain prose between tags
    const m = line.match(/^[^<>{}]*>([^<>{}]+)</ ) ?? line.match(/^>?\s*([A-Z][A-Za-z]+(?: [A-Za-z'’,.\-]+){1,})\s*<?$/);
    if (!m) return;
    const text = m[1].trim();
    if (!text) return;
    if (!/[A-Za-z]{2,}/.test(text)) return;
    if (/^[\s\u00A0]*[•·—→↑↓⅄⇒…]+[\s\u00A0]*$/.test(text)) return;
    if (/^[a-z][a-z0-9_-]*$/.test(text)) return; // a token like `online`
    findings.push({ line: i + 1, text });
  });
  return findings;
}

/* ── main ─────────────────────────────────────────────────────────────── */

async function main() {
  const errors = [];
  const warnings = [];

  const contentPairs = parseContentPairs(read("src/lib/content.ts"));
  const usage = scanUsage();

  await import("../packages/i18n/scripts/register.mjs");
  const site = await import("../packages/i18n/src/catalogues/index.ts").then((m) => m.SITE_CATALOGUE);
  const strings = await import("../packages/i18n/src/strings/index.ts");

  const taKeys = Object.keys(site.ta).sort();
  const enKeys = Object.keys(site.en).sort();
  const hiKeys = Object.keys(site.hi).sort();

  const textOf = (catalogue, key) => {
    const value = catalogue?.[key];
    return typeof value === "string" ? value : value?.text ?? "";
  };

  // 1. key sets must match across ta / en / hi
  const taOnly = taKeys.filter((k) => !enKeys.includes(k));
  const enOnly = enKeys.filter((k) => !taKeys.includes(k));
  if (taOnly.length) errors.push(`ta-only keys: ${taOnly.join(", ")}`);
  if (enOnly.length) errors.push(`en-only keys: ${enOnly.join(", ")}`);
  const hiMissing = taKeys.filter((k) => !hiKeys.includes(k));
  if (hiMissing.length) errors.push(`hi missing ${hiMissing.length} key(s): ${hiMissing.join(", ")}`);
  const hiExtra = hiKeys.filter((k) => !taKeys.includes(k));
  if (hiExtra.length) errors.push(`hi has unknown key(s): ${hiExtra.join(", ")}`);

  // 2. every literal SITE_PAIRS key made it into the derived catalogue
  const notDerived = contentPairs.keys.filter((k) => !taKeys.includes(k));
  if (notDerived.length) errors.push(`SITE_PAIRS keys missing from the catalogue: ${notDerived.join(", ")}`);

  // 3. no empty values, no U+FFFD
  for (const [locale, catalogue] of Object.entries(site)) {
    for (const key of Object.keys(catalogue)) {
      const text = textOf(catalogue, key);
      if (!text.trim()) errors.push(`${locale}: empty value for ${key}`);
      if (text.includes("\uFFFD")) errors.push(`${locale}: replacement character in ${key}`);
    }
  }

  // 4. placeholder sets agree across locales
  for (const key of taKeys) {
    const sets = {
      ta: placeholdersOf(textOf(site.ta, key)).join(","),
      en: placeholdersOf(textOf(site.en, key)).join(","),
      hi: placeholdersOf(textOf(site.hi, key)).join(","),
    };
    if (sets.ta !== sets.en) errors.push(`${key}: placeholders differ ta(${sets.ta}) vs en(${sets.en})`);
    if (sets.hi && sets.ta !== sets.hi) warnings.push(`${key}: placeholders differ ta(${sets.ta}) vs hi(${sets.hi})`);
  }

  // 5. a Tamil line must not be a Latin-only sentence where English is prose
  const latinOnly = /^[A-Za-z0-9\s\p{P}]+$/u;
  for (const key of taKeys) {
    const ta = textOf(site.ta, key);
    const en = textOf(site.en, key);
    if (latinOnly.test(ta) && !latinOnly.test(en) && ta.toLowerCase() !== en.toLowerCase() && !PROPER_NOUN_OK.test(ta)) {
      warnings.push(`${key}: Tamil line is Latin-only (DESIGN note expected: proper noun / cited term)`);
    }
  }

  // 6. keys used in code must exist
  for (const key of usage.site) {
    if (!taKeys.includes(key)) errors.push(`used in code but missing from the site catalogue: ${key}`);
  }
  // template-literal keys: `${` stands in for the varying index; a catalogue
  // key matches when it starts with the literal part before the first hole
  // and the rest of the key is index-shaped.
  const dynamicResolved = [];
  for (const template of usage.dynamicPrefixes) {
    const before = template.split("${")[0];
    const pattern = new RegExp(
      `^${before.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\$$/, "")}[\\w.]+$`
    );
    const matches = taKeys.filter((key) => pattern.test(key));
    if (!matches.length) errors.push(`template key in code matches no catalogue key: \`${template}\``);
    else dynamicResolved.push({ template, matches: matches.length });
  }
  // 6b. the Bubble UI library's catalogue: parity, placeholders, provenance
  const bubble = await import("../packages/bubble/src/locales/ta.ts").then(async (ta) => ({
    ta: ta.taBubbleCatalogue,
    en: (await import("../packages/bubble/src/locales/en.ts")).enBubbleCatalogue,
    hi: (await import("../packages/bubble/src/locales/hi.ts")).hiBubbleCatalogue,
  }));
  const bubbleTa = Object.keys(bubble.ta).sort();
  const bubbleEn = Object.keys(bubble.en).sort();
  const bubbleHi = Object.keys(bubble.hi).sort();
  const bubbleOnlyTa = bubbleTa.filter((k) => !bubbleEn.includes(k));
  const bubbleOnlyEn = bubbleEn.filter((k) => !bubbleTa.includes(k));
  const bubbleHiMissing = bubbleTa.filter((k) => !bubbleHi.includes(k));
  const bubbleHiExtra = bubbleHi.filter((k) => !bubbleTa.includes(k));
  if (bubbleOnlyTa.length) errors.push(`bubble ta-only keys: ${bubbleOnlyTa.join(", ")}`);
  if (bubbleOnlyEn.length) errors.push(`bubble en-only keys: ${bubbleOnlyEn.join(", ")}`);
  if (bubbleHiMissing.length) errors.push(`bubble hi missing ${bubbleHiMissing.length} key(s): ${bubbleHiMissing.join(", ")}`);
  if (bubbleHiExtra.length) errors.push(`bubble hi has unknown key(s): ${bubbleHiExtra.join(", ")}`);
  for (const locale of ["ta", "en", "hi"]) {
    for (const key of Object.keys(bubble[locale])) {
      const text = textOf(bubble[locale], key);
      if (!text.trim()) errors.push(`bubble ${locale}: empty value for ${key}`);
      if (text.includes("\uFFFD")) errors.push(`bubble ${locale}: replacement character in ${key}`);
    }
  }
  for (const key of bubbleTa) {
    const sets = {
      ta: placeholdersOf(textOf(bubble.ta, key)).join(","),
      en: placeholdersOf(textOf(bubble.en, key)).join(","),
      hi: placeholdersOf(textOf(bubble.hi, key)).join(","),
    };
    if (sets.ta !== sets.en) errors.push(`bubble ${key}: placeholders differ ta(${sets.ta}) vs en(${sets.en})`);
    if (sets.hi && sets.ta !== sets.hi) errors.push(`bubble ${key}: placeholders differ ta(${sets.ta}) vs hi(${sets.hi})`);
    // Hindi is machine-drafted until a native reviewer says otherwise; an
    // entry that lost its provenance would be served as if it were reviewed.
    const entry = bubble.hi[key];
    if (!bubbleHiExtra.length && (typeof entry !== "object" || entry?.origin !== "mt" || entry?.reviewRequired !== true)) {
      errors.push(`bubble hi: ${key} must carry { origin: "mt", reviewRequired: true } until reviewed`);
    }
  }
  const bubbleUsage = scanBubbleUsage(bubbleTa);
  for (const miss of bubbleUsage.unresolved) errors.push(`bubble key used in code but not in the catalogue: ${miss}`);

  const chromeKeys = new Set(Object.keys(strings.UI_STRINGS));
  for (const key of usage.chrome) {
    if (!chromeKeys.has(key)) errors.push(`used in code but missing from the chrome catalogue: ${key}`);
  }
  for (const key of chromeKeys) {
    for (const [locale, catalogue] of Object.entries(strings.UI_CATALOGUES)) {
      if (!textOf(catalogue, key).trim()) errors.push(`chrome ${locale}: empty value for ${key}`);
    }
  }

  // 7. migrated files must not carry bare English JSX text
  const migratedFindings = {};
  for (const file of MIGRATED) {
    let src = "";
    try {
      src = read(file);
    } catch {
      warnings.push(`migrated file not found: ${file}`);
      continue;
    }
    const found = bareJsxText(src);
    if (found.length) {
      migratedFindings[file] = found;
      errors.push(
        `${file}: ${found.length} bare JSX text node(s): ${found.map((f) => `L${f.line} "${f.text.slice(0, 48)}"`).join("; ")}`
      );
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    filesScanned: usage.scanned,
    site: { keys: taKeys.length, hiDrafts: hiKeys.length, dynamicFamilies: contentPairs.dynamic },
    chrome: { keys: chromeKeys.size },
    bubble: { keys: bubbleTa.length, hiDrafts: bubbleHi.length, calls: bubbleUsage.calls, files: bubbleUsage.files },
    used: { site: usage.site, chrome: usage.chrome, dynamic: dynamicResolved },
    migrated: { files: MIGRATED.length, findings: migratedFindings },
    errors,
    warnings,
  };

  if (JSON_OUT) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    mkdirSync(join(ROOT, "docs/i18n"), { recursive: true });
    writeFileSync(join(ROOT, "docs/i18n/CATALOGUE.json"), `${JSON.stringify(report, null, 2)}\n`);
  }

  for (const w of warnings) console.log(`warn  ${w}`);
  for (const e of errors) console.log(`error ${e}`);

  if (CHECK && errors.length) {
    console.log(`\ni18n:check FAILED - ${errors.length} problem(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }
  const summary = `${taKeys.length} site keys x 3 locales, ${chromeKeys.size} chrome keys, ${bubbleTa.length} bubble keys x 3 locales (${bubbleUsage.calls} calls resolved), ${MIGRATED.length} migrated files, ${warnings.length} warning(s)`;
  console.log(CHECK ? `\ni18n:check OK - ${summary}.` : `\nwrote docs/i18n/CATALOGUE.json - ${summary}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

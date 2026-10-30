// Renders the design PDFs into design/pdf/:
//   tinai-<key>.pdf          one theme sheet per tinai (from themes/<key>/sheet.html)
//   bubble-ui-library-dark.pdf, bubble-ui-library-light.pdf
//                            the whole library page (/bubble) in each mode
//   bubble-ui-screens.pdf    the chat, its agents, Mission Control and the library,
//                            one screen a page, dark and light
//
// Needs Playwright and, for the last two, the site running:
//   npm run build && npm start            (in the repo root)
//   BASE_URL=http://localhost:3000 npm run pdfs   (in packages/bubble)
// Set PLAYWRIGHT_MODULE to a playwright install if it is not resolvable here.
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "design", "pdf");
const BASE = process.env.BASE_URL || "http://localhost:3000";
mkdirSync(out, { recursive: true });

const pw = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
// a CommonJS install imported by path puts its exports on default
const { chromium } = pw.chromium ? pw : pw.default;
const browser = await chromium.launch();
const keys = JSON.parse(readFileSync(join(root, "themes", "index.json"), "utf8")).map((t) => t.key);

// 1. theme sheets
for (const key of keys) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(join(root, "themes", key, "sheet.html")).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(out, `tinai-${key}.pdf`), format: "A4", landscape: true, printBackground: true });
  await page.close();
  console.log(`tinai-${key}.pdf`);
}

// 2. the library page, dark and light: scroll through first so every figure and field has drawn
for (const scheme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
  await page.goto(`${BASE}/bubble`, { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // switch to print layout first and let figures redraw before capturing
  await page.emulateMedia({ media: "print", colorScheme: scheme });
  await page.waitForTimeout(1500);
  await page.pdf({ path: join(out, `bubble-ui-library-${scheme}.pdf`), width: "1280px", height: "1810px", printBackground: true });
  await page.close();
  console.log(`bubble-ui-library-${scheme}.pdf`);
}

// 3. screens: screenshots laid out one per page. Mission Control is shown
//    awake with a sample Circle account (the session call is answered locally).
{
  const shots = [];
  const dir = mkdtempSync(join(tmpdir(), "bubble-screens-"));
  const snap = async (page, name, caption) => {
    const path = join(dir, `${name}.png`);
    await page.screenshot({ path });
    shots.push({ path, caption });
  };
  const sample = { signedIn: true, account: { accountId: "sample", email: "builder@example.org", fullName: "Sample Builder", companyId: "sample", createdAt: "2026-10-01" } };
  for (const scheme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
    const desk = await ctx.newPage();
    await desk.goto(`${BASE}/chat`, { waitUntil: "networkidle" });
    await desk.waitForTimeout(1200);
    const agents = scheme === "dark" ? ["Pulavar", "Nyaya", "Kural", "Guru", "Annachi"] : ["Pulavar", "Nyaya"];
    for (const name of agents) {
      await desk.locator(`nav[aria-label='Agents']:visible button[aria-label='${name}']`).first().click();
      await desk.waitForTimeout(1300);
      await snap(desk, `chat-${scheme}-${name}`, `Yazhi Chat · ${name} — persona, rule and first questions, in its landscape · ${scheme}`);
    }
    await snap(desk, `chat-${scheme}-asleep`, `Mission Control asleep — no Circle account yet; pressing it opens sign-in · ${scheme}`);
    await ctx.route("**/api/circle/session", (r) => r.fulfill({ json: sample }));
    await desk.reload({ waitUntil: "networkidle" });
    await desk.waitForTimeout(800);
    await desk.locator("button[aria-label^='Mission Control — signed in']").first().click();
    await desk.waitForTimeout(600);
    await snap(desk, `chat-${scheme}-mission`, `Mission Control awake (sample account): account, theme, landscape, where replies run · ${scheme}`);
    for (const [hash, caption] of [
      ["", "Bubble UI library · cover"],
      ["#themes", "Library · themes, with persona, palette in both modes and motion"],
      ["#components", "Library · components"],
      ["#templates", "Library · templates"],
      ["#agents", "Library · agents"],
    ]) {
      await desk.goto(`${BASE}/bubble${hash}`, { waitUntil: "networkidle" });
      await desk.waitForTimeout(1200);
      await snap(desk, `bubble-${scheme}-${hash.slice(1) || "cover"}`, `${caption} · ${scheme}`);
    }
    await ctx.close();
  }
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(`${BASE}/chat`, { waitUntil: "networkidle" });
  await phone.waitForTimeout(1200);
  await snap(phone, "phone-chat", "Yazhi Chat on a phone");

  const html = `<!doctype html><meta charset="utf-8"><style>
@page{size:A4 landscape;margin:0}body{margin:0;background:#0a0a0a;color:#f8f5ef;font:12px/1.4 Georgia,serif}
section{width:297mm;height:210mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5mm;page-break-after:always;padding:10mm;box-sizing:border-box}
img{max-width:100%;max-height:178mm;border:1px solid #333;border-radius:3mm}p{margin:0;color:#cbc9c4}
</style>${shots.map((s) => `<section><img src="${pathToFileURL(s.path).href}"><p>${s.caption}</p></section>`).join("")}`;
  const sheet = join(dir, "screens.html");
  writeFileSync(sheet, html);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(sheet).href, { waitUntil: "load" });
  await page.pdf({ path: join(out, "bubble-ui-screens.pdf"), format: "A4", landscape: true, printBackground: true });
  console.log("bubble-ui-screens.pdf");
}

await browser.close();

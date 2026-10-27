// Renders the design PDFs into design/pdf/:
//   tinai-<key>.pdf          one theme sheet per tinai (from themes/<key>/sheet.html)
//   bubble-design-book.pdf   the whole design book (/bubble/design)
//   bubble-ui-screens.pdf    the chat, its agents and the library, one screen a page
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

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
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

// 2. the design book: scroll through first so every figure and field has drawn
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/bubble/design`, { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // switch to print layout first and let figures redraw before capturing
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(1500);
  await page.pdf({ path: join(out, "bubble-design-book.pdf"), width: "1280px", height: "1810px", printBackground: true });
  await page.close();
  console.log("bubble-design-book.pdf");
}

// 3. screens: screenshots laid out one per page
{
  const shots = [];
  const dir = mkdtempSync(join(tmpdir(), "bubble-screens-"));
  const snap = async (page, name, caption) => {
    const path = join(dir, `${name}.png`);
    await page.screenshot({ path });
    shots.push({ path, caption });
  };
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desk.goto(`${BASE}/chat`, { waitUntil: "networkidle" });
  await desk.waitForTimeout(1200);
  for (const name of ["Pulavar", "Nyaya", "Kural", "Guru", "Annachi"]) {
    await desk.locator(`nav[aria-label='Agents']:visible button[aria-label='${name}']`).first().click();
    await desk.waitForTimeout(1300);
    await snap(desk, `chat-${name}`, `Yazhi Chat · ${name} — persona, rule and first questions, in its landscape`);
  }
  await desk.locator("summary:has-text('See how')").click();
  await desk.waitForTimeout(700);
  await snap(desk, "chat-sample", "Yazhi Chat · a sample answer, labelled illustrative");
  await desk.locator("button[aria-label='Settings']").click();
  await desk.waitForTimeout(500);
  await snap(desk, "chat-settings", "Yazhi Chat · Settings: choose a landscape or follow the agent; choose where replies run");
  for (const [path, caption] of [
    ["/bubble/design", "Design book · cover"],
    ["/bubble", "Bubble UI · developer docs"],
    ["/bubble/components", "Library · components"],
    ["/bubble/modules", "Library · modules"],
    ["/bubble/pages", "Library · page templates"],
  ]) {
    await desk.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await desk.waitForTimeout(1200);
    await snap(desk, path.replace(/\W+/g, "-"), caption);
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

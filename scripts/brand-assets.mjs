// Renders the favicon and Apple icon (src/app) from the traced brand SVGs.
// Share images are generated per route by src/lib/og.tsx.
// Run: node scripts/brand-assets.mjs
import { chromium } from "playwright";
import fs from "node:fs";

const brand = (f) => fs.readFileSync(new URL(`../public/brand/${f}`, import.meta.url), "utf8");
const mark = brand("mark-light.svg");
const out = (f) => new URL(`../src/app/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(html, width, height, file, transparent = false) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><body style="margin:0">${html}</body></html>`);
  await page.screenshot({ path: out(file), omitBackground: transparent });
  console.log("wrote", file);
}

const markSized = (w) => mark.replace("<svg", `<svg width="${w}"`);

await render(
  `<div style="width:512px;height:512px;border-radius:112px;background:#0c1229;display:grid;place-items:center">${markSized(330)}</div>`,
  512,
  512,
  "icon.png",
  true,
);
await render(
  `<div style="width:180px;height:180px;background:#0c1229;display:grid;place-items:center">${markSized(112)}</div>`,
  180,
  180,
  "apple-icon.png",
);
await browser.close();

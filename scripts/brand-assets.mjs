// Renders favicon and apple icon (src/app) and the default Open Graph image (public/og.png) from the traced brand SVGs.
// Run: node scripts/brand-assets.mjs
import { chromium } from "playwright";
import fs from "node:fs";

const brand = (f) => fs.readFileSync(new URL(`../public/brand/${f}`, import.meta.url), "utf8");
const mark = brand("mark-light.svg");
const lockup = brand("logo-light.svg");
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
await render(
  `<div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;background:radial-gradient(90% 120% at 100% 0%,#2c22c9 0%,#0c1229 55%,#070b1a 100%);display:flex;flex-direction:column;justify-content:space-between;font-family:'Segoe UI',Arial,sans-serif;color:#f2f3f8">
    ${lockup.replace("<svg", '<svg width="380"')}
    <div>
      <div style="font-size:84px;font-weight:900;letter-spacing:-3px;line-height:1">We colour outside the lines.</div>
      <div style="margin-top:24px;font-size:28px;color:#a3a9c2">Websites &middot; Android &amp; iOS apps &middot; Custom software &middot; Social media</div>
    </div>
  </div>`,
  1200,
  630,
  "../../public/og.png",
);

await browser.close();

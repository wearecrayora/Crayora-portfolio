/* eslint-disable @next/next/no-img-element -- Satori renders plain <img>; next/image does not apply to OG images. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { widestWordEm, wordWidthEm } from "./fit-heading";

/**
 * Case study share images (1200x630), rendered at build time with Satori: warm ivory,
 * violet aurora and the project screenshot in a glass frame. Every other page uses the
 * logo image in src/app/opengraph-image.png.
 */

const INK = "#0c1229";
const MUTE = "#545a70";
const INDIGO = "#3d31ee";
const CANVAS = "#f6f2ec";

// Literal paths so the build only traces these assets, not the whole project.
const toDataUri = (data: Buffer, mime: string) => `data:${mime};base64,${data.toString("base64")}`;
const readLogo = () => readFile(join(process.cwd(), "public/brand/logo-dark.svg"));
const readMark = () => readFile(join(process.cwd(), "public/brand/mark.svg"));
const readShot = (slug: string) => readFile(join(process.cwd(), "src/assets/og/work", `${slug}.jpg`));

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 800; style: "normal" }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(process.cwd(), "src/assets/og/fonts/syne-latin-800-normal.woff")).then((data) => ({ name: "Syne", data, weight: 800 as const, style: "normal" as const })),
    readFile(join(process.cwd(), "src/assets/og/fonts/geist-sans-latin-500-normal.woff")).then((data) => ({ name: "Geist", data, weight: 500 as const, style: "normal" as const })),
    readFile(join(process.cwd(), "src/assets/og/fonts/geist-mono-latin-500-normal.woff")).then((data) => ({ name: "Geist Mono", data, weight: 500 as const, style: "normal" as const })),
  ]));

type OgInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Project slug: shows its screenshot in a glass browser frame. */
  screenshot?: { slug: string; width: number; height: number };
};

/**
 * Largest size (px) that fits the title. A title with explicit "\n" breaks keeps
 * each line whole; otherwise only the longest word has to fit on a line.
 */
function titleSize(title: string, width: number) {
  const lines = title.split("\n");
  if (lines.length > 1) {
    const lineEm = (line: string) => line.split(/\s+/).reduce((em, w) => em + wordWidthEm(w) + 0.28, -0.28);
    return Math.min(96, Math.floor(width / (Math.max(...lines.map(lineEm)) * 1.06)));
  }
  const cap = title.length > 26 ? 66 : title.length > 14 ? 80 : 96;
  return Math.min(cap, Math.floor(width / (widestWordEm(title) * 1.06)));
}

// Aurora as a blurred SVG: Satori's CSS radial gradients render with hard edges, resvg's SVG blur does not.
const AURORA_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">' +
  '<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter></defs>' +
  '<g filter="url(#b)">' +
  '<ellipse cx="120" cy="40" rx="360" ry="260" fill="#7c68ff" fill-opacity="0.42"/>' +
  '<ellipse cx="1080" cy="640" rx="420" ry="300" fill="#4b3fff" fill-opacity="0.36"/>' +
  '<ellipse cx="780" cy="30" rx="300" ry="200" fill="#e2a0ff" fill-opacity="0.38"/>' +
  '<ellipse cx="420" cy="640" rx="320" ry="160" fill="#baa4ff" fill-opacity="0.3"/>' +
  "</g></svg>";
const AURORA = `data:image/svg+xml;base64,${Buffer.from(AURORA_SVG).toString("base64")}`;

const glass = {
  background: "linear-gradient(140deg, rgba(255,255,255,0.78), rgba(255,255,255,0.32))",
  border: "1.5px solid rgba(255,255,255,0.95)",
  boxShadow: "0 40px 80px -30px rgba(44,34,201,0.45)",
};

export async function renderOg({ eyebrow, title, subtitle, screenshot }: OgInput) {
  const [fontData, logo, mark, shot] = await Promise.all([
    loadFonts(),
    readLogo().then((d) => toDataUri(d, "image/svg+xml")),
    readMark().then((d) => toDataUri(d, "image/svg+xml")),
    screenshot ? readShot(screenshot.slug).then((d) => toDataUri(d, "image/jpeg")) : Promise.resolve(null),
  ]);

  const columnWidth = shot ? 600 : 760;
  // Show the whole screenshot width; the frame height follows its aspect ratio.
  const shotWidth = 540;
  const shotHeight = screenshot ? Math.round((shotWidth * screenshot.height) / screenshot.width) : 0;
  const frameTop = Math.round((630 - (shotHeight + 58)) / 2);
  const size = titleSize(title, columnWidth - 144);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: CANVAS, fontFamily: "Geist" }}>
        {/* Aurora */}
        <img src={AURORA} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />

        {/* Copy */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: columnWidth, height: "100%", padding: "60px 72px" }}>
          <img src={logo} width={228} height={60} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignSelf: "flex-start", padding: "9px 18px", borderRadius: 9999, ...glass, boxShadow: "none", fontFamily: "Geist Mono", fontSize: 17, letterSpacing: 2, color: INDIGO, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontFamily: "Syne", fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.04, color: INK }}>
              {title.split("\n").map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            {subtitle ? <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.4, color: MUTE }}>{subtitle}</div> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: INK }}>
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: INDIGO, marginRight: 12 }} />
            crayoratech.com
          </div>
        </div>

        {/* Visual */}
        {shot ? (
          <div style={{ position: "absolute", right: 48, top: frameTop, width: shotWidth + 28, display: "flex", flexDirection: "column", borderRadius: 28, padding: 14, ...glass }}>
            <div style={{ display: "flex", padding: "4px 6px 12px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: 9999, background: "rgba(12,18,41,0.18)", marginRight: 7 }} />
              ))}
            </div>
            <img src={shot} width={shotWidth} height={shotHeight} alt="" style={{ borderRadius: 16 }} />
          </div>
        ) : (
          <div style={{ position: "absolute", right: -40, top: 60, width: 510, height: 510, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", ...glass }}>
            <img src={mark} width={270} height={279} alt="" />
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630, fonts: fontData },
  );
}

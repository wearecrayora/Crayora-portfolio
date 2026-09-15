/**
 * Font size that lets the longest word of a display heading fit on one line.
 * Syne ExtraBold averages about 1.05em per glyph, so a word of n letters needs
 * roughly n * 1.1 em of width. Use inside an element with `@container`: cqw is
 * relative to that container, so the cap follows the real column width.
 */
export function fitHeading(text: string, max: string) {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length));
  return `min(${max}, ${(100 / (longest * 1.1)).toFixed(2)}cqw)`;
}

/**
 * Approximate width of a word in Syne ExtraBold, in em. Capitals and the wide
 * lowercase letters (m, w) are much wider than average, so all-caps names like
 * "SSBWINGS" need far more room than their letter count suggests.
 */
// Calibrated against rendered Syne 800 with the site's tight tracking:
// "Pharmaceuticals" measures about 13.2em and "SSBWINGS" about 8.7em.
export function wordWidthEm(word: string) {
  let em = 0;
  for (const ch of word) {
    if (/[MW]/.test(ch)) em += 1.45;
    else if (/[IJ]/.test(ch)) em += 0.55;
    else if (/[A-Z]/.test(ch)) em += 1.12;
    else if (/[mw]/.test(ch)) em += 1.3;
    else if (/[ijlt.,'!|]/.test(ch)) em += 0.55;
    else em += 0.92;
  }
  return em;
}

/** Width in em of the widest word, which decides how large the heading can be. */
export const widestWordEm = (text: string) => Math.max(...text.split(/\s+/).map(wordWidthEm));

/**
 * Font size that lets the longest word of a display heading fit on one line.
 * Use inside an element with `@container`: cqw is relative to that container,
 * so the cap follows the real column width.
 */
export function fitHeading(text: string, max: string) {
  return `min(${max}, ${(100 / (widestWordEm(text) * 1.12)).toFixed(2)}cqw)`;
}

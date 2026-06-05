import { colors as siennaColors, routinePalette } from "../../tokens/colors";
import { typography } from "../../tokens/typography";

export const colors: Record<string, string> = {
  bg: siennaColors.bg,
  surface: siennaColors.surface,
  surfaceAlt: siennaColors.surfaceAlt,
  ink: siennaColors.ink,
  inkSoft: siennaColors.inkSoft,
  muted: siennaColors.muted,
  border: siennaColors.border,
  primary: siennaColors.primary,
  primaryInk: siennaColors.primaryInk,
  primarySoft: siennaColors.primarySoft,
  accent: siennaColors.accent,
  accentSoft: siennaColors.accentSoft,
  ring: siennaColors.ring,
};

// PDF-specific scale — matches the prototype's inline font sizes exactly.
// The web design tokens (src/tokens/typography.ts) are sized for screen UI;
// the PDF renderer needs smaller values to match the A4 prototype output.
export const typeScale: Record<
  string,
  { fontSize: number; fontWeight: number }
> = {
  display: { fontSize: 38, fontWeight: 800 }, // single-guide cat name
  title: { fontSize: 27, fontWeight: 800 }, // merged-guide cat name
  uiHeading: { fontSize: 19, fontWeight: 700 },
  sectionHd: { fontSize: 17, fontWeight: 700 },
  body: { fontSize: 12.5, fontWeight: 400 },
  small: { fontSize: 13, fontWeight: 400 }, // MiniCard titles, contact names
  caption: { fontSize: 11, fontWeight: 700 }, // eyebrows, footer
};

export const palette: string[] = [
  routinePalette[0],
  routinePalette[1],
  routinePalette[2],
  routinePalette[3],
  routinePalette[4],
  routinePalette[5],
];

import { colors as siennaColors, routinePalette } from "../../tokens/colors";

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

// react-pdf uses PDF points (72 DPI); the prototype uses CSS pixels (96 DPI).
// Conversion: pt = px × (72/96) = px × 0.75.
export const typeScale: Record<
  string,
  { fontSize: number; fontWeight: number }
> = {
  display: { fontSize: 29, fontWeight: 800 }, // 38px × 0.75
  title: { fontSize: 20, fontWeight: 800 }, // 27px × 0.75
  uiHeading: { fontSize: 14, fontWeight: 700 }, // 19px × 0.75
  sectionHd: { fontSize: 13, fontWeight: 700 }, // 17px × 0.75
  body: { fontSize: 9.5, fontWeight: 400 }, // 12.5px × 0.75
  small: { fontSize: 10, fontWeight: 400 }, // 13px × 0.75
  caption: { fontSize: 8, fontWeight: 700 }, // 11px × 0.75
};

export const palette: string[] = [
  routinePalette[0],
  routinePalette[1],
  routinePalette[2],
  routinePalette[3],
  routinePalette[4],
  routinePalette[5],
];

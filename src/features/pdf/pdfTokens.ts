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

export const typeScale: Record<
  string,
  { fontSize: number; fontWeight: number }
> = {
  display: {
    fontSize: typography.scale.display.size,
    fontWeight: typography.scale.display.weight,
  },
  title: {
    fontSize: typography.scale.title.size,
    fontWeight: typography.scale.title.weight,
  },
  uiHeading: {
    fontSize: typography.scale.uiHeading.size,
    fontWeight: typography.scale.uiHeading.weight,
  },
  sectionHd: {
    fontSize: typography.scale.sectionHd.size,
    fontWeight: typography.scale.sectionHd.weight,
  },
  body: {
    fontSize: typography.scale.body.size,
    fontWeight: typography.scale.body.weight,
  },
  small: {
    fontSize: typography.scale.small.size,
    fontWeight: typography.scale.small.weight,
  },
  caption: {
    fontSize: typography.scale.caption.size,
    fontWeight: typography.scale.caption.weight,
  },
};

export const palette: string[] = [
  routinePalette[0],
  routinePalette[1],
  routinePalette[2],
  routinePalette[3],
  routinePalette[4],
  routinePalette[5],
];

import { describe, expect, it } from "vitest";
import { colors, typeScale, palette } from "./pdfTokens";

describe("pdfTokens colors", () => {
  it("exports all 13 Sienna color keys", () => {
    const required = [
      "bg",
      "surface",
      "surfaceAlt",
      "ink",
      "inkSoft",
      "muted",
      "border",
      "primary",
      "primaryInk",
      "primarySoft",
      "accent",
      "accentSoft",
      "ring",
    ];
    for (const key of required) {
      expect(colors).toHaveProperty(key);
    }
  });

  it("primary color matches the Sienna source token", () => {
    expect(colors.primary).toBe("#A0502B");
  });

  it("surface color matches the Sienna source token", () => {
    expect(colors.surface).toBe("#FBF6EC");
  });
});

describe("pdfTokens typeScale", () => {
  it("exports all 7 type scale levels", () => {
    const levels = [
      "display",
      "title",
      "uiHeading",
      "sectionHd",
      "body",
      "small",
      "caption",
    ];
    for (const level of levels) {
      expect(typeScale).toHaveProperty(level);
    }
  });

  it("each level has a numeric fontSize", () => {
    for (const entry of Object.values(typeScale)) {
      expect(typeof entry.fontSize).toBe("number");
    }
  });

  it("each level has a numeric fontWeight", () => {
    for (const entry of Object.values(typeScale)) {
      expect(typeof entry.fontWeight).toBe("number");
    }
  });
});

describe("pdfTokens palette", () => {
  it("has exactly 6 colors", () => {
    expect(palette).toHaveLength(6);
  });

  it("starts with the burnt sienna primary color", () => {
    expect(palette[0]).toBe("#A0502B");
  });
});

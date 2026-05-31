import { describe, expect, it } from "vitest";
import { routinePalette, theme } from "./index";

describe("theme", () => {
  it("exports a theme object with all required top-level keys", () => {
    expect(theme).toHaveProperty("colors");
    expect(theme).toHaveProperty("typography");
    expect(theme).toHaveProperty("spacing");
    expect(theme).toHaveProperty("radii");
    expect(theme).toHaveProperty("shadows");
  });

  it("has all 13 Sienna color tokens", () => {
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
      expect(theme.colors).toHaveProperty(key);
    }
  });

  it("has the correct Sienna canvas background color", () => {
    expect(theme.colors.bg).toBe("#F2E9DA");
  });

  it("has the correct burnt sienna primary color", () => {
    expect(theme.colors.primary).toBe("#A0502B");
  });

  it("has a card radius of 12", () => {
    expect(theme.radii.card).toBe(12);
  });

  it("includes Plus Jakarta Sans in the typography family", () => {
    expect(theme.typography.family).toContain("Plus Jakarta Sans");
  });

  it("has a base shadow defined as a string", () => {
    expect(typeof theme.shadows.base).toBe("string");
  });

  it("has spacing defined", () => {
    expect(theme.spacing).toBeDefined();
  });
});

describe("routinePalette", () => {
  it("has exactly 6 colors", () => {
    expect(routinePalette).toHaveLength(6);
  });

  it("starts with the primary burnt sienna color", () => {
    expect(routinePalette[0]).toBe("#A0502B");
  });
});

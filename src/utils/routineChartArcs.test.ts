import { describe, expect, it } from "vitest";
import { arcPath } from "./routineChartArcs";

describe("arcPath", () => {
  it("returns a string beginning with the SVG move command", () => {
    expect(arcPath("06:00", 2, 200)).toMatch(/^M\s/);
  });

  it("uses cubic Bézier commands (C), not arc commands (A)", () => {
    const path = arcPath("06:00", 2, 200);
    expect(path).toContain(" C ");
    expect(path).not.toContain(" A ");
  });

  it("uses a single Bézier segment for a ≤90° arc (6 hours)", () => {
    const path = arcPath("00:00", 6, 200);
    const segments = path.match(/\bC\b/g);
    expect(segments).toHaveLength(1);
  });

  it("uses multiple Bézier segments for a >90° arc (14 hours)", () => {
    const path = arcPath("00:00", 14, 200);
    const segments = path.match(/\bC\b/g);
    expect(segments!.length).toBeGreaterThan(1);
  });

  it("produces different start and end coordinates for a non-zero duration", () => {
    const path = arcPath("06:00", 6, 200);
    const startMatch = path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
    // Last two numbers in the path string are the Bézier end point
    const endMatch = path.match(/([\d.-]+)\s+([\d.-]+)\s*$/);
    expect(startMatch).not.toBeNull();
    expect(endMatch).not.toBeNull();
    const start = `${startMatch![1]},${startMatch![2]}`;
    const end = `${endMatch![1]},${endMatch![2]}`;
    expect(start).not.toBe(end);
  });

  it("handles a slot that wraps past midnight without throwing", () => {
    expect(() => arcPath("22:00", 9, 200)).not.toThrow();
    expect(arcPath("22:00", 9, 200)).toMatch(/^M\s/);
  });

  it("midnight slot starts at the 12 o'clock position", () => {
    const path = arcPath("00:00", 6, 200);
    const startMatch = path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
    expect(startMatch).not.toBeNull();
    expect(parseFloat(startMatch![1])).toBeCloseTo(100, 3);
    expect(parseFloat(startMatch![2])).toBeCloseTo(24, 3);
  });

  it("noon slot starts at the 6 o'clock position", () => {
    const path = arcPath("12:00", 6, 200);
    const startMatch = path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
    expect(startMatch).not.toBeNull();
    expect(parseFloat(startMatch![1])).toBeCloseTo(100, 3);
    expect(parseFloat(startMatch![2])).toBeCloseTo(176, 3);
  });

  it("returns an empty string for a zero-duration slot", () => {
    expect(arcPath("06:00", 0, 200)).toBe("");
  });
});

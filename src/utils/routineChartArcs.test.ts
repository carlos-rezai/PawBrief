import { describe, expect, it } from "vitest";
import { arcPath } from "./routineChartArcs";

describe("arcPath", () => {
  it("returns a string beginning with the SVG move command", () => {
    expect(arcPath("06:00", 2, 200)).toMatch(/^M\s/);
  });

  it("includes the SVG arc command", () => {
    expect(arcPath("06:00", 2, 200)).toContain(" A ");
  });

  it("sets large-arc flag to 0 for duration 12 hours or shorter", () => {
    const path = arcPath("00:00", 6, 200);
    const match = path.match(/A\s+[\d.]+\s+[\d.]+\s+0\s+([01])\s+1/);
    expect(match?.[1]).toBe("0");
  });

  it("sets large-arc flag to 1 for duration longer than 12 hours", () => {
    const path = arcPath("00:00", 14, 200);
    const match = path.match(/A\s+[\d.]+\s+[\d.]+\s+0\s+([01])\s+1/);
    expect(match?.[1]).toBe("1");
  });

  it("produces different start and end coordinates for a non-zero duration", () => {
    const path = arcPath("06:00", 6, 200);
    const startMatch = path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
    const endMatch = path.match(/\s+1\s+([\d.-]+)\s+([\d.-]+)\s*$/);
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
});

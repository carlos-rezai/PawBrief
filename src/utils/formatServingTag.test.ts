import { describe, expect, it } from "vitest";
import { formatServingTag } from "./formatServingTag";

describe("formatServingTag", () => {
  it('formats a serving entry as "HH:MM · Xg"', () => {
    expect(formatServingTag({ time: "07:30", grams: 70 })).toBe("07:30 · 70g");
  });
});

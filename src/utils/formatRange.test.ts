import { describe, expect, it } from "vitest";
import { formatRange } from "./formatRange";

describe("formatRange", () => {
  it("returns HH:MM–HH:MM for a normal range", () => {
    expect(formatRange("08:00", 2)).toBe("08:00–10:00");
  });

  it("handles midnight wrap", () => {
    expect(formatRange("22:00", 8)).toBe("22:00–06:00");
  });

  it("handles sub-hour durations", () => {
    expect(formatRange("09:30", 0.5)).toBe("09:30–10:00");
  });

  it("handles whole-day wrap at midnight exactly", () => {
    expect(formatRange("20:00", 4)).toBe("20:00–00:00");
  });

  it("pads single-digit hours and minutes", () => {
    expect(formatRange("07:05", 1)).toBe("07:05–08:05");
  });
});

import { describe, expect, it } from "vitest";
import { formatAge } from "./formatAge";

describe("formatAge", () => {
  it("returns plural years for values greater than 1", () => {
    expect(formatAge(2, "years")).toBe("2 years");
  });

  it("returns singular year for value 1", () => {
    expect(formatAge(1, "years")).toBe("1 year");
  });

  it("returns plural months for values greater than 1", () => {
    expect(formatAge(6, "months")).toBe("6 months");
  });

  it("returns singular month for value 1", () => {
    expect(formatAge(1, "months")).toBe("1 month");
  });
});

import { describe, expect, it } from "vitest";
import { isSharedVet } from "./isSharedVet";

describe("isSharedVet", () => {
  it("returns true when both name and phone match", () => {
    const vet = { name: "Dr. Smith", phone: "555-1234" };
    expect(isSharedVet(vet, { ...vet })).toBe(true);
  });

  it("returns false when name matches but phone differs", () => {
    expect(
      isSharedVet(
        { name: "Dr. Smith", phone: "555-1234" },
        { name: "Dr. Smith", phone: "555-9999" }
      )
    ).toBe(false);
  });

  it("returns false when phone matches but name differs", () => {
    expect(
      isSharedVet(
        { name: "Dr. Smith", phone: "555-1234" },
        { name: "Dr. Jones", phone: "555-1234" }
      )
    ).toBe(false);
  });
});

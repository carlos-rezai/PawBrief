import { describe, expect, it } from "vitest";
import { deriveFeedingSlot } from "./deriveFeedingSlot";

describe("deriveFeedingSlot", () => {
  it("returns a slot labelled Feeding when given zero feeding times", () => {
    const slot = deriveFeedingSlot([]);
    expect(slot.label).toBe("Feeding");
  });

  it("returns a slot labelled Feeding when given multiple feeding times", () => {
    const slot = deriveFeedingSlot(["08:00", "12:00", "18:00"]);
    expect(slot.label).toBe("Feeding");
  });
});

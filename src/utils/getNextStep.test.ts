import { describe, expect, it } from "vitest";
import type { CatProfile, WizardStep } from "../types/profile";
import { getNextStep } from "./getNextStep";

function makeProfile(completedSteps: WizardStep[]): CatProfile {
  return {
    id: "test",
    completedSteps,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("getNextStep", () => {
  it("returns 'basics' when no steps are complete", () => {
    expect(getNextStep(makeProfile([]))).toBe("basics");
  });

  it("returns 'feeding' when only basics is complete", () => {
    expect(getNextStep(makeProfile(["basics"]))).toBe("feeding");
  });

  it("returns the first incomplete step when several steps are complete", () => {
    expect(getNextStep(makeProfile(["basics", "feeding", "routine"]))).toBe(
      "favorites"
    );
  });

  it("returns null when all six steps are complete", () => {
    expect(
      getNextStep(
        makeProfile([
          "basics",
          "feeding",
          "routine",
          "favorites",
          "medical",
          "notes",
        ])
      )
    ).toBeNull();
  });
});

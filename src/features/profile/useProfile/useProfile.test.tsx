import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { saveProfile } from "../profileStorage/profileStorage";
import { useProfile } from "./useProfile";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

function makeProfile(id: string) {
  return {
    id,
    completedSteps: [] as (
      | "basics"
      | "feeding"
      | "routine"
      | "favorites"
      | "medical"
      | "notes"
    )[],
    basics: {
      name: "Luna",
      breed: "Siamese",
      ageValue: 1,
      ageUnit: "years" as const,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("useProfile", () => {
  it("returns null for a profile ID that does not exist", async () => {
    const { result } = renderHook(() => useProfile("ghost-id"));
    await act(async () => {});
    expect(result.current.profile).toBeNull();
  });

  it("loads an existing profile from storage", async () => {
    await saveProfile(makeProfile("real-id"));
    const { result } = renderHook(() => useProfile("real-id"));
    await act(async () => {});
    expect(result.current.profile).not.toBeNull();
    expect(result.current.profile?.id).toBe("real-id");
  });

  it("saveStep adds the step to completedSteps and persists it", async () => {
    await saveProfile(makeProfile("step-test"));
    const { result } = renderHook(() => useProfile("step-test"));
    await act(async () => {});
    await act(async () => {
      await result.current.saveStep("basics", {
        name: "Luna",
        ageValue: 2,
        ageUnit: "years",
      });
    });
    expect(result.current.profile?.completedSteps).toContain("basics");
  });

  it("saveStep persists a non-basics step and updates completedSteps", async () => {
    await saveProfile(makeProfile("feeding-test"));
    const { result } = renderHook(() => useProfile("feeding-test"));
    await act(async () => {});
    await act(async () => {
      await result.current.saveStep("feeding", {
        foodEntries: [
          { brand: "Royal Canin", flavor: "chicken", texture: "dry" },
        ],
        servings: [
          { grams: 50, time: "08:00" },
          { grams: 50, time: "18:00" },
        ],
        supplementEntries: [],
        platingInstructions: "Mix with water",
      });
    });
    expect(result.current.profile?.completedSteps).toContain("feeding");
    expect(result.current.profile?.feeding?.foodEntries[0].brand).toBe(
      "Royal Canin"
    );
  });
});

import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteProfile,
  getAllProfiles,
  getProfile,
  saveProfile,
} from "./profileStorage";

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
      name: "Whiskers",
      breed: "Tabby",
      ageValue: 2,
      ageUnit: "years" as const,
    },
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  };
}

describe("profileStorage", () => {
  it("returns an empty array when no profiles have been saved", async () => {
    expect(await getAllProfiles()).toEqual([]);
  });

  it("persists a profile and retrieves it by ID", async () => {
    const profile = makeProfile("profile-1");
    await saveProfile(profile);
    expect(await getProfile("profile-1")).toEqual(profile);
  });

  it("returns all saved profiles from getAllProfiles", async () => {
    await saveProfile(makeProfile("id-a"));
    await saveProfile(makeProfile("id-b"));
    const all = await getAllProfiles();
    expect(all).toHaveLength(2);
  });

  it("removes a profile so getProfile returns undefined", async () => {
    await saveProfile(makeProfile("to-delete"));
    await deleteProfile("to-delete");
    expect(await getProfile("to-delete")).toBeUndefined();
  });
});

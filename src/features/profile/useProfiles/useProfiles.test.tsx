import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProfiles } from "./useProfiles";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

describe("useProfiles", () => {
  it("returns an empty array when no profiles exist", async () => {
    const { result } = renderHook(() => useProfiles());
    await act(async () => {});
    expect(result.current.profiles).toEqual([]);
  });

  it("createProfile adds a new profile to the profiles list", async () => {
    const { result } = renderHook(() => useProfiles());
    await act(async () => {});
    await act(async () => {
      await result.current.createProfile();
    });
    expect(result.current.profiles).toHaveLength(1);
  });

  it("deleteProfile removes the profile from the list", async () => {
    const { result } = renderHook(() => useProfiles());
    await act(async () => {});

    let id = "";
    await act(async () => {
      id = await result.current.createProfile();
    });

    await act(async () => {
      await result.current.deleteProfile(id);
    });

    expect(result.current.profiles).toHaveLength(0);
  });
});

import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as photoStorage from "../photoStorage/photoStorage";
import type { CatProfile } from "../../../types/profile";
import { useProfileAvatarUrls } from "./useProfileAvatarUrls";

const mockCreateObjectURL = vi.fn(() => "blob:fake-url");
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  vi.spyOn(photoStorage, "getPhoto").mockResolvedValue(
    new Blob(["img"], { type: "image/jpeg" })
  );
  globalThis.URL.createObjectURL = mockCreateObjectURL;
  globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
  mockCreateObjectURL.mockClear();
  mockRevokeObjectURL.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function makeProfile(id: string, photoId?: string): CatProfile {
  return {
    id,
    completedSteps: ["basics"],
    basics: { name: "Luna", ageValue: 2, ageUnit: "years", photoId },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("useProfileAvatarUrls", () => {
  it("returns a blob URL keyed by profile ID for a profile with a photo", async () => {
    const profiles = [makeProfile("p1", "photo-id-1")];

    const { result } = renderHook(() => useProfileAvatarUrls(profiles));
    await act(async () => {});

    expect(result.current["p1"]).toBe("blob:fake-url");
  });

  it("returns an empty map when no profiles have a photo", async () => {
    const profiles = [makeProfile("p1")];
    const { result } = renderHook(() => useProfileAvatarUrls(profiles));
    await act(async () => {});

    expect(result.current).toEqual({});
  });

  it("returns an empty map for an empty profiles array", async () => {
    const { result } = renderHook(() => useProfileAvatarUrls([]));
    await act(async () => {});

    expect(result.current).toEqual({});
  });

  it("revokes all blob URLs on unmount", async () => {
    const profiles = [makeProfile("p1", "photo-id-1")];

    const { result, unmount } = renderHook(() =>
      useProfileAvatarUrls(profiles)
    );
    await act(async () => {});

    expect(result.current["p1"]).toBeDefined();
    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:fake-url");
  });

  it("loads blob URLs for multiple profiles with photos", async () => {
    const profiles = [
      makeProfile("p1", "photo-id-1"),
      makeProfile("p2", "photo-id-2"),
    ];

    const { result } = renderHook(() => useProfileAvatarUrls(profiles));
    await act(async () => {});

    expect(result.current["p1"]).toBeDefined();
    expect(result.current["p2"]).toBeDefined();
  });
});

import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { savePhoto } from "../profile";
import type { CatProfile } from "../../types/profile";
import { usePhotoBlobUrls } from "./usePhotoBlobUrls";

const mockCreateObjectURL = vi.fn(() => "blob:fake-url");
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = vi
    .fn()
    .mockImplementation((cb: BlobCallback) =>
      cb(new Blob(["img"], { type: "image/jpeg" }))
    ) as unknown as typeof HTMLCanvasElement.prototype.toBlob;
  globalThis.URL.createObjectURL = mockCreateObjectURL;
  globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
  mockCreateObjectURL.mockClear();
  mockRevokeObjectURL.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function makeProfile(photoId: string): CatProfile {
  return {
    id: "test",
    completedSteps: ["basics"],
    basics: { name: "Luna", ageValue: 2, ageUnit: "years", photoId },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("usePhotoBlobUrls", () => {
  it("returns an object URL for a known photo ID", async () => {
    const photoId = await savePhoto(
      new File(["fake-image"], "cat.jpg", { type: "image/jpeg" })
    );
    const profile = makeProfile(photoId);

    const { result } = renderHook(() => usePhotoBlobUrls(profile));

    await waitFor(() => {
      expect(result.current[photoId]).toBe("blob:fake-url");
    });
  });

  it("revokes all created URLs on unmount", async () => {
    const photoId = await savePhoto(
      new File(["fake-image"], "cat.jpg", { type: "image/jpeg" })
    );
    const profile = makeProfile(photoId);

    const { result, unmount } = renderHook(() => usePhotoBlobUrls(profile));

    await waitFor(() => {
      expect(result.current[photoId]).toBeDefined();
    });

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:fake-url");
  });

  it("returns an empty map when profile is null", () => {
    const { result } = renderHook(() => usePhotoBlobUrls(null));
    expect(result.current).toEqual({});
  });
});

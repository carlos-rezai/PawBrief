import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletePhoto, getPhoto, savePhoto } from "./photoStorage";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  // jsdom does not implement canvas rendering; provide stubs so EXIF stripping can run
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = vi
    .fn()
    .mockImplementation((cb: BlobCallback) =>
      cb(new Blob(["img"], { type: "image/jpeg" }))
    ) as unknown as typeof HTMLCanvasElement.prototype.toBlob;
});

function makeImageFile(name = "cat.jpg") {
  return new File(["fake-image"], name, { type: "image/jpeg" });
}

describe("photoStorage", () => {
  it("returns a UUID string when saving a photo", async () => {
    const id = await savePhoto(makeImageFile());
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it("retrieves the stored Blob by ID", async () => {
    const id = await savePhoto(makeImageFile());
    const blob = await getPhoto(id);
    expect(blob).toBeInstanceOf(Blob);
  });

  it("returns null after the photo has been deleted", async () => {
    const id = await savePhoto(makeImageFile());
    await deletePhoto(id);
    expect(await getPhoto(id)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { validatePhoto } from "./validatePhoto";

describe("validatePhoto", () => {
  it("returns null for a valid image file under 5 MB", () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    expect(validatePhoto(file)).toBeNull();
  });

  it("returns an error string for a non-image MIME type", () => {
    const file = new File(["data"], "document.pdf", {
      type: "application/pdf",
    });
    const result = validatePhoto(file);
    expect(result).not.toBeNull();
    expect(result).toMatch(/image/i);
  });

  it("returns an error string for an image over 5 MB", () => {
    const oversized = new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    const result = validatePhoto(oversized);
    expect(result).not.toBeNull();
  });
});

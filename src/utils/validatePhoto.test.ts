import { describe, expect, it } from "vitest";
import { validateMagicBytes, validatePhoto } from "./validatePhoto";

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

describe("validateMagicBytes", () => {
  it("returns true for a file with valid JPEG magic bytes", async () => {
    const bytes = new Uint8Array(12);
    bytes[0] = 0xff;
    bytes[1] = 0xd8;
    bytes[2] = 0xff;
    const file = new File([bytes], "photo.jpg", { type: "image/jpeg" });
    expect(await validateMagicBytes(file)).toBe(true);
  });

  it("returns true for a file with valid PNG magic bytes", async () => {
    const bytes = new Uint8Array(12);
    bytes[0] = 0x89;
    bytes[1] = 0x50;
    bytes[2] = 0x4e;
    bytes[3] = 0x47;
    const file = new File([bytes], "photo.png", { type: "image/png" });
    expect(await validateMagicBytes(file)).toBe(true);
  });

  it("returns true for a file with valid GIF magic bytes", async () => {
    const bytes = new Uint8Array(12);
    bytes[0] = 0x47;
    bytes[1] = 0x49;
    bytes[2] = 0x46;
    bytes[3] = 0x38;
    const file = new File([bytes], "photo.gif", { type: "image/gif" });
    expect(await validateMagicBytes(file)).toBe(true);
  });

  it("returns true for a file with valid WebP magic bytes", async () => {
    const bytes = new Uint8Array(12);
    // RIFF at bytes 0–3
    bytes[0] = 0x52;
    bytes[1] = 0x49;
    bytes[2] = 0x46;
    bytes[3] = 0x46;
    // WEBP at bytes 8–11
    bytes[8] = 0x57;
    bytes[9] = 0x45;
    bytes[10] = 0x42;
    bytes[11] = 0x50;
    const file = new File([bytes], "photo.webp", { type: "image/webp" });
    expect(await validateMagicBytes(file)).toBe(true);
  });

  it("returns false for a file with a valid image MIME type but wrong magic bytes", async () => {
    const bytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    const file = new File([bytes], "spoofed.jpg", { type: "image/jpeg" });
    expect(await validateMagicBytes(file)).toBe(false);
  });

  it("returns false for a file shorter than 4 bytes", async () => {
    const bytes = new Uint8Array([0xff, 0xd8]);
    const file = new File([bytes], "short.jpg", { type: "image/jpeg" });
    expect(await validateMagicBytes(file)).toBe(false);
  });

  it("returns false for an empty file", async () => {
    const file = new File([], "empty.jpg", { type: "image/jpeg" });
    expect(await validateMagicBytes(file)).toBe(false);
  });
});

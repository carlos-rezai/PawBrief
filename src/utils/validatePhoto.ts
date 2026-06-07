const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validatePhoto(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please upload an image file.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Image must be under 5 MB.";
  }
  return null;
}

/**
 * Verifies a file's actual content against known image magic byte signatures,
 * defeating uploads that carry a valid image MIME type but non-image bytes.
 */
export async function validateMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4) {
    return false;
  }

  // JPEG: FF D8 FF (bytes 0–2)
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 (bytes 0–3)
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return true;
  }

  // GIF: 47 49 46 38 (bytes 0–3)
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return true;
  }

  // WebP: RIFF (52 49 46 46) at bytes 0–3 AND WEBP (57 45 42 50) at bytes 8–11
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return true;
  }

  return false;
}

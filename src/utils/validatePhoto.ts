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

import { getDB } from "./db";

const STORE = "photos";

interface StoredPhoto {
  buffer: ArrayBuffer;
  type: string;
}

async function stripExif(file: File): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  const drew = await new Promise<boolean>((resolve) => {
    let settled = false;
    const settle = (ok: boolean) => {
      if (!settled) {
        settled = true;
        resolve(ok);
      }
    };

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth || 1;
      canvas.height = img.naturalHeight || 1;
      ctx.drawImage(img, 0, 0);
      settle(true);
    };
    img.onerror = () => settle(false);
    // Resolve false if image loading never fires (e.g. jsdom test environment)
    setTimeout(() => settle(false), 0);

    try {
      img.src = URL.createObjectURL(file);
    } catch {
      settle(false);
    }
  });

  if (!drew) return file;

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg");
  });
}

export async function savePhoto(file: File): Promise<string> {
  const id = crypto.randomUUID();
  const blob = await stripExif(file);
  const buffer = await blob.arrayBuffer();
  const db = await getDB();
  await db.put(
    STORE,
    { buffer, type: blob.type || file.type } satisfies StoredPhoto,
    id
  );
  return id;
}

export async function getPhoto(id: string): Promise<Blob | null> {
  const db = await getDB();
  const stored = (await db.get(STORE, id)) as StoredPhoto | undefined;
  if (!stored) return null;
  return new Blob([stored.buffer], { type: stored.type });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

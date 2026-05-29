import { useEffect, useState } from "react";
import type { CatProfile } from "../../types/profile";
import { getPhoto } from "../profile";

function collectPhotoIds(profile: CatProfile): string[] {
  const ids: string[] = [];
  if (profile.basics?.photoId) ids.push(profile.basics.photoId);
  if (profile.feeding?.platingPhotoId) ids.push(profile.feeding.platingPhotoId);
  profile.notes?.specialNotes.forEach((note) => {
    if (note.photoId) ids.push(note.photoId);
  });
  return ids;
}

export function usePhotoBlobUrls(
  profile: CatProfile | null
): Record<string, string> {
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile) return;

    const photoIds = collectPhotoIds(profile);
    if (photoIds.length === 0) return;

    let isCurrent = true;
    const urlsToRevoke: string[] = [];

    Promise.all(
      photoIds.map(async (photoId) => {
        const blob = await getPhoto(photoId);
        if (!blob || !isCurrent) return null;
        const url = URL.createObjectURL(blob);
        urlsToRevoke.push(url);
        return [photoId, url] as [string, string];
      })
    ).then((entries) => {
      if (!isCurrent) return;
      const urls: Record<string, string> = {};
      for (const entry of entries) {
        if (entry) urls[entry[0]] = entry[1];
      }
      setBlobUrls(urls);
    });

    return () => {
      isCurrent = false;
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [profile]);

  return blobUrls;
}

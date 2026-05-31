import { useEffect, useState } from "react";
import type { CatProfile } from "../../../types/profile";
import { getPhoto } from "../photoStorage/photoStorage";

export function useProfileAvatarUrls(
  profiles: CatProfile[]
): Record<string, string> {
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});

  // A stable string key derived from profile IDs + photoIds. React compares
  // dependency values by Object.is, so a same-content string prevents the
  // effect from re-running when only the array reference has changed.
  const photoKey = profiles
    .map((p) => `${p.id}:${p.basics?.photoId ?? ""}`)
    .join("|");

  useEffect(() => {
    const profilesWithPhotos = profiles.filter((p) => p.basics?.photoId);
    if (profilesWithPhotos.length === 0) {
      // Functional update avoids a spurious re-render when already empty.
      setAvatarUrls((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      return;
    }

    let isCurrent = true;
    const urlsToRevoke: string[] = [];

    Promise.all(
      profilesWithPhotos.map(async (profile) => {
        const photoId = profile.basics!.photoId!;
        const blob = await getPhoto(photoId);
        if (!blob || !isCurrent) return null;
        const url = URL.createObjectURL(blob);
        urlsToRevoke.push(url);
        return [profile.id, url] as [string, string];
      })
    ).then((entries) => {
      if (!isCurrent) return;
      const urls: Record<string, string> = {};
      for (const entry of entries) {
        if (entry) urls[entry[0]] = entry[1];
      }
      setAvatarUrls(urls);
    });

    return () => {
      isCurrent = false;
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
    // photoKey encodes all profile IDs + photoIds — profiles is used inside the
    // effect but we depend on the stable string key, not the array reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoKey]);

  return avatarUrls;
}

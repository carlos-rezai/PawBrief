import { useCallback, useEffect, useState } from "react";
import {
  deleteProfile as storageDelete,
  getAllProfiles,
  saveProfile,
} from "../profileStorage/profileStorage";
import type { CatProfile } from "../../../types/profile";

interface UseProfilesReturn {
  profiles: CatProfile[];
  createProfile: () => Promise<string>;
  deleteProfile: (id: string) => Promise<void>;
}

export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = useState<CatProfile[]>([]);

  useEffect(() => {
    getAllProfiles().then(setProfiles);
  }, []);

  const createProfile = useCallback(async (): Promise<string> => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const newProfile: CatProfile = {
      id,
      completedSteps: [],
      createdAt: now,
      updatedAt: now,
    };
    await saveProfile(newProfile);
    setProfiles((prev) => [...prev, newProfile]);
    return id;
  }, []);

  const deleteProfile = useCallback(async (id: string): Promise<void> => {
    await storageDelete(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { profiles, createProfile, deleteProfile };
}

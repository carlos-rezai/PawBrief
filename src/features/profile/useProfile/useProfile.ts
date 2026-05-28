import { useCallback, useEffect, useState } from "react";
import { getProfile, saveProfile } from "../profileStorage/profileStorage";
import type {
  BasicsData,
  CatProfile,
  WizardStep,
} from "../../../types/profile";

interface UseProfileReturn {
  profile: CatProfile | null;
  loading: boolean;
  saveStep: (step: WizardStep, data: BasicsData) => Promise<void>;
}

export function useProfile(id: string): UseProfileReturn {
  const [profile, setProfile] = useState<CatProfile | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // No synchronous state updates here — they cause act() to resolve prematurely
    // in tests before the async IDB query completes.
    getProfile(id).then((p) => {
      setProfile(p ?? null);
      setSettled(true);
    });
  }, [id]);

  const saveStep = useCallback(
    async (step: WizardStep, data: BasicsData) => {
      if (!profile) return;
      const updated: CatProfile = {
        ...profile,
        [step]: data,
        completedSteps: profile.completedSteps.includes(step)
          ? profile.completedSteps
          : [...profile.completedSteps, step],
        updatedAt: Date.now(),
      };
      await saveProfile(updated);
      setProfile(updated);
    },
    [profile]
  );

  return { profile, loading: !settled, saveStep };
}

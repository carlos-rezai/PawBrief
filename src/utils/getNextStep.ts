import type { CatProfile, WizardStep } from "../types/profile";

const STEP_ORDER: WizardStep[] = [
  "basics",
  "feeding",
  "routine",
  "favorites",
  "medical",
  "notes",
];

export function getNextStep(profile: CatProfile): WizardStep | null {
  for (const step of STEP_ORDER) {
    if (!profile.completedSteps.includes(step)) {
      return step;
    }
  }
  return null;
}

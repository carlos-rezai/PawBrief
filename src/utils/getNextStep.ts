import type { CatProfile, WizardStep } from "../types/profile";
import { STEP_ORDER } from "./wizardSteps";

export function getNextStep(profile: CatProfile): WizardStep | null {
  for (const step of STEP_ORDER) {
    if (!profile.completedSteps.includes(step)) {
      return step;
    }
  }
  return null;
}

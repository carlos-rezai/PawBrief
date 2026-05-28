export type WizardStep =
  | "basics"
  | "feeding"
  | "routine"
  | "favorites"
  | "medical"
  | "notes";

export interface BasicsData {
  name: string;
  breed?: string;
  ageValue: number;
  ageUnit: "years" | "months";
  photoId?: string;
}

export interface CatProfile {
  id: string;
  completedSteps: WizardStep[];
  basics?: BasicsData;
  createdAt: number;
  updatedAt: number;
}

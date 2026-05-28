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

export interface FoodEntry {
  brand: string;
  flavor: string;
  texture: string;
}

export interface SupplementEntry {
  brand: string;
  flavor: string;
}

export interface FeedingData {
  foodEntries: FoodEntry[];
  servingGrams: number;
  feedingTimes: string[];
  supplementEntries: SupplementEntry[];
  platingInstructions: string;
  platingPhotoId?: string;
  dietaryNotes?: string;
}

export interface ActivitySlot {
  label: string;
  durationHours: number;
}

export interface RoutineData {
  slots: ActivitySlot[];
}

export interface CatProfile {
  id: string;
  completedSteps: WizardStep[];
  basics?: BasicsData;
  feeding?: FeedingData;
  routine?: RoutineData;
  createdAt: number;
  updatedAt: number;
}

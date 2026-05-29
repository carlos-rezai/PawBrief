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

export interface ToyEntry {
  name: string;
  description?: string;
}

export interface TreatEntry {
  brand: string;
  flavor: string;
}

export interface FavoritesData {
  toyEntries: ToyEntry[];
  treatEntries: TreatEntry[];
  comfortItems: string[];
  favouriteSpots: string[];
}

export interface VetInfo {
  name: string;
  clinicName: string;
  phone: string;
  address: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

export interface MedicalData {
  vet: VetInfo;
  emergencyContacts: EmergencyContact[];
  medications: Medication[];
  allergies?: string;
  medicalConditions?: string;
}

export interface SpecialNote {
  title: string;
  body: string;
  photoId?: string;
}

export interface NotesData {
  specialNotes: SpecialNote[];
}

export interface CatProfile {
  id: string;
  completedSteps: WizardStep[];
  basics?: BasicsData;
  feeding?: FeedingData;
  routine?: RoutineData;
  favorites?: FavoritesData;
  medical?: MedicalData;
  notes?: NotesData;
  createdAt: number;
  updatedAt: number;
}

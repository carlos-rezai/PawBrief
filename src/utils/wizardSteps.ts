import type { WizardStep } from "../types/profile";

export const STEP_ORDER: WizardStep[] = [
  "basics",
  "feeding",
  "routine",
  "favorites",
  "medical",
  "notes",
];

export const STEP_LABELS: Record<WizardStep, string> = {
  basics: "Basics",
  feeding: "Feeding",
  routine: "Routine",
  favorites: "Favourites",
  medical: "Medical",
  notes: "Notes",
};

export const STEP_SUBTITLES: Record<WizardStep, string> = {
  basics: "Who are we caring for?",
  feeding: "What and when they eat.",
  routine: "How they spend a typical day.",
  favorites: "What makes them happy.",
  medical: "Just in case.",
  notes: "Anything else worth knowing.",
};

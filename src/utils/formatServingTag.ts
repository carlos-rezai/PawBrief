import type { ServingEntry } from "../types/profile";

export function formatServingTag(serving: ServingEntry): string {
  return `${serving.time} · ${serving.grams}g`;
}

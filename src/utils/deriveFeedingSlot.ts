import type { ActivitySlot } from "../types/profile";

export function deriveFeedingSlot(feedingTimes: string[]): ActivitySlot {
  return {
    label: "Feeding",
    durationHours: feedingTimes.length > 0 ? feedingTimes.length : 1,
  };
}

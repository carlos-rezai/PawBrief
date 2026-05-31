import type { ActivitySlot } from "../types/profile";

export function deriveFeedingSlot(feedingTimes: string[]): ActivitySlot {
  return {
    label: "Feeding",
    start: feedingTimes[0] ?? "07:30",
    hours: feedingTimes.length > 0 ? feedingTimes.length : 1,
    colorIndex: 0,
  };
}

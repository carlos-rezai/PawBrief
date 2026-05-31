import { routinePalette } from "../../tokens";
import { arcPath } from "../../utils/routineChartArcs";

interface ActivitySlot {
  label: string;
  start: string;
  hours: number;
  colorIndex: number;
}

interface RoutineChartProps {
  slots: ActivitySlot[];
  size: number;
}

export default function RoutineChart({ slots, size }: RoutineChartProps) {
  const strokeWidth = size * 0.08;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slots
        .filter((slot) => slot.hours > 0)
        .map((slot, i) => (
          <path
            key={i}
            d={arcPath(slot.start, slot.hours, size)}
            stroke={routinePalette[slot.colorIndex % routinePalette.length]}
            strokeWidth={strokeWidth}
            fill="none"
          />
        ))}
    </svg>
  );
}

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
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.13;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {/* background track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#E0D2BC"
        strokeWidth={strokeWidth}
      />
      {slots
        .filter((slot) => slot.hours > 0)
        .map((slot, i) => (
          <path
            key={i}
            d={arcPath(slot.start, slot.hours, size)}
            stroke={routinePalette[slot.colorIndex % routinePalette.length]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        ))}
    </svg>
  );
}

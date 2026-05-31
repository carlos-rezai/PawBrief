import { useTheme } from "styled-components";
import { routinePalette } from "../../tokens";
import { arcPath } from "../../utils/routineChartArcs";
import {
  ChartInner,
  ChartOuter,
  ClockLabel,
  DayCentreContainer,
  DayLabel,
} from "./RoutineChart.styles";

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

const PAD = 20;

export default function RoutineChart({ slots, size }: RoutineChartProps) {
  const theme = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.13;

  return (
    <ChartOuter style={{ width: size + PAD * 2, height: size }}>
      <ChartInner style={{ left: PAD, width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={theme.colors.surfaceAlt}
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
                strokeLinecap="butt"
                fill="none"
              />
            ))}
        </svg>
        <ClockLabel style={{ top: 0, left: 0, right: 0, textAlign: "center" }}>
          00:00
        </ClockLabel>
        <ClockLabel
          style={{ bottom: 0, left: 0, right: 0, textAlign: "center" }}
        >
          12:00
        </ClockLabel>
        <DayCentreContainer>
          <DayLabel>A Day</DayLabel>
        </DayCentreContainer>
      </ChartInner>
      <ClockLabel
        style={{ right: 0, top: "50%", transform: "translateY(-50%)" }}
      >
        06:00
      </ClockLabel>
      <ClockLabel
        style={{ left: 0, top: "50%", transform: "translateY(-50%)" }}
      >
        18:00
      </ClockLabel>
    </ChartOuter>
  );
}

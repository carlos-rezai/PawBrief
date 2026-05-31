import { useTheme } from "styled-components";
import { routinePalette } from "../../tokens";
import { arcPath } from "../../utils/routineChartArcs";
import {
  ChartInner,
  ChartOuter,
  ClockLabelBottom,
  ClockLabelLeft,
  ClockLabelRight,
  ClockLabelTop,
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
    <ChartOuter $width={size + PAD * 2} $height={size}>
      <ChartInner $left={PAD} $size={size}>
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
        <ClockLabelTop>00:00</ClockLabelTop>
        <ClockLabelBottom>12:00</ClockLabelBottom>
        <DayCentreContainer>
          <DayLabel>A Day</DayLabel>
        </DayCentreContainer>
      </ChartInner>
      <ClockLabelRight>06:00</ClockLabelRight>
      <ClockLabelLeft>18:00</ClockLabelLeft>
    </ChartOuter>
  );
}

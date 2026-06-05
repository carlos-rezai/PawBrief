import { View, Text, Svg, Circle, Path } from "@react-pdf/renderer";
import type { ActivitySlot } from "../../types/profile";
import { arcPath } from "../../utils/routineChartArcs";
import { colors, palette } from "./pdfTokens";

interface RoutineClockProps {
  slots: ActivitySlot[];
  size?: number;
}

export function RoutineClock({ slots, size = 188 }: RoutineClockProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.12;
  const fontSize = Math.max(7, Math.round(size * 0.05));

  const labelBase = {
    position: "absolute" as const,
    fontSize,
    fontWeight: 700,
    color: colors.muted,
  };

  return (
    <View style={{ position: "relative", width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
        />
        {slots
          .filter((s) => s.hours > 0)
          .map((slot, i) => (
            <Path
              key={i}
              d={arcPath(slot.start, slot.hours, size)}
              fill="none"
              stroke={palette[slot.colorIndex % palette.length]}
              strokeWidth={strokeWidth}
            />
          ))}
      </Svg>
      <Text
        style={{ ...labelBase, top: 2, left: 0, right: 0, textAlign: "center" }}
      >
        00:00
      </Text>
      <Text
        style={{
          ...labelBase,
          bottom: 2,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        12:00
      </Text>
      <Text style={{ ...labelBase, top: cy - fontSize, right: 2 }}>06:00</Text>
      <Text style={{ ...labelBase, top: cy - fontSize, left: 2 }}>18:00</Text>
      <Text
        style={{
          ...labelBase,
          top: cy - fontSize / 2,
          left: 0,
          right: 0,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        A DAY
      </Text>
    </View>
  );
}

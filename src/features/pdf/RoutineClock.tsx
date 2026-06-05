import { View, Text, Svg, Circle } from "@react-pdf/renderer";
import type React from "react";
import type { ActivitySlot } from "../../types/profile";
import { colors, palette } from "./pdfTokens";

interface RoutineClockProps {
  slots: ActivitySlot[];
  size?: number;
}

// react-pdf v4 types omit strokeDasharray/strokeDashoffset — extend locally
const DashedCircle = Circle as React.ComponentType<
  React.ComponentProps<typeof Circle> & {
    strokeDasharray?: string;
    strokeDashoffset?: string | number;
  }
>;

export function RoutineClock({ slots, size = 140 }: RoutineClockProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.12;
  const circumference = 2 * Math.PI * r;
  const fontSize = Math.max(6, Math.round(size * 0.05));

  const labelBase = {
    position: "absolute" as const,
    fontSize,
    fontWeight: 700,
    color: colors.muted,
  };

  return (
    <View style={{ position: "relative", width: size, height: size }}>
      <Svg width={size} height={size}>
        {/*
         * Arcs are drawn FIRST so they appear behind the track in react-pdf's
         * reversed SVG z-order (later elements paint below earlier ones in v4).
         *
         * strokeDasharray/strokeDashoffset on Circle simulates arcs.
         * SVG circle path starts at 3 o'clock = 06:00 on the 24h clock face,
         * going clockwise. The correct offset formula:
         *   P   = clockwise distance from 06:00 to the slot start
         *   offset = circumference - P
         * (Positive strokeDashoffset shifts the dash pattern forward, so to
         * place the dash at path position P we need offset = C - P.)
         */}
        {slots
          .filter((s) => s.hours > 0 && s.start != null)
          .map((slot, i) => {
            const [h, m] = slot.start.split(":").map(Number);
            const minutesFrom6am = (h * 60 + m - 6 * 60 + 24 * 60) % (24 * 60);
            const P = (minutesFrom6am / (24 * 60)) * circumference;
            const offset = circumference - P;
            const arcLen = (slot.hours / 24) * circumference;
            return (
              <DashedCircle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={palette[slot.colorIndex % palette.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                strokeDashoffset={offset}
              />
            );
          })}
        {/* Track ring drawn last = renders on top of arcs in react-pdf v4 */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
        />
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

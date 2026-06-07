import { View, Text, Svg, Circle, Path } from "@react-pdf/renderer";
import type { ActivitySlot } from "../../types/profile";
import { colors, palette } from "./pdfTokens";
import { arcPath } from "../../utils/routineChartArcs";

interface RoutineClockProps {
  slots: ActivitySlot[];
  size?: number;
}

/**
 * 24-hour radial routine clock. Midnight (00:00) at the top, clockwise
 * (06:00 right, 12:00 bottom, 18:00 left). Each activity is an arc drawn from
 * its start time across its duration, so a midnight-spanning slot
 * (e.g. sleep 22:30→07:00) renders as one continuous arc over the top.
 *
 * Arcs are drawn via the shared `arcPath()` util, which approximates the arc
 * with cubic Béziers — react-pdf v4 does NOT reliably render the SVG `A` arc
 * command, so we must avoid it (the same reason the wizard chart uses arcPath).
 * Geometry (r = size*0.38, strokeWidth = size*0.13) matches arcPath and the
 * on-screen RoutineChart so the arcs sit exactly on the track ring.
 */
export function RoutineClock({ slots, size = 140 }: RoutineClockProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.13;
  const pad = Math.round(size * 0.14); // side room so the L/R labels clear the ring
  const vpad = Math.round(size * 0.09); // top/bottom room so those labels clear too
  const fontSize = Math.max(6, Math.round(size * 0.05));

  const segments = slots
    .filter((s) => Number(s.hours) > 0 && s.start != null)
    .map((s) => ({
      d: arcPath(s.start, Number(s.hours), size),
      color: palette[s.colorIndex % palette.length],
    }));

  const labelBase = {
    position: "absolute" as const,
    fontFamily: "Plus Jakarta Sans",
    fontSize,
    fontWeight: 700,
    color: colors.muted,
  };

  return (
    <View
      style={{
        position: "relative",
        width: size + pad * 2,
        height: size + vpad * 2,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: pad,
          top: vpad,
          width: size,
          height: size,
        }}
      >
        <Svg width={size} height={size}>
          {/* Track ring (drawn first, behind the arcs) */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={colors.surfaceAlt}
            strokeWidth={strokeWidth}
          />
          {/* Activity arcs, painted on top of the track */}
          {segments.map((s, i) => (
            <Path
              key={i}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
            />
          ))}
        </Svg>

        {/* Centre label */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: Math.max(6, Math.round(size * 0.052)),
              fontWeight: 700,
              letterSpacing: 1,
              color: colors.muted,
            }}
          >
            A DAY
          </Text>
        </View>
      </View>

      {/* Hour labels live in the outer padding so they clear the ring */}
      <Text
        style={{ ...labelBase, top: 0, left: 0, right: 0, textAlign: "center" }}
      >
        00:00
      </Text>
      <Text
        style={{
          ...labelBase,
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        12:00
      </Text>
      <Text style={{ ...labelBase, right: 0, top: vpad + cy - fontSize / 2 }}>
        06:00
      </Text>
      <Text style={{ ...labelBase, left: 0, top: vpad + cy - fontSize / 2 }}>
        18:00
      </Text>
    </View>
  );
}

import { View, Text, Svg, Circle, Path } from "@react-pdf/renderer";
import type { ActivitySlot } from "../../types/profile";
import { colors, palette } from "./pdfTokens";

interface RoutineClockProps {
  slots: ActivitySlot[];
  size?: number;
}

// "HH:MM" → fractional hours (e.g. "07:30" → 7.5).
function parseTime(str: string): number {
  if (!str) return 0;
  const [h, m] = str.split(":").map(Number);
  return (h || 0) + (m || 0) / 60;
}

/**
 * 24-hour radial routine clock. Midnight (00:00) at the top, clockwise
 * (06:00 right, 12:00 bottom, 18:00 left). Each activity is an arc drawn from
 * its start time across its duration, so a midnight-spanning slot
 * (e.g. sleep 22:30→07:00) renders as one continuous arc over the top.
 *
 * Built with real SVG <Path> arcs — the handoff approach (react-pdf-mapping.md).
 * The earlier strokeDasharray-on-<Circle> trick did not paint in @react-pdf
 * and left the clock blank.
 */
export function RoutineClock({ slots, size = 140 }: RoutineClockProps) {
  const cx = size / 2;
  const cy = size / 2;
  const thickness = Math.round(size * 0.12);
  const margin = Math.round(size * 0.1); // ring inset from the svg box
  const r = size / 2 - margin - thickness / 2;
  const pad = Math.round(size * 0.12); // outer room so side labels clear the ring
  const fontSize = Math.max(6, Math.round(size * 0.05));

  // point on the ring for a given time (hours 0–24), midnight at top, clockwise
  const pt = (t: number): [number, number] => {
    const th = (t / 24) * 2 * Math.PI;
    return [cx + r * Math.sin(th), cy - r * Math.cos(th)];
  };
  // arc path from t1 to t2 (clockwise, sweep-flag = 1)
  const arc = (t1: number, t2: number): string => {
    const [x1, y1] = pt(t1);
    const [x2, y2] = pt(t2);
    const span = (((t2 - t1) % 24) + 24) % 24;
    const large = span > 12 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const segments = slots
    .filter((s) => Number(s.hours) > 0 && s.start != null)
    .map((s) => ({
      d: arc(parseTime(s.start), parseTime(s.start) + Number(s.hours)),
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
    <View style={{ position: "relative", width: size + pad * 2, height: size }}>
      <View
        style={{
          position: "absolute",
          left: pad,
          top: 0,
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
            strokeWidth={thickness}
          />
          {/* Activity arcs, painted on top of the track */}
          {segments.map((s, i) => (
            <Path
              key={i}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
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

        {/* Top / bottom hour labels */}
        <Text
          style={{
            ...labelBase,
            top: 0,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
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
      </View>

      {/* Side hour labels live in the outer padding so they clear the ring */}
      <Text style={{ ...labelBase, right: 0, top: cy - fontSize / 2 }}>
        06:00
      </Text>
      <Text style={{ ...labelBase, left: 0, top: cy - fontSize / 2 }}>
        18:00
      </Text>
    </View>
  );
}

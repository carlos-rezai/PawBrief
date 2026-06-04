import { Svg, Path, Circle, Ellipse, G } from "@react-pdf/renderer";
import { colors } from "./pdfTokens";

interface PawBriefMarkProps {
  size?: number;
  reverse?: boolean;
}

export function PawBriefMark({
  size = 40,
  reverse = false,
}: PawBriefMarkProps) {
  const tile = reverse ? colors.surface : colors.primary;
  const ink = reverse ? colors.primary : colors.surface;

  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {/* document body with clipped top-right fold */}
      <Path
        d="M7 4.5 H26 L33 11.5 V35.5 a1.5 1.5 0 0 1 -1.5 1.5 H8.5 a1.5 1.5 0 0 1 -1.5 -1.5 V6 a1.5 1.5 0 0 1 1.5 -1.5 Z"
        fill={tile}
      />
      {/* folded corner */}
      <Path
        d="M26 4.5 V10 a1.5 1.5 0 0 0 1.5 1.5 H33 Z"
        fill={ink}
        fillOpacity={0.35}
      />
      {/* paw print */}
      <G fill={ink}>
        <Circle cx={14.7} cy={21} r={1.8} />
        <Circle cx={20} cy={19} r={1.9} />
        <Circle cx={25.3} cy={21} r={1.8} />
        <Ellipse cx={20} cy={26.3} rx={4.4} ry={3.4} />
      </G>
    </Svg>
  );
}

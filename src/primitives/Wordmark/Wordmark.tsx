import { colors } from "../../tokens/colors";

type WordmarkProps = {
  size?: number;
};

const VIEW_W = 152;
const VIEW_H = 40;

export default function Wordmark({ size = VIEW_H }: WordmarkProps) {
  const width = (size / VIEW_H) * VIEW_W;
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="PawBrief wordmark"
      style={{ display: "block" }}
    >
      <path
        d="M7 4.5 H26 L33 11.5 V35.5 a1.5 1.5 0 0 1 -1.5 1.5 H8.5 a1.5 1.5 0 0 1 -1.5 -1.5 V6 a1.5 1.5 0 0 1 1.5 -1.5 Z"
        fill={colors.primary}
      />
      <path
        d="M26 4.5 V10 a1.5 1.5 0 0 0 1.5 1.5 H33 Z"
        fill={colors.surface}
        opacity="0.35"
      />
      <g fill={colors.surface}>
        <circle cx="14.7" cy="21" r="1.8" />
        <circle cx="20" cy="19" r="1.9" />
        <circle cx="25.3" cy="21" r="1.8" />
        <ellipse cx="20" cy="26.3" rx="4.4" ry="3.4" />
      </g>
      <text
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="700"
        fontSize="23"
        letterSpacing="-0.5"
      >
        <tspan x="48" y="29" fill={colors.ink}>
          Paw
        </tspan>
        <tspan fill={colors.primary}>Brief</tspan>
      </text>
    </svg>
  );
}

interface IconProps {
  size?: number;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  style: { display: "block", pointerEvents: "none" } as React.CSSProperties,
};

export function IconArrowLeft({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth="2"
    >
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}

export function IconArrowRight({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth="2"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export function IconMerge({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      strokeWidth="1.8"
    >
      <path d="M4 3v3a4 4 0 0 0 4 4h6M4 15v-3a4 4 0 0 1 4-4M12 7l3 3-3 3" />
    </svg>
  );
}

export function IconEdit({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth="1.7"
    >
      <path d="M11 2.5l2.5 2.5M9 4.5L3 10.5V13h2.5l6-6" />
    </svg>
  );
}

export function IconTrash({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth="1.6"
    >
      <path d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.5 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-9" />
    </svg>
  );
}

export function IconCheck({ size = 14 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      strokeWidth="2.2"
    >
      <path d="M2.5 7.5l3 3 6-7" />
    </svg>
  );
}

export function IconPlus({ size = 16 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth="2"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function IconX({ size = 12 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      strokeWidth="2"
    >
      <path d="M2 2l8 8M10 2L2 10" />
    </svg>
  );
}

export function IconPhoto({ size = 22 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="1.6"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M21 16l-4.5-4.5L9 19" />
    </svg>
  );
}

export function IconCamera({ size = 22 }: IconProps) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="1.8"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

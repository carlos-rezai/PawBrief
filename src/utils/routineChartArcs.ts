// Converts a clock-face activity slot into a cubic Bézier path string.
// Uses Bézier approximation instead of SVG arc commands because react-pdf
// v4 does not reliably render the `A` arc command in Path elements.
export function arcPath(start: string, hours: number, size: number): string {
  if (hours === 0) return "";

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const [startHour, startMin] = start.split(":").map(Number);
  const startFraction = (startHour + startMin / 60) / 24;
  const endFraction = startFraction + hours / 24;

  // Clock fractions → screen angles (x right, y down).
  // Clock: 0 = top, clockwise → screen angle = -π/2 + fraction * 2π
  const toAngle = (f: number) => -Math.PI / 2 + f * 2 * Math.PI;
  const a0 = toAngle(startFraction);
  const a1 = toAngle(endFraction); // may exceed 2π for midnight-crossing slots

  const delta = a1 - a0; // always positive (clockwise sweep)

  // Split into ≤90° segments for accurate cubic Bézier approximation
  const numSegs = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const segDelta = delta / numSegs;

  const fmt = (n: number) => n.toFixed(3);
  let d = "";

  for (let i = 0; i < numSegs; i++) {
    const sa = a0 + i * segDelta;
    const ea = a0 + (i + 1) * segDelta;

    // Control-point factor for this segment's arc angle
    const alpha = (4 / 3) * Math.tan(segDelta / 4);

    const sx = cx + r * Math.cos(sa);
    const sy = cy + r * Math.sin(sa);
    const ex = cx + r * Math.cos(ea);
    const ey = cy + r * Math.sin(ea);
    const cp1x = sx - alpha * r * Math.sin(sa);
    const cp1y = sy + alpha * r * Math.cos(sa);
    const cp2x = ex + alpha * r * Math.sin(ea);
    const cp2y = ey - alpha * r * Math.cos(ea);

    if (i === 0) d += `M ${fmt(sx)} ${fmt(sy)} `;
    d += `C ${fmt(cp1x)} ${fmt(cp1y)} ${fmt(cp2x)} ${fmt(cp2y)} ${fmt(ex)} ${fmt(ey)} `;
  }

  return d.trim();
}

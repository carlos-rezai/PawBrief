export function arcPath(start: string, hours: number, size: number): string {
  if (hours === 0) return "";

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const [startHour, startMin] = start.split(":").map(Number);
  const startFraction = (startHour + startMin / 60) / 24;
  const endFraction = startFraction + hours / 24;

  const toRad = (fraction: number) => fraction * 2 * Math.PI;

  const startX = cx + r * Math.sin(toRad(startFraction));
  const startY = cy - r * Math.cos(toRad(startFraction));
  const endX = cx + r * Math.sin(toRad(endFraction));
  const endY = cy - r * Math.cos(toRad(endFraction));

  const largeArc = hours > 12 ? 1 : 0;

  return `M ${startX.toFixed(4)} ${startY.toFixed(4)} A ${r.toFixed(4)} ${r.toFixed(4)} 0 ${largeArc} 1 ${endX.toFixed(4)} ${endY.toFixed(4)}`;
}

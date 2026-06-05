export function formatRange(start: string, hours: number): string {
  const [startHour, startMin] = start.split(":").map(Number);
  const totalMins = startHour * 60 + startMin + Math.round(hours * 60);
  const endHour = Math.floor(totalMins / 60) % 24;
  const endMin = totalMins % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(startHour)}:${pad(startMin)}–${pad(endHour)}:${pad(endMin)}`;
}

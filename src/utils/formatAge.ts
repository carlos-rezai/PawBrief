export function formatAge(value: number, unit: "years" | "months"): string {
  if (unit === "years") {
    return value === 1 ? "1 year" : `${value} years`;
  }
  return value === 1 ? "1 month" : `${value} months`;
}

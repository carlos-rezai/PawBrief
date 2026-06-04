export function isSharedVet(
  a: { name: string; phone: string },
  b: { name: string; phone: string }
): boolean {
  return a.name === b.name && a.phone === b.phone;
}

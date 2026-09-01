function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

const START_COLOR = hexToRgb("#8b2fd6");
const END_COLOR = hexToRgb("#ef4444");

export function getCapacityColor(ratioPercent: number): string {
  const t = Math.min(100, Math.max(0, ratioPercent)) / 100;
  const r = lerp(START_COLOR[0], END_COLOR[0], t);
  const g = lerp(START_COLOR[1], END_COLOR[1], t);
  const b = lerp(START_COLOR[2], END_COLOR[2], t);
  return `rgb(${r}, ${g}, ${b})`;
}

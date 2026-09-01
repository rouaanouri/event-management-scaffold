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

function lerpColor(from: [number, number, number], to: [number, number, number], t: number): string {
  return `rgb(${lerp(from[0], to[0], t)}, ${lerp(from[1], to[1], t)}, ${lerp(from[2], to[2], t)})`;
}

const STOPS: [number, [number, number, number]][] = [
  [0, hexToRgb("#8b2fd6")],
  [45, hexToRgb("#eab308")],
  [75, hexToRgb("#f97316")],
  [100, hexToRgb("#ef4444")],
];

export function getCapacityColor(ratioPercent: number): string {
  const ratio = Math.min(100, Math.max(0, ratioPercent));

  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const [fromRatio, fromColor] = STOPS[i];
    const [toRatio, toColor] = STOPS[i + 1];
    if (ratio >= fromRatio && ratio <= toRatio) {
      const t = toRatio === fromRatio ? 0 : (ratio - fromRatio) / (toRatio - fromRatio);
      return lerpColor(fromColor, toColor, t);
    }
  }

  return lerpColor(STOPS[STOPS.length - 1][1], STOPS[STOPS.length - 1][1], 0);
}

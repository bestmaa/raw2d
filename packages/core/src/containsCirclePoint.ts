import type { ContainsCirclePointOptions } from "./containsCirclePoint.type.js";

export function containsCirclePoint(options: ContainsCirclePointOptions): boolean {
  const { circle, point } = options;
  return point.x * point.x + point.y * point.y <= circle.radius * circle.radius;
}

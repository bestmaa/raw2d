import type { ContainsEllipsePointOptions } from "./containsEllipsePoint.type.js";

export function containsEllipsePoint(options: ContainsEllipsePointOptions): boolean {
  const { ellipse, point } = options;

  if (ellipse.radiusX === 0 || ellipse.radiusY === 0) {
    return false;
  }

  const normalizedX = point.x / ellipse.radiusX;
  const normalizedY = point.y / ellipse.radiusY;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

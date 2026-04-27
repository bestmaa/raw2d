import type { ContainsPolygonPointOptions } from "./containsPolygonPoint.type.js";

export function containsPolygonPoint(options: ContainsPolygonPointOptions): boolean {
  const { point, polygon } = options;
  let inside = false;

  for (let index = 0, previous = polygon.points.length - 1; index < polygon.points.length; previous = index, index += 1) {
    const currentPoint = polygon.points[index];
    const previousPoint = polygon.points[previous];
    const crossesY = currentPoint.y > point.y !== previousPoint.y > point.y;

    if (!crossesY) {
      continue;
    }

    const slopeX = ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) / (previousPoint.y - currentPoint.y) + currentPoint.x;

    if (point.x < slopeX) {
      inside = !inside;
    }
  }

  return inside;
}

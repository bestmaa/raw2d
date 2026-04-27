import { getSegmentDistance } from "./containsLinePoint.js";
import type { ContainsPolylinePointOptions } from "./containsPolylinePoint.type.js";

export function containsPolylinePoint(options: ContainsPolylinePointOptions): boolean {
  const tolerance = options.tolerance ?? Math.max(1, options.polyline.material.lineWidth / 2);

  for (let index = 1; index < options.polyline.points.length; index += 1) {
    const start = options.polyline.points[index - 1];
    const end = options.polyline.points[index];

    if (getSegmentDistance(options.point, start, end) <= tolerance) {
      return true;
    }
  }

  return false;
}

import type { HitTestPoint } from "./HitTest.type.js";
import type { ContainsLinePointOptions } from "./containsLinePoint.type.js";

export function containsLinePoint(options: ContainsLinePointOptions): boolean {
  const tolerance = options.tolerance ?? Math.max(1, options.line.material.lineWidth / 2);
  const distance = getSegmentDistance(options.point, { x: options.line.startX, y: options.line.startY }, { x: options.line.endX, y: options.line.endY });
  return distance <= tolerance;
}

export function getSegmentDistance(point: HitTestPoint, start: HitTestPoint, end: HitTestPoint): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const closestX = start.x + dx * t;
  const closestY = start.y + dy * t;
  return Math.hypot(point.x - closestX, point.y - closestY);
}

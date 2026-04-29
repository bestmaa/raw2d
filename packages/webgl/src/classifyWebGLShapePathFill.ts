import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";
import type { WebGLShapePathFillSubpath, WebGLShapePathFillSupport } from "./WebGLShapePathFillSupport.type.js";

const epsilon = 1e-8;

export function classifyWebGLShapePathFill(subpaths: readonly WebGLShapePathFillSubpath[], fill: boolean): WebGLShapePathFillSupport {
  if (!fill) {
    return createResult(false, "disabled");
  }

  if (subpaths.length === 0) {
    return createResult(false, "empty");
  }

  if (subpaths.some((subpath) => !subpath.closed)) {
    return createResult(false, "open-subpath");
  }

  if (subpaths.length !== 1) {
    return createResult(false, "multiple-subpaths");
  }

  const points = normalizePoints(subpaths[0].points);

  if (points.length < 3) {
    return createResult(false, "degenerate");
  }

  if (hasSelfIntersection(points)) {
    return createResult(false, "self-intersection");
  }

  if (Math.abs(getSignedArea(points)) <= epsilon) {
    return createResult(false, "degenerate");
  }

  return { supported: true, reason: "simple", points };
}

function createResult(supported: boolean, reason: WebGLShapePathFillSupport["reason"]): WebGLShapePathFillSupport {
  return { supported, reason, points: [] };
}

function normalizePoints(points: readonly WebGLLocalPoint[]): readonly WebGLLocalPoint[] {
  const normalized = points.map((point) => ({ x: point.x, y: point.y }));
  const first = normalized[0];
  const last = normalized.at(-1);

  if (first && last && areSamePoint(first, last)) {
    normalized.pop();
  }

  return normalized;
}

function hasSelfIntersection(points: readonly WebGLLocalPoint[]): boolean {
  for (let aIndex = 0; aIndex < points.length; aIndex += 1) {
    const aStart = points[aIndex];
    const aEnd = points[(aIndex + 1) % points.length];

    for (let bIndex = aIndex + 1; bIndex < points.length; bIndex += 1) {
      if (areAdjacentEdges(aIndex, bIndex, points.length)) {
        continue;
      }

      const bStart = points[bIndex];
      const bEnd = points[(bIndex + 1) % points.length];

      if (segmentsIntersect(aStart, aEnd, bStart, bEnd)) {
        return true;
      }
    }
  }

  return false;
}

function areAdjacentEdges(aIndex: number, bIndex: number, count: number): boolean {
  return Math.abs(aIndex - bIndex) === 1 || (aIndex === 0 && bIndex === count - 1);
}

function segmentsIntersect(a: WebGLLocalPoint, b: WebGLLocalPoint, c: WebGLLocalPoint, d: WebGLLocalPoint): boolean {
  const abC = getOrientation(a, b, c);
  const abD = getOrientation(a, b, d);
  const cdA = getOrientation(c, d, a);
  const cdB = getOrientation(c, d, b);

  if (abC !== abD && cdA !== cdB) {
    return true;
  }

  return (
    (abC === 0 && isPointOnSegment(c, a, b)) ||
    (abD === 0 && isPointOnSegment(d, a, b)) ||
    (cdA === 0 && isPointOnSegment(a, c, d)) ||
    (cdB === 0 && isPointOnSegment(b, c, d))
  );
}

function getOrientation(a: WebGLLocalPoint, b: WebGLLocalPoint, c: WebGLLocalPoint): -1 | 0 | 1 {
  const cross = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);

  if (Math.abs(cross) <= epsilon) {
    return 0;
  }

  return cross > 0 ? 1 : -1;
}

function isPointOnSegment(point: WebGLLocalPoint, start: WebGLLocalPoint, end: WebGLLocalPoint): boolean {
  return (
    point.x <= Math.max(start.x, end.x) + epsilon &&
    point.x >= Math.min(start.x, end.x) - epsilon &&
    point.y <= Math.max(start.y, end.y) + epsilon &&
    point.y >= Math.min(start.y, end.y) - epsilon
  );
}

function areSamePoint(a: WebGLLocalPoint, b: WebGLLocalPoint): boolean {
  return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
}

function getSignedArea(points: readonly WebGLLocalPoint[]): number {
  let area = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }

  return area / 2;
}

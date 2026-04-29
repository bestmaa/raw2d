import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";
import type { WebGLResolvedStrokeStyle, WebGLStrokeSegment, WebGLStrokeStyleOptions } from "./WebGLStrokeGeometry.type.js";

export const webGLRoundStrokeSegments = 8;

export function getStrokeStyle(options: WebGLStrokeStyleOptions): WebGLResolvedStrokeStyle {
  return {
    lineWidth: Math.max(0, options.lineWidth),
    strokeCap: options.strokeCap ?? "butt",
    strokeJoin: options.strokeJoin ?? "miter",
    miterLimit: Math.max(1, options.miterLimit ?? 10)
  };
}

export function getStrokeSegments(points: readonly WebGLLocalPoint[], style: WebGLResolvedStrokeStyle): readonly WebGLStrokeSegment[] {
  const segments: WebGLStrokeSegment[] = [];

  if (style.lineWidth <= 0) {
    return segments;
  }

  for (let index = 1; index < points.length; index += 1) {
    const segment = getStrokeSegment(points[index - 1], points[index], style);

    if (segment) {
      segments.push(segment);
    }
  }

  return segments;
}

export function getStrokeSegment(
  start: WebGLLocalPoint,
  end: WebGLLocalPoint,
  style: WebGLResolvedStrokeStyle
): WebGLStrokeSegment | null {
  const length = getPointLength(start, end);

  if (length <= 0 || style.lineWidth <= 0) {
    return null;
  }

  const halfWidth = style.lineWidth / 2;
  const dx = (end.x - start.x) / length;
  const dy = (end.y - start.y) / length;
  return { start, end, dx, dy, normalX: -dy * halfWidth, normalY: dx * halfWidth };
}

export function offsetStrokePoint(point: WebGLLocalPoint, segment: WebGLStrokeSegment, side: number): WebGLLocalPoint {
  return { x: point.x + segment.normalX * side, y: point.y + segment.normalY * side };
}

export function extendStrokePoint(point: WebGLLocalPoint, segment: WebGLStrokeSegment, amount: number): WebGLLocalPoint {
  const halfWidth = Math.hypot(segment.normalX, segment.normalY);
  return { x: point.x + segment.dx * amount * halfWidth, y: point.y + segment.dy * amount * halfWidth };
}

export function getPointLength(start: WebGLLocalPoint, end: WebGLLocalPoint): number {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

export function isClosedStrokePath(points: readonly WebGLLocalPoint[]): boolean {
  const first = points[0];
  const last = points.at(-1);
  return !!first && !!last && first.x === last.x && first.y === last.y;
}

export function getStrokeArcDelta(startAngle: number, endAngle: number, side: number): number {
  let delta = endAngle - startAngle;

  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;

  if (side > 0 && delta < 0) delta += Math.PI * 2;
  if (side < 0 && delta > 0) delta -= Math.PI * 2;
  return delta;
}

export function getRoundStrokeStepCount(startAngle: number, endAngle: number): number {
  return Math.max(1, Math.ceil(Math.abs(endAngle - startAngle) / (Math.PI / webGLRoundStrokeSegments)));
}

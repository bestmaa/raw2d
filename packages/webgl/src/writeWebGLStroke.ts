import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import {
  extendStrokePoint,
  getPointLength,
  getRoundStrokeStepCount,
  getStrokeArcDelta,
  getStrokeSegment,
  getStrokeSegments,
  getStrokeStyle,
  isClosedStrokePath,
  offsetStrokePoint
} from "./WebGLStrokeGeometry.js";
import { getWebGLStrokeVertexCount } from "./getWebGLStrokeVertexCount.js";
import type { WebGLLocalPoint, WebGLStrokeWriteOptions } from "./WebGLPathGeometry.type.js";
import type { WebGLResolvedStrokeStyle, WebGLStrokeSegment } from "./WebGLStrokeGeometry.type.js";

export { getWebGLStrokeVertexCount };

export function writeWebGLStroke(
  vertices: Float32Array,
  offset: number,
  points: readonly WebGLLocalPoint[],
  options: WebGLStrokeWriteOptions
): number {
  const style = getStrokeStyle(options);
  const segments = getStrokeSegments(points, style);
  const closed = isClosedStrokePath(points);

  for (let index = 0; index < segments.length; index += 1) {
    offset = writeSegment(vertices, offset, segments[index], options, style, index === 0 && !closed, index === segments.length - 1 && !closed);
  }

  offset = writeJoins(vertices, offset, points, options, style);

  if (!closed && style.strokeCap === "round" && segments.length > 0) {
    offset = writeRoundCap(vertices, offset, segments[0], options, true);
    offset = writeRoundCap(vertices, offset, segments[segments.length - 1], options, false);
  }

  return offset;
}

function writeSegment(
  vertices: Float32Array,
  offset: number,
  segment: WebGLStrokeSegment,
  options: WebGLStrokeWriteOptions,
  style: WebGLResolvedStrokeStyle,
  first: boolean,
  last: boolean
): number {
  const start = extendStrokePoint(segment.start, segment, style.strokeCap === "square" && first ? -1 : 0);
  const end = extendStrokePoint(segment.end, segment, style.strokeCap === "square" && last ? 1 : 0);
  const points = [
    { x: start.x + segment.normalX, y: start.y + segment.normalY },
    { x: end.x + segment.normalX, y: end.y + segment.normalY },
    { x: end.x - segment.normalX, y: end.y - segment.normalY },
    { x: start.x + segment.normalX, y: start.y + segment.normalY },
    { x: end.x - segment.normalX, y: end.y - segment.normalY },
    { x: start.x - segment.normalX, y: start.y - segment.normalY }
  ];
  return writePoints(vertices, offset, points, options);
}

function writeJoins(
  vertices: Float32Array,
  offset: number,
  points: readonly WebGLLocalPoint[],
  options: WebGLStrokeWriteOptions,
  style: WebGLResolvedStrokeStyle
): number {
  for (let index = 1; index < points.length - 1; index += 1) {
    offset = writeJoin(vertices, offset, points[index - 1], points[index], points[index + 1], options, style);
  }

  if (isClosedStrokePath(points) && points.length > 3) {
    offset = writeJoin(vertices, offset, points[points.length - 2], points[0], points[1], options, style);
  }

  return offset;
}

function writeJoin(
  vertices: Float32Array,
  offset: number,
  previous: WebGLLocalPoint,
  joint: WebGLLocalPoint,
  next: WebGLLocalPoint,
  options: WebGLStrokeWriteOptions,
  style: WebGLResolvedStrokeStyle
): number {
  const previousSegment = getStrokeSegment(previous, joint, style);
  const nextSegment = getStrokeSegment(joint, next, style);

  if (!previousSegment || !nextSegment) {
    return offset;
  }

  const cross = previousSegment.dx * nextSegment.dy - previousSegment.dy * nextSegment.dx;

  if (Math.abs(cross) < 0.000001) {
    return offset;
  }

  const side = cross > 0 ? -1 : 1;
  const start = offsetStrokePoint(joint, previousSegment, side);
  const end = offsetStrokePoint(joint, nextSegment, side);

  if (style.strokeJoin === "round") {
    return writeRoundJoin(vertices, offset, joint, start, end, side, options);
  }

  if (style.strokeJoin === "miter") {
    const miter = getMiterPoint(start, previousSegment, end, nextSegment);

    if (miter && getPointLength(joint, miter) <= style.miterLimit * (style.lineWidth / 2)) {
      return writePoints(vertices, offset, [start, miter, end], options);
    }
  }

  return writePoints(vertices, offset, [joint, start, end], options);
}

function writeRoundJoin(
  vertices: Float32Array,
  offset: number,
  center: WebGLLocalPoint,
  start: WebGLLocalPoint,
  end: WebGLLocalPoint,
  side: number,
  options: WebGLStrokeWriteOptions
): number {
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const endAngle = startAngle + getStrokeArcDelta(startAngle, Math.atan2(end.y - center.y, end.x - center.x), side);
  const steps = getRoundStrokeStepCount(startAngle, endAngle);

  for (let index = 0; index < steps; index += 1) {
    const a0 = startAngle + ((endAngle - startAngle) * index) / steps;
    const a1 = startAngle + ((endAngle - startAngle) * (index + 1)) / steps;
    offset = writePoints(vertices, offset, [center, pointAtAngle(center, start, a0), pointAtAngle(center, start, a1)], options);
  }

  return offset;
}

function writeRoundCap(vertices: Float32Array, offset: number, segment: WebGLStrokeSegment, options: WebGLStrokeWriteOptions, start: boolean): number {
  const center = start ? segment.start : segment.end;
  const normalAngle = Math.atan2(segment.normalY, segment.normalX);
  const startAngle = start ? normalAngle + Math.PI : normalAngle;
  const endAngle = start ? normalAngle : normalAngle + Math.PI;

  for (let index = 0; index < 8; index += 1) {
    const a0 = startAngle + ((endAngle - startAngle) * index) / 8;
    const a1 = startAngle + ((endAngle - startAngle) * (index + 1)) / 8;
    offset = writePoints(vertices, offset, [center, pointAtRadius(center, options.lineWidth / 2, a0), pointAtRadius(center, options.lineWidth / 2, a1)], options);
  }

  return offset;
}

function writePoints(vertices: Float32Array, offset: number, points: readonly WebGLLocalPoint[], options: WebGLStrokeWriteOptions): number {
  for (const point of points) {
    const clip = toClipPoint(point.x, point.y, options.matrix, options);
    offset = writeWebGLVertex(vertices, offset, clip.x, clip.y, options.color);
  }

  return offset;
}

function getMiterPoint(start: WebGLLocalPoint, previous: WebGLStrokeSegment, end: WebGLLocalPoint, next: WebGLStrokeSegment): WebGLLocalPoint | null {
  const denominator = previous.dx * next.dy - previous.dy * next.dx;

  if (Math.abs(denominator) < 0.000001) {
    return null;
  }

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const t = (deltaX * next.dy - deltaY * next.dx) / denominator;
  return { x: start.x + previous.dx * t, y: start.y + previous.dy * t };
}

function pointAtAngle(center: WebGLLocalPoint, radiusPoint: WebGLLocalPoint, angle: number): WebGLLocalPoint {
  return pointAtRadius(center, getPointLength(center, radiusPoint), angle);
}

function pointAtRadius(center: WebGLLocalPoint, radius: number, angle: number): WebGLLocalPoint {
  return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
}

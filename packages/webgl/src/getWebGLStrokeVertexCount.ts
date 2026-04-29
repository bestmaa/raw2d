import type { WebGLLocalPoint, WebGLStrokeGeometryOptions } from "./WebGLPathGeometry.type.js";
import {
  getRoundStrokeStepCount,
  getStrokeArcDelta,
  getStrokeSegment,
  getStrokeSegments,
  getStrokeStyle,
  isClosedStrokePath,
  offsetStrokePoint,
  webGLRoundStrokeSegments
} from "./WebGLStrokeGeometry.js";
import type { WebGLResolvedStrokeStyle } from "./WebGLStrokeGeometry.type.js";

const verticesPerSegment = 6;

export function getWebGLStrokeVertexCount(points: readonly WebGLLocalPoint[], options: WebGLStrokeGeometryOptions): number {
  const style = getStrokeStyle(options);
  const segments = getStrokeSegments(points, style);

  if (segments.length === 0) {
    return 0;
  }

  return segments.length * verticesPerSegment + getCapVertexCount(points, style, segments.length) + getJoinVertexCount(points, style);
}

function getCapVertexCount(points: readonly WebGLLocalPoint[], style: WebGLResolvedStrokeStyle, segmentCount: number): number {
  return !isClosedStrokePath(points) && style.strokeCap === "round" && segmentCount > 0 ? webGLRoundStrokeSegments * 6 : 0;
}

function getJoinVertexCount(points: readonly WebGLLocalPoint[], style: WebGLResolvedStrokeStyle): number {
  let count = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    count += getOneJoinVertexCount(points[index - 1], points[index], points[index + 1], style);
  }

  if (isClosedStrokePath(points) && points.length > 3) {
    count += getOneJoinVertexCount(points[points.length - 2], points[0], points[1], style);
  }

  return count;
}

function getOneJoinVertexCount(
  previous: WebGLLocalPoint,
  joint: WebGLLocalPoint,
  next: WebGLLocalPoint,
  style: WebGLResolvedStrokeStyle
): number {
  const previousSegment = getStrokeSegment(previous, joint, style);
  const nextSegment = getStrokeSegment(joint, next, style);

  if (!previousSegment || !nextSegment || Math.abs(previousSegment.dx * nextSegment.dy - previousSegment.dy * nextSegment.dx) < 0.000001) {
    return 0;
  }

  if (style.strokeJoin !== "round") {
    return 3;
  }

  const side = previousSegment.dx * nextSegment.dy - previousSegment.dy * nextSegment.dx > 0 ? -1 : 1;
  const start = offsetStrokePoint(joint, previousSegment, side);
  const end = offsetStrokePoint(joint, nextSegment, side);
  const startAngle = Math.atan2(start.y - joint.y, start.x - joint.x);
  const endAngle = startAngle + getStrokeArcDelta(startAngle, Math.atan2(end.y - joint.y, end.x - joint.x), side);
  return getRoundStrokeStepCount(startAngle, endAngle) * 3;
}

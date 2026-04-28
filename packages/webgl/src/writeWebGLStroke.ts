import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLLocalPoint, WebGLStrokeWriteOptions } from "./WebGLPathGeometry.type.js";

const verticesPerSegment = 6;

export function getWebGLStrokeVertexCount(points: readonly WebGLLocalPoint[]): number {
  return getSegmentCount(points) * verticesPerSegment;
}

export function writeWebGLStroke(
  vertices: Float32Array,
  offset: number,
  points: readonly WebGLLocalPoint[],
  options: WebGLStrokeWriteOptions
): number {
  for (let index = 1; index < points.length; index += 1) {
    offset = writeSegment(vertices, offset, points[index - 1], points[index], options);
  }

  return offset;
}

function getSegmentCount(points: readonly WebGLLocalPoint[]): number {
  let count = 0;

  for (let index = 1; index < points.length; index += 1) {
    count += getLength(points[index - 1], points[index]) > 0 ? 1 : 0;
  }

  return count;
}

function writeSegment(
  vertices: Float32Array,
  offset: number,
  start: WebGLLocalPoint,
  end: WebGLLocalPoint,
  options: WebGLStrokeWriteOptions
): number {
  const length = getLength(start, end);

  if (length <= 0 || options.lineWidth <= 0) {
    return offset;
  }

  const halfWidth = options.lineWidth / 2;
  const normalX = (-(end.y - start.y) / length) * halfWidth;
  const normalY = ((end.x - start.x) / length) * halfWidth;
  const points = [
    { x: start.x + normalX, y: start.y + normalY },
    { x: end.x + normalX, y: end.y + normalY },
    { x: end.x - normalX, y: end.y - normalY },
    { x: start.x + normalX, y: start.y + normalY },
    { x: end.x - normalX, y: end.y - normalY },
    { x: start.x - normalX, y: start.y - normalY }
  ];

  for (const point of points) {
    const clip = toClipPoint(point.x, point.y, options.matrix, options);
    offset = writeWebGLVertex(vertices, offset, clip.x, clip.y, options.color);
  }

  return offset;
}

function getLength(start: WebGLLocalPoint, end: WebGLLocalPoint): number {
  return Math.hypot(end.x - start.x, end.y - start.y);
}


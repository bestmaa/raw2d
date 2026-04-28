import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLLocalPoint, WebGLFillWriteOptions } from "./WebGLPathGeometry.type.js";

const verticesPerTriangle = 3;

export function getWebGLPolygonFillVertexCount(points: readonly WebGLLocalPoint[]): number {
  return Math.max(0, points.length - 2) * verticesPerTriangle;
}

export function writeWebGLPolygonFill(
  vertices: Float32Array,
  offset: number,
  points: readonly WebGLLocalPoint[],
  options: WebGLFillWriteOptions
): number {
  if (points.length < 3) {
    return offset;
  }

  for (let index = 1; index < points.length - 1; index += 1) {
    offset = writePoint(vertices, offset, points[0], options);
    offset = writePoint(vertices, offset, points[index], options);
    offset = writePoint(vertices, offset, points[index + 1], options);
  }

  return offset;
}

function writePoint(
  vertices: Float32Array,
  offset: number,
  point: WebGLLocalPoint,
  options: WebGLFillWriteOptions
): number {
  const clip = toClipPoint(point.x, point.y, options.matrix, options);
  return writeWebGLVertex(vertices, offset, clip.x, clip.y, options.color);
}


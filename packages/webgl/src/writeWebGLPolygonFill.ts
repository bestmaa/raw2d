import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLLocalPoint, WebGLFillWriteOptions } from "./WebGLPathGeometry.type.js";
import { triangulateWebGLPolygon } from "./triangulateWebGLPolygon.js";

const verticesPerTriangle = 3;

export function getWebGLPolygonFillVertexCount(points: readonly WebGLLocalPoint[]): number {
  return triangulateWebGLPolygon(points).length;
}

export function writeWebGLPolygonFill(
  vertices: Float32Array,
  offset: number,
  points: readonly WebGLLocalPoint[],
  options: WebGLFillWriteOptions
): number {
  const trianglePoints = triangulateWebGLPolygon(points);

  if (trianglePoints.length < verticesPerTriangle) {
    return offset;
  }

  for (const point of trianglePoints) {
    offset = writePoint(vertices, offset, point, options);
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

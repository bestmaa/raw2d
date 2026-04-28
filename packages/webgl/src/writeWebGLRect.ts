import { Rect } from "raw2d-core";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLShapeBatchOptions, WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export const webGLRectVertexCount = 6;

export function writeWebGLRect(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
  if (!(item.object instanceof Rect)) {
    return offset;
  }

  const rect = item.object;
  const color = parseWebGLColor(rect.material.fillColor);
  const originX = rect.width * rect.originX;
  const originY = rect.height * rect.originY;
  const points: readonly (readonly [number, number])[] = [
    [-originX, -originY],
    [rect.width - originX, -originY],
    [rect.width - originX, rect.height - originY],
    [-originX, -originY],
    [rect.width - originX, rect.height - originY],
    [-originX, rect.height - originY]
  ];

  for (const point of points) {
    offset = writePoint(vertices, offset, point[0], point[1], item, options, color);
  }

  return offset;
}

function writePoint(
  vertices: Float32Array,
  offset: number,
  x: number,
  y: number,
  item: WebGLShapeItem,
  options: WebGLShapeBatchOptions,
  color: WebGLColor
): number {
  const point = toClipPoint(x, y, item.worldMatrix, options);
  return writeWebGLVertex(vertices, offset, point.x, point.y, color);
}


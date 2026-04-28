import { Circle, Ellipse } from "raw2d-core";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLShapeBatchOptions, WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLEllipseLikeVertexCount(segments: number): number {
  return segments * 3;
}

export function writeWebGLEllipseLike(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLShapeBatchOptions,
  segments: number
): number {
  const shape = item.object;

  if (!(shape instanceof Circle || shape instanceof Ellipse)) {
    return offset;
  }

  const radiusX = shape instanceof Circle ? shape.radius : shape.radiusX;
  const radiusY = shape instanceof Circle ? shape.radius : shape.radiusY;
  const color = parseWebGLColor(shape.material.fillColor);
  const centerX = radiusX - radiusX * 2 * shape.originX;
  const centerY = radiusY - radiusY * 2 * shape.originY;

  for (let index = 0; index < segments; index += 1) {
    const startAngle = (index / segments) * Math.PI * 2;
    const endAngle = ((index + 1) / segments) * Math.PI * 2;
    offset = writePoint(vertices, offset, centerX, centerY, item, options, color);
    offset = writePoint(vertices, offset, centerX + Math.cos(startAngle) * radiusX, centerY + Math.sin(startAngle) * radiusY, item, options, color);
    offset = writePoint(vertices, offset, centerX + Math.cos(endAngle) * radiusX, centerY + Math.sin(endAngle) * radiusY, item, options, color);
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


import { Circle, Ellipse, Rect } from "raw2d-core";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { toClipPoint, webGLFloatsPerVertex, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLShapeBatch, WebGLShapeBatchOptions, WebGLShapeItem } from "./WebGLShapeBatch.type.js";

const verticesPerRect = 6;
const minimumCurveSegments = 8;

export function createWebGLShapeBatch(options: WebGLShapeBatchOptions): WebGLShapeBatch {
  const shapeItems = options.items.filter(isShapeItem);
  const segments = getCurveSegments(options.curveSegments);
  const vertexCount = getVertexCount(shapeItems, segments);
  const vertices = new Float32Array(vertexCount * webGLFloatsPerVertex);
  const counts = { rects: 0, circles: 0, ellipses: 0 };
  let offset = 0;

  for (const item of shapeItems) {
    if (item.object instanceof Rect) {
      offset = writeRect(vertices, offset, item, options);
      counts.rects += 1;
    } else if (item.object instanceof Circle || item.object instanceof Ellipse) {
      offset = writeEllipseLike(vertices, offset, item, options, segments);
      counts.circles += item.object instanceof Circle ? 1 : 0;
      counts.ellipses += item.object instanceof Ellipse ? 1 : 0;
    }
  }

  return {
    vertices,
    rects: counts.rects,
    circles: counts.circles,
    ellipses: counts.ellipses,
    unsupported: options.items.length - shapeItems.length
  };
}

function isShapeItem(item: WebGLShapeBatchOptions["items"][number]): item is WebGLShapeItem {
  return item.object instanceof Rect || item.object instanceof Circle || item.object instanceof Ellipse;
}

function getCurveSegments(segments = 32): number {
  return Math.max(minimumCurveSegments, Math.floor(segments));
}

function getVertexCount(items: readonly WebGLShapeItem[], segments: number): number {
  return items.reduce((count, item) => count + (item.object instanceof Rect ? verticesPerRect : segments * 3), 0);
}

function writeRect(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
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

function writeEllipseLike(
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
    offset = writePoint(
      vertices,
      offset,
      centerX + Math.cos(startAngle) * radiusX,
      centerY + Math.sin(startAngle) * radiusY,
      item,
      options,
      color
    );
    offset = writePoint(
      vertices,
      offset,
      centerX + Math.cos(endAngle) * radiusX,
      centerY + Math.sin(endAngle) * radiusY,
      item,
      options,
      color
    );
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

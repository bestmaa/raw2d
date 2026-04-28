import { Circle, Ellipse, Line, Polygon, Polyline, Rect, getLineLocalBounds, getPolygonLocalBounds, getPolylineLocalBounds } from "raw2d-core";
import { appendWebGLDrawBatch } from "./appendWebGLDrawBatch.js";
import { getWebGLMaterialKey } from "./getWebGLMaterialKey.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { toClipPoint, webGLFloatsPerVertex, writeWebGLVertex } from "./WebGLVertex.js";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";
import type { WebGLShapeBatch, WebGLShapeBatchOptions, WebGLShapeItem } from "./WebGLShapeBatch.type.js";
import { getWebGLPolygonFillVertexCount, writeWebGLPolygonFill } from "./writeWebGLPolygonFill.js";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import type { WebGLDrawBatch } from "./WebGLDrawBatch.type.js";

const verticesPerRect = 6;
const minimumCurveSegments = 8;

export function createWebGLShapeBatch(options: WebGLShapeBatchOptions): WebGLShapeBatch {
  const shapeItems = options.items.filter(isShapeItem);
  const segments = getCurveSegments(options.curveSegments);
  const vertexCount = getVertexCount(shapeItems, segments);
  const floatCount = vertexCount * webGLFloatsPerVertex;
  const vertices = options.floatBuffer?.acquire(floatCount) ?? new Float32Array(floatCount);
  const drawBatches: WebGLDrawBatch[] = [];
  const counts = { rects: 0, circles: 0, ellipses: 0, lines: 0, polylines: 0, polygons: 0 };
  let offset = 0;

  for (const item of shapeItems) {
    const firstVertex = offset / webGLFloatsPerVertex;

    if (item.object instanceof Rect) {
      offset = writeRect(vertices, offset, item, options);
      counts.rects += 1;
    } else if (item.object instanceof Circle || item.object instanceof Ellipse) {
      offset = writeEllipseLike(vertices, offset, item, options, segments);
      counts.circles += item.object instanceof Circle ? 1 : 0;
      counts.ellipses += item.object instanceof Ellipse ? 1 : 0;
    } else if (item.object instanceof Line || item.object instanceof Polyline) {
      offset = writeStrokedPath(vertices, offset, item, options);
      counts.lines += item.object instanceof Line ? 1 : 0;
      counts.polylines += item.object instanceof Polyline ? 1 : 0;
    } else if (item.object instanceof Polygon) {
      offset = writeFilledPolygon(vertices, offset, item, options);
      counts.polygons += 1;
    }

    appendWebGLDrawBatch(drawBatches, {
      key: getWebGLMaterialKey(item),
      firstVertex,
      vertexCount: offset / webGLFloatsPerVertex - firstVertex
    });
  }

  return {
    vertices,
    drawBatches,
    rects: counts.rects,
    circles: counts.circles,
    ellipses: counts.ellipses,
    lines: counts.lines,
    polylines: counts.polylines,
    polygons: counts.polygons,
    unsupported: options.items.length - shapeItems.length
  };
}

function isShapeItem(item: WebGLShapeBatchOptions["items"][number]): item is WebGLShapeItem {
  return (
    item.object instanceof Rect ||
    item.object instanceof Circle ||
    item.object instanceof Ellipse ||
    item.object instanceof Line ||
    item.object instanceof Polyline ||
    item.object instanceof Polygon
  );
}

function getCurveSegments(segments = 32): number {
  return Math.max(minimumCurveSegments, Math.floor(segments));
}

function getVertexCount(items: readonly WebGLShapeItem[], segments: number): number {
  return items.reduce((count, item) => count + getItemVertexCount(item, segments), 0);
}

function getItemVertexCount(item: WebGLShapeItem, segments: number): number {
  if (item.object instanceof Rect) {
    return verticesPerRect;
  }

  if (item.object instanceof Circle || item.object instanceof Ellipse) {
    return segments * 3;
  }

  if (item.object instanceof Line || item.object instanceof Polyline) {
    return getWebGLStrokeVertexCount(getPathPoints(item));
  }

  return item.object instanceof Polygon ? getWebGLPolygonFillVertexCount(getPathPoints(item)) : 0;
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

function writeStrokedPath(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
  const object = item.object;

  if (!(object instanceof Line || object instanceof Polyline)) {
    return offset;
  }

  return writeWebGLStroke(vertices, offset, getPathPoints(item), {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(object.material.strokeColor),
    lineWidth: object.material.lineWidth
  });
}

function writeFilledPolygon(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
  if (!(item.object instanceof Polygon)) {
    return offset;
  }

  return writeWebGLPolygonFill(vertices, offset, getPathPoints(item), {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(item.object.material.fillColor)
  });
}

function getPathPoints(item: WebGLShapeItem): readonly WebGLLocalPoint[] {
  if (item.object instanceof Line) {
    return offsetPoints(
      [
        { x: item.object.startX, y: item.object.startY },
        { x: item.object.endX, y: item.object.endY }
      ],
      getLineLocalBounds(item.object),
      item.object.originX,
      item.object.originY
    );
  }

  if (item.object instanceof Polyline) {
    return offsetPoints(item.object.points, getPolylineLocalBounds(item.object), item.object.originX, item.object.originY);
  }

  return item.object instanceof Polygon ? offsetPoints(item.object.points, getPolygonLocalBounds(item.object), item.object.originX, item.object.originY) : [];
}

function offsetPoints(
  points: readonly WebGLLocalPoint[],
  bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number },
  originX: number,
  originY: number
): readonly WebGLLocalPoint[] {
  const offsetX = bounds.x + bounds.width * originX;
  const offsetY = bounds.y + bounds.height * originY;
  return points.map((point) => ({ x: point.x - offsetX, y: point.y - offsetY }));
}

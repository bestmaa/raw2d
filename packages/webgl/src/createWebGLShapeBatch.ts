import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, ShapePath } from "raw2d-core";
import { appendWebGLDrawBatch } from "./appendWebGLDrawBatch.js";
import { getWebGLMaterialKey, getWebGLShapePathFillMaterialKey, getWebGLShapePathStrokeMaterialKey } from "./getWebGLMaterialKey.js";
import { getWebGLPathPoints } from "./getWebGLPathPoints.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { webGLFloatsPerVertex } from "./WebGLVertex.js";
import type { WebGLShapeBatch, WebGLShapeBatchOptions, WebGLShapeItem } from "./WebGLShapeBatch.type.js";
import { getWebGLEllipseLikeVertexCount, writeWebGLEllipseLike } from "./writeWebGLEllipseLike.js";
import { getWebGLArcVertexCount, writeWebGLArc } from "./writeWebGLArc.js";
import { getWebGLPolygonFillVertexCount, writeWebGLPolygonFill } from "./writeWebGLPolygonFill.js";
import { webGLRectVertexCount, writeWebGLRect } from "./writeWebGLRect.js";
import { getWebGLShapePathFillSupport, getWebGLShapePathVertexCount, writeWebGLShapePathFill, writeWebGLShapePathStroke } from "./writeWebGLShapePath.js";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import { resolveWebGLCurveSegments } from "./resolveWebGLCurveSegments.js";
import type { WebGLDrawBatch } from "./WebGLDrawBatch.type.js";
import type { WebGLShapePathFillFallbackReport } from "./WebGLShapePathFillFallback.type.js";

export function createWebGLShapeBatch(options: WebGLShapeBatchOptions): WebGLShapeBatch {
  const shapeItems = options.items.filter(isShapeItem);
  const segments = resolveWebGLCurveSegments(options);
  const vertexCount = getVertexCount(shapeItems, segments);
  const floatCount = vertexCount * webGLFloatsPerVertex;
  const vertices = options.floatBuffer?.acquire(floatCount) ?? new Float32Array(floatCount);
  const drawBatches: WebGLDrawBatch[] = [];
  const shapePathFillFallbacks: WebGLShapePathFillFallbackReport[] = [];
  const counts = { rects: 0, arcs: 0, circles: 0, ellipses: 0, lines: 0, polylines: 0, polygons: 0, shapePaths: 0, shapePathUnsupportedFills: 0 };
  let offset = 0;

  for (const item of shapeItems) {
    const firstVertex = offset / webGLFloatsPerVertex;

    if (item.object instanceof Arc) {
      offset = writeArc(vertices, offset, item, options, segments);
      counts.arcs += 1;
    } else if (item.object instanceof Rect) {
      offset = writeWebGLRect(vertices, offset, item, options);
      counts.rects += 1;
    } else if (item.object instanceof Circle || item.object instanceof Ellipse) {
      offset = writeWebGLEllipseLike(vertices, offset, item, options, segments);
      counts.circles += item.object instanceof Circle ? 1 : 0;
      counts.ellipses += item.object instanceof Ellipse ? 1 : 0;
    } else if (item.object instanceof Line || item.object instanceof Polyline) {
      offset = writeStrokedPath(vertices, offset, item, options);
      counts.lines += item.object instanceof Line ? 1 : 0;
      counts.polylines += item.object instanceof Polyline ? 1 : 0;
    } else if (item.object instanceof Polygon) {
      offset = writeFilledPolygon(vertices, offset, item, options);
      counts.polygons += 1;
    } else if (item.object instanceof ShapePath) {
      offset = writeShapePath(vertices, offset, item, options, segments, drawBatches);
      counts.shapePaths += 1;
      counts.shapePathUnsupportedFills += pushUnsupportedShapePathFill(item, segments, shapePathFillFallbacks);
      continue;
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
    arcs: counts.arcs,
    circles: counts.circles,
    ellipses: counts.ellipses,
    lines: counts.lines,
    polylines: counts.polylines,
    polygons: counts.polygons,
    shapePaths: counts.shapePaths,
    shapePathUnsupportedFills: counts.shapePathUnsupportedFills,
    shapePathFillFallbacks,
    unsupported: options.items.length - shapeItems.length
  };
}

function pushUnsupportedShapePathFill(item: WebGLShapeItem, segments: number, fallbacks: WebGLShapePathFillFallbackReport[]): number {
  if (!(item.object instanceof ShapePath)) {
    return 0;
  }

  const support = getWebGLShapePathFillSupport(item.object, segments);

  if (!item.object.fill || support.supported || support.reason === "disabled" || support.reason === "empty") {
    return 0;
  }

  fallbacks.push({ objectId: item.object.id, objectName: item.object.name, reason: support.reason });
  return 1;
}

function isShapeItem(item: WebGLShapeBatchOptions["items"][number]): item is WebGLShapeItem {
  return (
    item.object instanceof Arc ||
    item.object instanceof Rect ||
    item.object instanceof Circle ||
    item.object instanceof Ellipse ||
    item.object instanceof Line ||
    item.object instanceof Polyline ||
    item.object instanceof Polygon ||
    item.object instanceof ShapePath
  );
}

function getVertexCount(items: readonly WebGLShapeItem[], segments: number): number {
  return items.reduce((count, item) => count + getItemVertexCount(item, segments), 0);
}

function getItemVertexCount(item: WebGLShapeItem, segments: number): number {
  if (item.object instanceof Rect) {
    return webGLRectVertexCount;
  }

  if (item.object instanceof Arc) {
    return getWebGLArcVertexCount(item.object, segments);
  }

  if (item.object instanceof Circle || item.object instanceof Ellipse) {
    return getWebGLEllipseLikeVertexCount(segments);
  }

  if (item.object instanceof Line || item.object instanceof Polyline) {
    return getWebGLStrokeVertexCount(getWebGLPathPoints(item), getStrokeOptions(item.object.material));
  }

  if (item.object instanceof ShapePath) {
    return getWebGLShapePathVertexCount(item.object, segments);
  }

  return item.object instanceof Polygon ? getWebGLPolygonFillVertexCount(getWebGLPathPoints(item)) : 0;
}

function writeArc(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLShapeBatchOptions,
  segments: number
): number {
  if (!(item.object instanceof Arc)) {
    return offset;
  }

  return writeWebGLArc(vertices, offset, item.object, {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(item.object.material.fillColor),
    strokeColor: parseWebGLColor(item.object.material.strokeColor),
    curveSegments: segments
  });
}

function writeStrokedPath(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
  const object = item.object;

  if (!(object instanceof Line || object instanceof Polyline)) {
    return offset;
  }

  return writeWebGLStroke(vertices, offset, getWebGLPathPoints(item), {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(object.material.strokeColor),
    ...getStrokeOptions(object.material)
  });
}

function writeFilledPolygon(vertices: Float32Array, offset: number, item: WebGLShapeItem, options: WebGLShapeBatchOptions): number {
  if (!(item.object instanceof Polygon)) {
    return offset;
  }

  return writeWebGLPolygonFill(vertices, offset, getWebGLPathPoints(item), {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(item.object.material.fillColor)
  });
}

function writeShapePath(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLShapeBatchOptions,
  segments: number,
  drawBatches: WebGLDrawBatch[]
): number {
  if (!(item.object instanceof ShapePath)) {
    return offset;
  }

  const fillFirstVertex = offset / webGLFloatsPerVertex;
  offset = writeWebGLShapePathFill(vertices, offset, item, {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(item.object.material.fillColor),
    curveSegments: segments
  });
  appendWebGLDrawBatch(drawBatches, {
    key: getWebGLShapePathFillMaterialKey(item.object),
    firstVertex: fillFirstVertex,
    vertexCount: offset / webGLFloatsPerVertex - fillFirstVertex
  });

  const strokeFirstVertex = offset / webGLFloatsPerVertex;
  offset = writeWebGLShapePathStroke(vertices, offset, item, {
    ...options,
    matrix: item.worldMatrix,
    color: parseWebGLColor(item.object.material.strokeColor),
    ...getStrokeOptions(item.object.material),
    curveSegments: segments
  });
  appendWebGLDrawBatch(drawBatches, {
    key: getWebGLShapePathStrokeMaterialKey(item.object),
    firstVertex: strokeFirstVertex,
    vertexCount: offset / webGLFloatsPerVertex - strokeFirstVertex
  });

  return offset;
}

function getStrokeOptions(material: WebGLShapeItem["object"]["material"]): {
  readonly lineWidth: number;
  readonly strokeCap: typeof material.strokeCap;
  readonly strokeJoin: typeof material.strokeJoin;
  readonly miterLimit: number;
} {
  return {
    lineWidth: material.lineWidth,
    strokeCap: material.strokeCap,
    strokeJoin: material.strokeJoin,
    miterLimit: material.miterLimit
  };
}

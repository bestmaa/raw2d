import { ShapePath, flattenShapePath, getShapePathLocalBounds } from "raw2d-core";
import { getWebGLPolygonFillVertexCount, writeWebGLPolygonFill } from "./writeWebGLPolygonFill.js";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import type { WebGLLocalPoint, WebGLFillWriteOptions, WebGLStrokeWriteOptions } from "./WebGLPathGeometry.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLShapePathVertexCount(shapePath: ShapePath, curveSegments: number): number {
  return getWebGLShapePathFillVertexCount(shapePath, curveSegments) + getWebGLShapePathStrokeVertexCount(shapePath, curveSegments);
}

export function getWebGLShapePathFillVertexCount(shapePath: ShapePath, curveSegments: number): number {
  if (!canFillShapePath(shapePath)) {
    return 0;
  }

  return getFillSubpaths(shapePath, curveSegments).reduce((count, points) => count + getWebGLPolygonFillVertexCount(points), 0);
}

export function getWebGLShapePathStrokeVertexCount(shapePath: ShapePath, curveSegments: number): number {
  if (!canStrokeShapePath(shapePath)) {
    return 0;
  }

  return getStrokeSubpaths(shapePath, curveSegments).reduce((count, points) => count + getWebGLStrokeVertexCount(points), 0);
}

export function writeWebGLShapePathFill(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLFillWriteOptions & { readonly curveSegments: number }
): number {
  if (!(item.object instanceof ShapePath) || !canFillShapePath(item.object)) {
    return offset;
  }

  for (const points of getFillSubpaths(item.object, options.curveSegments)) {
    offset = writeWebGLPolygonFill(vertices, offset, points, options);
  }

  return offset;
}

export function writeWebGLShapePathStroke(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLStrokeWriteOptions & { readonly curveSegments: number }
): number {
  if (!(item.object instanceof ShapePath) || !canStrokeShapePath(item.object)) {
    return offset;
  }

  for (const points of getStrokeSubpaths(item.object, options.curveSegments)) {
    offset = writeWebGLStroke(vertices, offset, points, options);
  }

  return offset;
}

function canStrokeShapePath(shapePath: ShapePath): boolean {
  return shapePath.stroke && shapePath.material.lineWidth > 0 && shapePath.commands.length > 0;
}

function canFillShapePath(shapePath: ShapePath): boolean {
  return shapePath.fill && shapePath.commands.length > 0;
}

function getFillSubpaths(shapePath: ShapePath, curveSegments: number): readonly (readonly WebGLLocalPoint[])[] {
  return getOffsetSubpaths(shapePath, curveSegments).filter((subpath) => subpath.closed).map((subpath) => subpath.points);
}

function getStrokeSubpaths(shapePath: ShapePath, curveSegments: number): readonly (readonly WebGLLocalPoint[])[] {
  return getOffsetSubpaths(shapePath, curveSegments).map((subpath) => closePointsIfNeeded(subpath.points, subpath.closed));
}

function getOffsetSubpaths(shapePath: ShapePath, curveSegments: number): readonly OffsetSubpath[] {
  const bounds = getShapePathLocalBounds(shapePath);
  const offsetX = bounds.x + bounds.width * shapePath.originX;
  const offsetY = bounds.y + bounds.height * shapePath.originY;
  return flattenShapePath(shapePath, { curveSegments }).subpaths.map((subpath) => {
    return {
      closed: subpath.closed,
      points: subpath.points.map((point) => ({
        x: point.x - offsetX,
        y: point.y - offsetY
      }))
    };
  });
}

function closePointsIfNeeded(points: readonly WebGLLocalPoint[], closed: boolean): readonly WebGLLocalPoint[] {
  const first = points[0];
  const last = points.at(-1);

  if (!closed || !first || !last || (first.x === last.x && first.y === last.y)) {
    return points;
  }

  return [...points, first];
}

interface OffsetSubpath {
  readonly points: readonly WebGLLocalPoint[];
  readonly closed: boolean;
}

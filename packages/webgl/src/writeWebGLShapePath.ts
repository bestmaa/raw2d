import { ShapePath, flattenShapePath, getShapePathLocalBounds } from "raw2d-core";
import { classifyWebGLShapePathFill } from "./classifyWebGLShapePathFill.js";
import { getWebGLPolygonFillVertexCount, writeWebGLPolygonFill } from "./writeWebGLPolygonFill.js";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import type { WebGLLocalPoint, WebGLFillWriteOptions, WebGLStrokeWriteOptions } from "./WebGLPathGeometry.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";
import type { WebGLShapePathFillSubpath, WebGLShapePathFillSupport } from "./WebGLShapePathFillSupport.type.js";

export function getWebGLShapePathVertexCount(shapePath: ShapePath, curveSegments: number): number {
  const subpaths = getOffsetSubpaths(shapePath, curveSegments);
  return getWebGLShapePathFillVertexCount(shapePath, subpaths) + getWebGLShapePathStrokeVertexCount(shapePath, subpaths);
}

export function getWebGLShapePathFillVertexCount(shapePath: ShapePath, subpaths: readonly WebGLShapePathFillSubpath[]): number {
  const support = getFillSupport(shapePath, subpaths);

  if (!support.supported) {
    return 0;
  }

  return getWebGLPolygonFillVertexCount(support.points);
}

export function getWebGLShapePathStrokeVertexCount(shapePath: ShapePath, subpaths: readonly WebGLShapePathFillSubpath[]): number {
  if (!canStrokeShapePath(shapePath)) {
    return 0;
  }

  return getStrokeSubpaths(subpaths).reduce((count, points) => count + getWebGLStrokeVertexCount(points), 0);
}

export function getWebGLShapePathUnsupportedFillCount(shapePath: ShapePath, curveSegments: number): number {
  const support = getWebGLShapePathFillSupport(shapePath, curveSegments);
  return shapePath.fill && support.reason !== "disabled" && support.reason !== "empty" && !support.supported ? 1 : 0;
}

export function getWebGLShapePathFillSupport(shapePath: ShapePath, curveSegments: number): WebGLShapePathFillSupport {
  return getFillSupport(shapePath, getOffsetSubpaths(shapePath, curveSegments));
}

export function writeWebGLShapePathFill(
  vertices: Float32Array,
  offset: number,
  item: WebGLShapeItem,
  options: WebGLFillWriteOptions & { readonly curveSegments: number }
): number {
  if (!(item.object instanceof ShapePath)) {
    return offset;
  }

  const support = getFillSupport(item.object, getOffsetSubpaths(item.object, options.curveSegments));

  if (!support.supported) {
    return offset;
  }

  return writeWebGLPolygonFill(vertices, offset, support.points, options);
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

  for (const points of getStrokeSubpaths(getOffsetSubpaths(item.object, options.curveSegments))) {
    offset = writeWebGLStroke(vertices, offset, points, options);
  }

  return offset;
}

function canStrokeShapePath(shapePath: ShapePath): boolean {
  return shapePath.stroke && shapePath.material.lineWidth > 0 && shapePath.commands.length > 0;
}

function getFillSupport(shapePath: ShapePath, subpaths: readonly WebGLShapePathFillSubpath[]): WebGLShapePathFillSupport {
  return classifyWebGLShapePathFill(shapePath.commands.length > 0 ? subpaths : [], shapePath.fill);
}

function getStrokeSubpaths(subpaths: readonly WebGLShapePathFillSubpath[]): readonly (readonly WebGLLocalPoint[])[] {
  return subpaths.map((subpath) => closePointsIfNeeded(subpath.points, subpath.closed));
}

function getOffsetSubpaths(shapePath: ShapePath, curveSegments: number): readonly WebGLShapePathFillSubpath[] {
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

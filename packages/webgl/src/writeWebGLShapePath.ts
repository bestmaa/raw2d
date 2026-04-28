import { ShapePath, flattenShapePath, getShapePathLocalBounds } from "raw2d-core";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import type { WebGLLocalPoint, WebGLStrokeWriteOptions } from "./WebGLPathGeometry.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLShapePathVertexCount(shapePath: ShapePath, curveSegments: number): number {
  if (!canStrokeShapePath(shapePath)) {
    return 0;
  }

  return getStrokeSubpaths(shapePath, curveSegments).reduce((count, points) => count + getWebGLStrokeVertexCount(points), 0);
}

export function writeWebGLShapePath(
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

function getStrokeSubpaths(shapePath: ShapePath, curveSegments: number): readonly (readonly WebGLLocalPoint[])[] {
  const bounds = getShapePathLocalBounds(shapePath);
  const offsetX = bounds.x + bounds.width * shapePath.originX;
  const offsetY = bounds.y + bounds.height * shapePath.originY;
  return flattenShapePath(shapePath, { curveSegments }).subpaths.map((subpath) => closePointsIfNeeded(subpath.points, subpath.closed)).map((points) => {
    return points.map((point) => ({
      x: point.x - offsetX,
      y: point.y - offsetY
    }));
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


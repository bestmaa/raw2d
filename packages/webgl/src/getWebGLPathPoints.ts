import { Line, Polygon, Polyline, getLineLocalBounds, getPolygonLocalBounds, getPolylineLocalBounds } from "raw2d-core";
import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";
import type { WebGLShapeItem } from "./WebGLShapeBatch.type.js";

export function getWebGLPathPoints(item: WebGLShapeItem): readonly WebGLLocalPoint[] {
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

  return item.object instanceof Polygon
    ? offsetPoints(item.object.points, getPolygonLocalBounds(item.object), item.object.originX, item.object.originY)
    : [];
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


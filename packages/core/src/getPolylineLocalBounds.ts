import type { PolylinePoint } from "./Polyline.type.js";
import type { Polyline } from "./Polyline.js";
import { Rectangle } from "./Rectangle.js";

export function getPolylineLocalBounds(polyline: Polyline): Rectangle {
  return getPointBounds(polyline.points);
}

function getPointBounds(points: readonly PolylinePoint[]): Rectangle {
  if (points.length === 0) {
    return new Rectangle({ x: 0, y: 0, width: 0, height: 0 });
  }

  let x = points[0].x;
  let y = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    x = Math.min(x, point.x);
    y = Math.min(y, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return new Rectangle({
    x,
    y,
    width: maxX - x,
    height: maxY - y
  });
}

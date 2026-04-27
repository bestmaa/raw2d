import { Arc } from "./Arc.js";
import { Circle } from "./Circle.js";
import { Ellipse } from "./Ellipse.js";
import { Line } from "./Line.js";
import { Polygon } from "./Polygon.js";
import { Polyline } from "./Polyline.js";
import { Rect } from "./Rect.js";
import { ShapePath } from "./ShapePath.js";
import { containsCirclePoint } from "./containsCirclePoint.js";
import { containsEllipsePoint } from "./containsEllipsePoint.js";
import { containsLinePoint } from "./containsLinePoint.js";
import { containsPolygonPoint } from "./containsPolygonPoint.js";
import { containsPolylinePoint } from "./containsPolylinePoint.js";
import { containsRectPoint } from "./containsRectPoint.js";
import { getCoreLocalBounds } from "./getCoreLocalBounds.js";
import { worldToLocalPoint } from "./worldToLocalPoint.js";
import type { ContainsPointOptions } from "./HitTest.type.js";

export function containsPoint(options: ContainsPointOptions): boolean {
  const localBounds = getCoreLocalBounds(options.object);
  const point = worldToLocalPoint({ object: options.object, localBounds, x: options.x, y: options.y });

  if (options.object instanceof Rect) {
    return containsRectPoint({ rect: options.object, point });
  }

  if (options.object instanceof Circle) {
    return containsCirclePoint({ circle: options.object, point });
  }

  if (options.object instanceof Ellipse) {
    return containsEllipsePoint({ ellipse: options.object, point });
  }

  if (options.object instanceof Line) {
    return containsLinePoint({ line: options.object, point, tolerance: options.tolerance });
  }

  if (options.object instanceof Polyline) {
    return containsPolylinePoint({ polyline: options.object, point, tolerance: options.tolerance });
  }

  if (options.object instanceof Polygon) {
    return containsPolygonPoint({ polygon: options.object, point });
  }

  if (options.object instanceof Arc || options.object instanceof ShapePath) {
    return localBounds.containsPoint(point);
  }

  return false;
}

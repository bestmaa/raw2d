import { Arc } from "./Arc.js";
import { Circle } from "./Circle.js";
import { Ellipse } from "./Ellipse.js";
import { Line } from "./Line.js";
import { Polygon } from "./Polygon.js";
import { Polyline } from "./Polyline.js";
import { Rect } from "./Rect.js";
import { ShapePath } from "./ShapePath.js";
import { getArcLocalBounds } from "./getArcLocalBounds.js";
import { getCircleLocalBounds } from "./getCircleLocalBounds.js";
import { getEllipseLocalBounds } from "./getEllipseLocalBounds.js";
import { getLineLocalBounds } from "./getLineLocalBounds.js";
import { getPolygonLocalBounds } from "./getPolygonLocalBounds.js";
import { getPolylineLocalBounds } from "./getPolylineLocalBounds.js";
import { getRectLocalBounds } from "./getRectLocalBounds.js";
import { getShapePathLocalBounds } from "./getShapePathLocalBounds.js";
import type { CoreBoundsObject } from "./Bounds.type.js";
import type { Rectangle } from "./Rectangle.js";

export function getCoreLocalBounds(object: CoreBoundsObject): Rectangle {
  if (object instanceof Rect) {
    return getRectLocalBounds(object);
  }

  if (object instanceof Circle) {
    return getCircleLocalBounds(object);
  }

  if (object instanceof Ellipse) {
    return getEllipseLocalBounds(object);
  }

  if (object instanceof Arc) {
    return getArcLocalBounds(object);
  }

  if (object instanceof Line) {
    return getLineLocalBounds(object);
  }

  if (object instanceof Polyline) {
    return getPolylineLocalBounds(object);
  }

  if (object instanceof Polygon) {
    return getPolygonLocalBounds(object);
  }

  if (object instanceof ShapePath) {
    return getShapePathLocalBounds(object);
  }

  throw new Error("Unsupported core bounds object.");
}

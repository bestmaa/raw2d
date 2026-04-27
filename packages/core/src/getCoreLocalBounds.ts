import { Circle } from "./Circle.js";
import { Line } from "./Line.js";
import { Rect } from "./Rect.js";
import { getCircleLocalBounds } from "./getCircleLocalBounds.js";
import { getLineLocalBounds } from "./getLineLocalBounds.js";
import { getRectLocalBounds } from "./getRectLocalBounds.js";
import type { CoreBoundsObject } from "./Bounds.type.js";
import type { Rectangle } from "./Rectangle.js";

export function getCoreLocalBounds(object: CoreBoundsObject): Rectangle {
  if (object instanceof Rect) {
    return getRectLocalBounds(object);
  }

  if (object instanceof Circle) {
    return getCircleLocalBounds(object);
  }

  if (object instanceof Line) {
    return getLineLocalBounds(object);
  }

  throw new Error("Unsupported core bounds object.");
}

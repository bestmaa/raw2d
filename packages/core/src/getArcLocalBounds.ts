import type { Arc } from "./Arc.js";
import { Rectangle } from "./Rectangle.js";

export function getArcLocalBounds(arc: Arc): Rectangle {
  return new Rectangle({
    x: -arc.radiusX,
    y: -arc.radiusY,
    width: arc.radiusX * 2,
    height: arc.radiusY * 2
  });
}

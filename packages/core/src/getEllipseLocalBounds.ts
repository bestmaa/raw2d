import type { Ellipse } from "./Ellipse.js";
import { Rectangle } from "./Rectangle.js";

export function getEllipseLocalBounds(ellipse: Ellipse): Rectangle {
  return new Rectangle({
    x: -ellipse.radiusX,
    y: -ellipse.radiusY,
    width: ellipse.radiusX * 2,
    height: ellipse.radiusY * 2
  });
}

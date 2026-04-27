import type { Circle } from "./Circle.js";
import { Rectangle } from "./Rectangle.js";

export function getCircleLocalBounds(circle: Circle): Rectangle {
  const diameter = circle.radius * 2;
  return new Rectangle({ x: -circle.radius, y: -circle.radius, width: diameter, height: diameter });
}

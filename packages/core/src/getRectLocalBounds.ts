import type { Rect } from "./Rect.js";
import { Rectangle } from "./Rectangle.js";

export function getRectLocalBounds(rect: Rect): Rectangle {
  return new Rectangle({ x: 0, y: 0, width: rect.width, height: rect.height });
}

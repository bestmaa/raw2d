import type { Line } from "./Line.js";
import { Rectangle } from "./Rectangle.js";

export function getLineLocalBounds(line: Line): Rectangle {
  const x = Math.min(line.startX, line.endX);
  const y = Math.min(line.startY, line.endY);
  return new Rectangle({
    x,
    y,
    width: Math.abs(line.endX - line.startX),
    height: Math.abs(line.endY - line.startY)
  });
}

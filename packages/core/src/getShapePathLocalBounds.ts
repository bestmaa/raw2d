import type { BoundsPoint } from "./Bounds.type.js";
import type { PathCommand } from "./PathCommand.type.js";
import { Rectangle } from "./Rectangle.js";
import type { ShapePath } from "./ShapePath.js";

export function getShapePathLocalBounds(shapePath: ShapePath): Rectangle {
  const points = shapePath.commands.flatMap(getCommandPoints);

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

  return new Rectangle({ x, y, width: maxX - x, height: maxY - y });
}

function getCommandPoints(command: PathCommand): readonly BoundsPoint[] {
  if (command.type === "moveTo" || command.type === "lineTo") {
    return [{ x: command.x, y: command.y }];
  }

  if (command.type === "quadraticCurveTo") {
    return [
      { x: command.cpx, y: command.cpy },
      { x: command.x, y: command.y }
    ];
  }

  if (command.type === "bezierCurveTo") {
    return [
      { x: command.cp1x, y: command.cp1y },
      { x: command.cp2x, y: command.cp2y },
      { x: command.x, y: command.y }
    ];
  }

  return [];
}

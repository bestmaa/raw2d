import { getShapePathLocalBounds } from "raw2d-core";
import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawShapePathOptions } from "./drawShapePath.type.js";

export function drawShapePath(options: DrawShapePathOptions): void {
  const { context, shapePath } = options;

  if (shapePath.commands.length === 0) {
    return;
  }

  const bounds = getShapePathLocalBounds(shapePath);

  context.save();
  applyObjectTransform({ context, object: shapePath });
  applyOriginOffset({
    context,
    object: shapePath,
    localX: bounds.x,
    localY: bounds.y,
    width: bounds.width,
    height: bounds.height
  });
  context.beginPath();

  for (const command of shapePath.commands) {
    if (command.type === "moveTo") {
      context.moveTo(command.x, command.y);
    } else if (command.type === "lineTo") {
      context.lineTo(command.x, command.y);
    } else if (command.type === "quadraticCurveTo") {
      context.quadraticCurveTo(command.cpx, command.cpy, command.x, command.y);
    } else if (command.type === "bezierCurveTo") {
      context.bezierCurveTo(command.cp1x, command.cp1y, command.cp2x, command.cp2y, command.x, command.y);
    } else {
      context.closePath();
    }
  }

  if (shapePath.fill) {
    context.fillStyle = shapePath.material.fillColor;
    context.fill();
  }

  if (shapePath.stroke && shapePath.material.lineWidth > 0) {
    context.strokeStyle = shapePath.material.strokeColor;
    context.lineWidth = shapePath.material.lineWidth;
    context.stroke();
  }

  context.restore();
}

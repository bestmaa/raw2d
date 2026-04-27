import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawLineOptions } from "./drawLine.type.js";

export function drawLine(options: DrawLineOptions): void {
  const { context, line } = options;

  context.save();
  applyObjectTransform({ context, object: line });
  applyOriginOffset({
    context,
    object: line,
    localX: Math.min(line.startX, line.endX),
    localY: Math.min(line.startY, line.endY),
    width: Math.abs(line.endX - line.startX),
    height: Math.abs(line.endY - line.startY)
  });
  context.beginPath();
  context.moveTo(line.startX, line.startY);
  context.lineTo(line.endX, line.endY);
  context.strokeStyle = line.material.strokeColor;
  context.lineWidth = line.material.lineWidth;
  context.stroke();
  context.restore();
}

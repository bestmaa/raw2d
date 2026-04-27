import { applyObjectTransform } from "./applyObjectTransform";
import type { DrawLineOptions } from "./drawLine.type";

export function drawLine(options: DrawLineOptions): void {
  const { context, line } = options;

  context.save();
  applyObjectTransform({ context, object: line });
  context.beginPath();
  context.moveTo(line.startX, line.startY);
  context.lineTo(line.endX, line.endY);
  context.strokeStyle = line.material.strokeColor;
  context.lineWidth = line.material.lineWidth;
  context.stroke();
  context.restore();
}

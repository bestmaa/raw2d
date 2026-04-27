import { applyObjectTransform } from "./applyObjectTransform.js";
import type { DrawCircleOptions } from "./drawCircle.type.js";

export function drawCircle(options: DrawCircleOptions): void {
  const { context, circle } = options;

  context.save();
  applyObjectTransform({ context, object: circle });
  context.beginPath();
  context.arc(0, 0, circle.radius, 0, Math.PI * 2);
  context.fillStyle = circle.material.fillColor;
  context.fill();
  context.restore();
}

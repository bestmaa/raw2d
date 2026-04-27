import { applyObjectTransform } from "./applyObjectTransform.js";
import type { DrawRectOptions } from "./drawRect.type.js";

export function drawRect(options: DrawRectOptions): void {
  const { context, rect } = options;

  context.save();
  applyObjectTransform({ context, object: rect });
  context.fillStyle = rect.material.fillColor;
  context.fillRect(0, 0, rect.width, rect.height);
  context.restore();
}

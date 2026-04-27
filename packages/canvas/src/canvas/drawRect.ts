import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawRectOptions } from "./drawRect.type.js";

export function drawRect(options: DrawRectOptions): void {
  const { context, rect } = options;

  context.save();
  applyObjectTransform({ context, object: rect });
  applyOriginOffset({ context, object: rect, localX: 0, localY: 0, width: rect.width, height: rect.height });
  context.fillStyle = rect.material.fillColor;
  context.fillRect(0, 0, rect.width, rect.height);
  context.restore();
}

import type { ApplyStrokeStyleOptions } from "./applyStrokeStyle.type.js";

export function applyStrokeStyle(options: ApplyStrokeStyleOptions): void {
  const { context, material } = options;
  context.strokeStyle = material.strokeColor;
  context.lineWidth = material.lineWidth;
  context.lineCap = material.strokeCap;
  context.lineJoin = material.strokeJoin;
  context.miterLimit = material.miterLimit;
}

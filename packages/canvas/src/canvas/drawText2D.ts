import { applyObjectTransform } from "./applyObjectTransform.js";
import type { DrawText2DOptions } from "./drawText2D.type.js";

export function drawText2D(options: DrawText2DOptions): void {
  const { context, text } = options;

  context.save();
  applyObjectTransform({ context, object: text });
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;
  context.fillStyle = text.material.fillColor;
  context.fillText(text.text, 0, 0);
  context.restore();
}

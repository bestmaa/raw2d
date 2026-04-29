import { applyObjectTransform } from "./applyObjectTransform.js";
import { applyOriginOffset } from "./applyOriginOffset.js";
import type { DrawText2DOptions } from "./drawText2D.type.js";

export function drawText2D(options: DrawText2DOptions): void {
  const { context, text } = options;

  context.save();
  applyObjectTransform({ context, object: text });
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;
  const metrics = context.measureText(text.text);
  applyOriginOffset({
    context,
    object: text,
    localX: -metrics.actualBoundingBoxLeft,
    localY: -metrics.actualBoundingBoxAscent,
    width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  });

  if (shouldStrokeText(text.material.strokeColor, text.material.fillColor, text.material.lineWidth)) {
    context.lineWidth = text.material.lineWidth;
    context.strokeStyle = text.material.strokeColor;
    context.strokeText(text.text, 0, 0);
  }

  context.fillStyle = text.material.fillColor;
  context.fillText(text.text, 0, 0);
  context.restore();
}

function shouldStrokeText(strokeColor: string, fillColor: string, lineWidth: number): boolean {
  return lineWidth > 0 && strokeColor !== fillColor;
}

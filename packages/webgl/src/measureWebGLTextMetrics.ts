import type { Text2D } from "raw2d-text";
import { getWebGLTextContext } from "./getWebGLTextContext.js";
import { getWebGLTextStrokeWidth } from "./getWebGLTextStrokeWidth.js";
import type { WebGLTextMetrics } from "./WebGLTextMetrics.type.js";

export function measureWebGLTextMetrics(canvas: HTMLCanvasElement, text: Text2D): WebGLTextMetrics {
  const context = getWebGLTextContext(canvas);
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;
  const metrics = context.measureText(text.text);
  const estimatedSize = estimateFontSize(text.font);
  const measuredWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const measuredHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    localX: measuredWidth > 0 ? -metrics.actualBoundingBoxLeft : 0,
    localY: measuredHeight > 0 ? -metrics.actualBoundingBoxAscent : -estimatedSize * 0.8,
    width: Math.max(1, measuredWidth || metrics.width || estimatedSize),
    height: Math.max(1, measuredHeight || estimatedSize),
    strokeWidth: getWebGLTextStrokeWidth(text)
  };
}

function estimateFontSize(font: string): number {
  const match = /(\d+(?:\.\d+)?)px/.exec(font);
  return match ? Number(match[1]) : 16;
}

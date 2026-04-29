import type { WebGLRenderer2DOptions } from "./WebGLRenderer2D.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";

export function emitWebGLShapePathFillFallbacks(batch: WebGLShapeBatch, options: WebGLRenderer2DOptions): void {
  if (options.shapePathFillFallback !== "warn") {
    return;
  }

  for (const fallback of batch.shapePathFillFallbacks) {
    options.onShapePathFillFallback?.(fallback);

    if (!options.onShapePathFillFallback) {
      console.warn(`Raw2D WebGL skipped ShapePath fill (${fallback.reason}) for ${fallback.objectId}.`);
    }
  }
}

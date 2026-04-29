import type { Text2D } from "raw2d-text";

export function getWebGLTextStrokeWidth(text: Text2D): number {
  const lineWidth = Math.max(0, text.material.lineWidth);
  return lineWidth > 0 && text.material.strokeColor !== text.material.fillColor ? lineWidth : 0;
}

import type { DrawWebGLTextTextureOptions } from "./drawWebGLTextTexture.type.js";

export function drawWebGLTextTexture(options: DrawWebGLTextTextureOptions): void {
  const { context, text, metrics, padding, width, height } = options;
  const drawX = padding - metrics.localX;
  const drawY = padding - metrics.localY;

  context.clearRect(0, 0, width, height);
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;

  if (metrics.strokeWidth > 0) {
    context.lineWidth = metrics.strokeWidth;
    context.strokeStyle = text.material.strokeColor;
    context.strokeText(text.text, drawX, drawY);
  }

  context.fillStyle = text.material.fillColor;
  context.fillText(text.text, drawX, drawY);
}

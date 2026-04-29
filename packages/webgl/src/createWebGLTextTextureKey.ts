import type { Text2D } from "raw2d-text";
import { getWebGLTextStrokeWidth } from "./getWebGLTextStrokeWidth.js";

export function createWebGLTextTextureKey(text: Text2D): string {
  return [
    text.text,
    text.font,
    text.align,
    text.baseline,
    text.material.version,
    text.material.fillColor,
    text.material.strokeColor,
    getWebGLTextStrokeWidth(text)
  ].join("|");
}

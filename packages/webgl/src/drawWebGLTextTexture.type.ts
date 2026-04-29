import type { Text2D } from "raw2d-text";
import type { WebGLTextMetrics } from "./WebGLTextMetrics.type.js";

export interface DrawWebGLTextTextureOptions {
  readonly context: CanvasRenderingContext2D;
  readonly text: Text2D;
  readonly metrics: WebGLTextMetrics;
  readonly padding: number;
  readonly width: number;
  readonly height: number;
}

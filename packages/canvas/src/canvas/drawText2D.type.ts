import type { Text2D } from "raw2d-text";

export interface DrawText2DOptions {
  readonly context: CanvasRenderingContext2D;
  readonly text: Text2D;
}

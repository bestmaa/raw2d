import type { Text2D } from "./Text2D.js";

export interface MeasureText2DBoundsOptions {
  readonly context: CanvasRenderingContext2D;
  readonly text: Text2D;
}

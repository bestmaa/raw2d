import type { Arc } from "raw2d-core";

export interface DrawArcOptions {
  readonly context: CanvasRenderingContext2D;
  readonly arc: Arc;
}

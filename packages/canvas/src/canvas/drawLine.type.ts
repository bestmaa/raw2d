import type { Line } from "raw2d-core";

export interface DrawLineOptions {
  readonly context: CanvasRenderingContext2D;
  readonly line: Line;
}

import type { Ellipse } from "raw2d-core";

export interface DrawEllipseOptions {
  readonly context: CanvasRenderingContext2D;
  readonly ellipse: Ellipse;
}

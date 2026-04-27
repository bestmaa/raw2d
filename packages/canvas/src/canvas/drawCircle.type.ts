import type { Circle } from "raw2d-core";

export interface DrawCircleOptions {
  readonly context: CanvasRenderingContext2D;
  readonly circle: Circle;
}

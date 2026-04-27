import type { Rect } from "raw2d-core";

export interface DrawRectOptions {
  readonly context: CanvasRenderingContext2D;
  readonly rect: Rect;
}

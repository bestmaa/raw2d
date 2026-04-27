import type { Rect } from "../../objects";

export interface DrawRectOptions {
  readonly context: CanvasRenderingContext2D;
  readonly rect: Rect;
}

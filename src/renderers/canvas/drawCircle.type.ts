import type { Circle } from "../../objects";

export interface DrawCircleOptions {
  readonly context: CanvasRenderingContext2D;
  readonly circle: Circle;
}

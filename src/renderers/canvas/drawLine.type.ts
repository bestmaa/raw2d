import type { Line } from "../../objects";

export interface DrawLineOptions {
  readonly context: CanvasRenderingContext2D;
  readonly line: Line;
}

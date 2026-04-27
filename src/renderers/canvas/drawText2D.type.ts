import type { Text2D } from "../../objects";

export interface DrawText2DOptions {
  readonly context: CanvasRenderingContext2D;
  readonly text: Text2D;
}

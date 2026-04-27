import type { CanvasObject } from "../Canvas.type.js";

export interface ApplyObjectTransformOptions {
  readonly context: CanvasRenderingContext2D;
  readonly object: CanvasObject;
}

import type { CanvasObject } from "../../core";

export interface ApplyObjectTransformOptions {
  readonly context: CanvasRenderingContext2D;
  readonly object: CanvasObject;
}

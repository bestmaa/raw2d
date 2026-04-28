import type { Rectangle } from "raw2d-core";
import type { CanvasObject } from "../Canvas.type.js";

export interface GetCanvasObjectWorldBoundsOptions {
  readonly object: CanvasObject;
  readonly context: CanvasRenderingContext2D;
}

export type GetCanvasObjectWorldBounds = (options: GetCanvasObjectWorldBoundsOptions) => Rectangle | null;

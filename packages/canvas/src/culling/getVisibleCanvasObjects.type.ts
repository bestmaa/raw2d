import type { Camera2D } from "raw2d-core";
import type { CanvasObject, CanvasRenderOptions } from "../Canvas.type.js";

export interface GetVisibleCanvasObjectsOptions {
  readonly objects: readonly CanvasObject[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly context: CanvasRenderingContext2D;
  readonly renderOptions?: CanvasRenderOptions;
}

export type GetVisibleCanvasObjects = (options: GetVisibleCanvasObjectsOptions) => readonly CanvasObject[];

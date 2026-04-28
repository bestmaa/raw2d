import type { RenderList } from "raw2d-core";
import type { CanvasObject } from "./Canvas.type.js";

export interface CanvasObjectRendererOptions {
  readonly context: CanvasRenderingContext2D;
}

export interface CanvasObjectRendererLike {
  render(objects: readonly CanvasObject[] | RenderList<CanvasObject>): void;
}

import type { RenderList } from "raw2d-core";
import type { CanvasObject } from "./Canvas.type.js";
import type { CanvasEffectProvider } from "./CanvasEffects.type.js";

export interface CanvasObjectRendererOptions {
  readonly context: CanvasRenderingContext2D;
}

export interface CanvasObjectRendererRenderOptions {
  readonly effects?: CanvasEffectProvider;
}

export interface CanvasObjectRendererLike {
  render(objects: readonly CanvasObject[] | RenderList<CanvasObject>, options?: CanvasObjectRendererRenderOptions): void;
}

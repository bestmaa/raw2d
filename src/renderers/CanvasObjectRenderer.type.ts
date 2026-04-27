import type { CanvasObject } from "../core";

export interface CanvasObjectRendererOptions {
  readonly context: CanvasRenderingContext2D;
}

export interface CanvasObjectRendererLike {
  render(objects: readonly CanvasObject[]): void;
}

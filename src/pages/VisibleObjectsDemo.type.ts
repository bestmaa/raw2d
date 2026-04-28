import type { Camera2D, Canvas, Rect, Scene } from "raw2d";

export interface VisibleObjectsDemoState {
  x: number;
  zoom: number;
}

export interface VisibleObjectsDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: VisibleObjectsDemoState;
  readonly objects: readonly Rect[];
  readonly code: HTMLElement;
}

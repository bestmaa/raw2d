import type { Canvas, Camera2D, KeyboardController, Rect, Scene, SelectionManager } from "raw2d";

export interface KeyboardDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly selection: SelectionManager;
  readonly keyboard: KeyboardController;
  readonly rect: Rect;
  readonly code: HTMLElement;
}

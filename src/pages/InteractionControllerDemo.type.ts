import type { InteractionController, Rect, Scene, Camera2D, Canvas } from "raw2d";

export interface InteractionControllerDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly controller: InteractionController;
  readonly code: HTMLElement;
  readonly rect: Rect;
}

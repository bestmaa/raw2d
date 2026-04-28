import type { Camera2D, Canvas, CameraControls, Scene } from "raw2d";

export interface CameraControlsDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly controls: CameraControls;
  readonly code: HTMLElement;
}

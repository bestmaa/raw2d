import type { Camera2D, Canvas, Rectangle, Scene } from "raw2d";

export interface CameraBoundsDemoState {
  x: number;
  y: number;
  zoom: number;
}

export interface CameraBoundsDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly bounds: Rectangle;
  readonly state: CameraBoundsDemoState;
  readonly code: HTMLElement;
}

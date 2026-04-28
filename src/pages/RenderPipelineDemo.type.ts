import type { Camera2D, Canvas, Rect, Scene } from "raw2d";

export interface RenderPipelineDemoState {
  cameraX: number;
  culling: boolean;
}

export interface RenderPipelineDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly state: RenderPipelineDemoState;
  readonly objects: readonly Rect[];
  readonly code: HTMLElement;
}


import type { Camera2D, Canvas, Scene, WebGLRenderer2D } from "raw2d";

export interface WebGLRendererDemoState {
  objectCount: number;
}

export interface WebGLRendererDemoRenderOptions {
  readonly canvasRenderer: Canvas;
  readonly webglRenderer: WebGLRenderer2D | null;
  readonly camera: Camera2D;
  readonly state: WebGLRendererDemoState;
  readonly canvasStats: HTMLElement;
  readonly webglStats: HTMLElement;
  readonly code: HTMLElement;
}

export interface WebGLRendererScene {
  readonly scene: Scene;
}

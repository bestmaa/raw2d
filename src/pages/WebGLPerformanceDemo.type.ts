import type { Camera2D, Canvas, Scene, Texture, TextureAtlas, WebGLRenderer2D } from "raw2d";

export type WebGLPerformanceTextureMode = "packed" | "separate";

export interface WebGLPerformanceState {
  objectCount: number;
  textureMode: WebGLPerformanceTextureMode;
}

export interface WebGLPerformanceAssets {
  readonly atlas: TextureAtlas;
  readonly separate: readonly Texture[];
}

export interface WebGLPerformanceScene {
  readonly scene: Scene;
  readonly staticCount: number;
  readonly dynamicCount: number;
}

export interface WebGLPerformanceRenderOptions {
  readonly canvasRenderer: Canvas;
  readonly webglRenderer: WebGLRenderer2D | null;
  readonly camera: Camera2D;
  readonly assets: WebGLPerformanceAssets;
  readonly state: WebGLPerformanceState;
  readonly canvasStats: HTMLElement;
  readonly webglStats: HTMLElement;
  readonly summary: HTMLElement;
  readonly code: HTMLElement;
}

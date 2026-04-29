import type { Camera2D, Canvas, Scene, Texture, TextureAtlas, WebGLRenderer2D } from "raw2d";

export type WebGLPerformanceTextureMode = "packed" | "separate";

export interface WebGLPerformanceState {
  objectCount: number;
  textureMode: WebGLPerformanceTextureMode;
  running: boolean;
  culling: boolean;
  staticMode: boolean;
  spriteSorting: boolean;
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

export interface WebGLPerformanceFrameTiming {
  readonly frameMs: number;
  readonly fps: number;
}

export interface WebGLPerformanceFrameTimer {
  record(frameMs: number): WebGLPerformanceFrameTiming;
  reset(): void;
  getSnapshot(): WebGLPerformanceFrameTiming;
}

export interface WebGLPerformanceRuntime {
  frameId: number | null;
  timeSeconds: number;
  readonly canvasTimer: WebGLPerformanceFrameTimer;
  readonly webglTimer: WebGLPerformanceFrameTimer;
}

export interface WebGLPerformanceRenderOptions {
  readonly canvasRenderer: Canvas;
  readonly webglRenderer: WebGLRenderer2D | null;
  readonly camera: Camera2D;
  readonly assets: WebGLPerformanceAssets;
  readonly state: WebGLPerformanceState;
  readonly runtime: WebGLPerformanceRuntime;
  readonly canvasStats: HTMLElement;
  readonly webglStats: HTMLElement;
  readonly spriteStats: HTMLElement;
  readonly summary: HTMLElement;
  readonly code: HTMLElement;
}

import type { Camera2D, Object2D, RenderList, Scene } from "raw2d-core";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";

export interface WebGLRenderer2DOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly createTextCanvas?: (width: number, height: number) => HTMLCanvasElement;
}

export interface WebGLRenderer2DLike {
  render(scene: Scene, camera: Camera2D, options?: WebGLRenderer2DRenderOptions): void;
  setSize(width: number, height: number): void;
}

export interface WebGLRenderer2DRenderOptions {
  readonly culling?: boolean;
  readonly renderList?: RenderList<Object2D>;
}

export interface WebGLRenderer2DSize {
  readonly width: number;
  readonly height: number;
}

export interface WebGLRenderer2DState {
  readonly stats: WebGLRenderStats;
}

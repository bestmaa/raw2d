import type { Object2D, Renderer2DLike, Renderer2DSize, RenderList } from "raw2d-core";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";

export interface WebGLRenderer2DOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly createTextCanvas?: (width: number, height: number) => HTMLCanvasElement;
  readonly textTextureCacheMaxEntries?: number;
}

export interface WebGLRenderer2DLike extends Renderer2DLike<Object2D, WebGLRenderer2DRenderOptions, WebGLRenderStats, WebGLRenderer2DSize> {
  clearTextureCache(): void;
  isContextLost(): boolean;
}

export interface WebGLRenderer2DRenderOptions {
  readonly culling?: boolean;
  readonly renderList?: RenderList<Object2D>;
}

export interface WebGLRenderer2DSize extends Renderer2DSize {
  readonly width: number;
  readonly height: number;
}

export interface WebGLRenderer2DState {
  readonly stats: WebGLRenderStats;
}

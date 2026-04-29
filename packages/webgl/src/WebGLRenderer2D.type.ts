import type { Object2D, Renderer2DLike, Renderer2DRenderOptions, Renderer2DSize } from "raw2d-core";
import type { WebGLShapePathFillFallbackMode, WebGLShapePathFillFallbackReport } from "./WebGLShapePathFillFallback.type.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";

export type WebGLSpriteSortingMode = "none" | "texture";

export interface WebGLRenderer2DOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly createTextCanvas?: (width: number, height: number) => HTMLCanvasElement;
  readonly createShapePathCanvas?: (width: number, height: number) => HTMLCanvasElement;
  readonly textTextureCacheMaxEntries?: number;
  readonly shapePathTextureCacheMaxEntries?: number;
  readonly shapePathFillFallback?: WebGLShapePathFillFallbackMode;
  readonly onShapePathFillFallback?: (fallback: WebGLShapePathFillFallbackReport) => void;
  readonly curveSegments?: number;
}

export interface WebGLRenderer2DLike extends Renderer2DLike<Object2D, WebGLRenderer2DRenderOptions, WebGLRenderStats, WebGLRenderer2DSize> {
  clearTextureCache(): void;
  isContextLost(): boolean;
}

export interface WebGLRenderer2DRenderOptions extends Renderer2DRenderOptions<Object2D> {
  readonly spriteSorting?: WebGLSpriteSortingMode;
  readonly curveSegments?: number;
}

export interface WebGLRenderer2DSize extends Renderer2DSize {
  readonly width: number;
  readonly height: number;
}

export interface WebGLRenderer2DState {
  readonly stats: WebGLRenderStats;
}

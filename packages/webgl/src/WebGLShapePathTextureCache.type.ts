import type { ShapePath } from "raw2d-core";
import type { Texture } from "raw2d-sprite";

export interface WebGLShapePathTextureCacheOptions {
  readonly createCanvas?: WebGLShapePathCanvasFactory;
  readonly maxEntries?: number;
  readonly padding?: number;
}

export interface WebGLShapePathTextureEntry {
  readonly texture: Texture;
  readonly key: string;
  readonly localX: number;
  readonly localY: number;
  readonly width: number;
  readonly height: number;
}

export interface WebGLShapePathTextureCacheStats {
  readonly size: number;
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
  readonly retired: number;
}

export type WebGLShapePathCanvasFactory = (width: number, height: number) => HTMLCanvasElement;

export type WebGLShapePathTextureProvider = (shapePath: ShapePath) => WebGLShapePathTextureEntry;

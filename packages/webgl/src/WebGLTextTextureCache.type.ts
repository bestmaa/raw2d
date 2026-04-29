import type { Texture } from "raw2d-sprite";

export interface WebGLTextTextureCacheOptions {
  readonly createCanvas?: WebGLTextCanvasFactory;
  readonly maxEntries?: number;
  readonly padding?: number;
}

export interface WebGLTextTextureEntry {
  readonly texture: Texture;
  readonly key: string;
  readonly localX: number;
  readonly localY: number;
  readonly width: number;
  readonly height: number;
}

export interface WebGLTextTextureCacheStats {
  readonly size: number;
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
  readonly retired: number;
}

export type WebGLTextCanvasFactory = (width: number, height: number) => HTMLCanvasElement;

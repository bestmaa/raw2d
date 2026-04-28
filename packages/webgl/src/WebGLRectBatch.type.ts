import type { Camera2D, Rect, RenderItem } from "raw2d-core";

export interface WebGLRectBatchOptions {
  readonly items: readonly RenderItem[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
}

export interface WebGLRectBatch {
  readonly vertices: Float32Array;
  readonly rects: number;
  readonly unsupported: number;
}

export type WebGLRectItem = RenderItem<Rect>;


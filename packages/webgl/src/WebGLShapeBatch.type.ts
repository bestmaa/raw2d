import type { Camera2D, Circle, Ellipse, Rect, RenderItem } from "raw2d-core";

export interface WebGLShapeBatchOptions {
  readonly items: readonly RenderItem[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly curveSegments?: number;
}

export interface WebGLShapeBatch {
  readonly vertices: Float32Array;
  readonly rects: number;
  readonly circles: number;
  readonly ellipses: number;
  readonly unsupported: number;
}

export type WebGLShapeItem = RenderItem<Circle | Ellipse | Rect>;


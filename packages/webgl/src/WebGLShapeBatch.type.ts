import type { Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, RenderItem } from "raw2d-core";
import type { WebGLDrawBatch } from "./WebGLDrawBatch.type.js";
import type { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";

export interface WebGLShapeBatchOptions {
  readonly items: readonly RenderItem[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly curveSegments?: number;
  readonly floatBuffer?: WebGLFloatBuffer;
}

export interface WebGLShapeBatch {
  readonly vertices: Float32Array;
  readonly drawBatches: readonly WebGLDrawBatch[];
  readonly rects: number;
  readonly circles: number;
  readonly ellipses: number;
  readonly lines: number;
  readonly polylines: number;
  readonly polygons: number;
  readonly unsupported: number;
}

export type WebGLShapeItem = RenderItem<Circle | Ellipse | Line | Polygon | Polyline | Rect>;

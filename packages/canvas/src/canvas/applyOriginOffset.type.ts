import type { Object2D } from "raw2d-core";

export interface ApplyOriginOffsetOptions {
  readonly context: CanvasRenderingContext2D;
  readonly object: Object2D;
  readonly localX: number;
  readonly localY: number;
  readonly width: number;
  readonly height: number;
}

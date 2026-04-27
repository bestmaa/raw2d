import type { Polyline } from "raw2d-core";

export interface DrawPolylineOptions {
  readonly context: CanvasRenderingContext2D;
  readonly polyline: Polyline;
}

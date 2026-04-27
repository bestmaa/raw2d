import type { Polygon } from "raw2d-core";

export interface DrawPolygonOptions {
  readonly context: CanvasRenderingContext2D;
  readonly polygon: Polygon;
}

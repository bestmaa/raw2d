import type { ShapePath } from "raw2d-core";

export interface DrawShapePathOptions {
  readonly context: CanvasRenderingContext2D;
  readonly shapePath: ShapePath;
}

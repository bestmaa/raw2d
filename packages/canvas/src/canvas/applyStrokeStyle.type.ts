import type { BasicMaterial } from "raw2d-core";

export interface ApplyStrokeStyleOptions {
  readonly context: CanvasRenderingContext2D;
  readonly material: BasicMaterial;
}

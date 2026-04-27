import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface EllipseOptions extends Object2DOptions {
  readonly radiusX: number;
  readonly radiusY: number;
  readonly material?: BasicMaterial;
}

export interface EllipseSize {
  readonly radiusX: number;
  readonly radiusY: number;
  readonly width: number;
  readonly height: number;
}

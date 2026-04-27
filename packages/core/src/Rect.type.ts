import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface RectOptions extends Object2DOptions {
  readonly width: number;
  readonly height: number;
  readonly material?: BasicMaterial;
}

export interface RectSize {
  readonly width: number;
  readonly height: number;
}

import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface CircleOptions extends Object2DOptions {
  readonly radius: number;
  readonly material?: BasicMaterial;
}

export interface CircleSize {
  readonly radius: number;
  readonly diameter: number;
}

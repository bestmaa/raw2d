import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface PolylinePoint {
  readonly x: number;
  readonly y: number;
}

export interface PolylineOptions extends Object2DOptions {
  readonly points: readonly PolylinePoint[];
  readonly material?: BasicMaterial;
}

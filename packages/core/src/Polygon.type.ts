import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface PolygonPoint {
  readonly x: number;
  readonly y: number;
}

export interface PolygonOptions extends Object2DOptions {
  readonly points: readonly PolygonPoint[];
  readonly material?: BasicMaterial;
}

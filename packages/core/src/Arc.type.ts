import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";

export interface ArcOptions extends Object2DOptions {
  readonly radiusX: number;
  readonly radiusY: number;
  readonly startAngle: number;
  readonly endAngle: number;
  readonly anticlockwise?: boolean;
  readonly closed?: boolean;
  readonly material?: BasicMaterial;
}

export interface ArcAngles {
  readonly startAngle: number;
  readonly endAngle: number;
  readonly anticlockwise: boolean;
}

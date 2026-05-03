import type { BasicMaterialStrokeCap, BasicMaterialStrokeJoin } from "raw2d";

export interface RawMaterialProps {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
  readonly strokeCap?: BasicMaterialStrokeCap;
  readonly strokeJoin?: BasicMaterialStrokeJoin;
  readonly miterLimit?: number;
}

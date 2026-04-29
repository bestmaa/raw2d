export type BasicMaterialStrokeCap = "butt" | "round" | "square";

export type BasicMaterialStrokeJoin = "bevel" | "miter" | "round";

export interface BasicMaterialOptions {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
  readonly strokeCap?: BasicMaterialStrokeCap;
  readonly strokeJoin?: BasicMaterialStrokeJoin;
  readonly miterLimit?: number;
}

export interface BasicMaterialDirtyState {
  readonly version: number;
  readonly dirty: boolean;
}

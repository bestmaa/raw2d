import type { Object2DOptions } from "../core";
import type { BasicMaterial } from "../materials";

export interface RectOptions extends Object2DOptions {
  readonly width: number;
  readonly height: number;
  readonly material?: BasicMaterial;
}

export interface RectSize {
  readonly width: number;
  readonly height: number;
}

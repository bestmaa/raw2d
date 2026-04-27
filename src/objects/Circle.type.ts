import type { Object2DOptions } from "../core";
import type { BasicMaterial } from "../materials";

export interface CircleOptions extends Object2DOptions {
  readonly radius: number;
  readonly material?: BasicMaterial;
}

export interface CircleSize {
  readonly radius: number;
  readonly diameter: number;
}

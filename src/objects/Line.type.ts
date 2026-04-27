import type { Object2DOptions } from "../core";
import type { BasicMaterial } from "../materials";

export interface LineOptions extends Object2DOptions {
  readonly startX?: number;
  readonly startY?: number;
  readonly endX: number;
  readonly endY: number;
  readonly material?: BasicMaterial;
}

export interface LinePoints {
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

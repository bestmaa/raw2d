import type { Object2DOptions } from "../core";
import type { BasicMaterial } from "../materials";

export interface Text2DOptions extends Object2DOptions {
  readonly text: string;
  readonly font?: string;
  readonly align?: CanvasTextAlign;
  readonly baseline?: CanvasTextBaseline;
  readonly material?: BasicMaterial;
}

export interface Text2DStyle {
  readonly font: string;
  readonly align: CanvasTextAlign;
  readonly baseline: CanvasTextBaseline;
}

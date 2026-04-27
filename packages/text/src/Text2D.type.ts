import type { BasicMaterial, Object2DOptions } from "raw2d-core";

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

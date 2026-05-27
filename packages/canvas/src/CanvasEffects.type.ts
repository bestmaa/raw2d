import type { Object2D } from "raw2d-core";
import type { Raw2DEffect } from "raw2d-effects";

export type CanvasEffectProvider = (object: Object2D) => readonly Raw2DEffect[];

export interface ApplyCanvasEffectsOptions {
  readonly context: CanvasRenderingContext2D;
  readonly effects: readonly Raw2DEffect[];
}

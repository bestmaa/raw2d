import type { Sprite } from "raw2d-sprite";

export interface DrawSpriteOptions {
  readonly context: CanvasRenderingContext2D;
  readonly sprite: Sprite;
}

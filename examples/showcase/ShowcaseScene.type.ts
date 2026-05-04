import type { Camera2D, Rect, Scene, Sprite } from "raw2d";

export interface ShowcaseSceneResult {
  readonly camera: Camera2D;
  readonly scene: Scene;
  readonly animatedSprites: readonly Sprite[];
  readonly interactiveRect: Rect;
  readonly objectCount: number;
  readonly shapeCount: number;
  readonly spriteCount: number;
  readonly staticSprites: readonly Sprite[];
  readonly worldHeight: number;
  readonly worldWidth: number;
}

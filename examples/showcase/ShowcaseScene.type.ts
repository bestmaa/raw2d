import type { Camera2D, Scene, Sprite } from "raw2d";

export interface ShowcaseSceneResult {
  readonly camera: Camera2D;
  readonly scene: Scene;
  readonly animatedSprites: readonly Sprite[];
  readonly objectCount: number;
  readonly shapeCount: number;
  readonly spriteCount: number;
  readonly worldHeight: number;
  readonly worldWidth: number;
}

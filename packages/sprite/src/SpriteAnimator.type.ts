import type { Sprite } from "./Sprite.js";
import type { SpriteAnimationClip } from "./SpriteAnimationClip.js";

export interface SpriteAnimatorOptions {
  readonly sprite: Sprite;
  readonly clip: SpriteAnimationClip;
  readonly autoplay?: boolean;
}

export interface SpriteAnimatorSnapshot {
  readonly playing: boolean;
  readonly frameIndex: number;
  readonly elapsed: number;
  readonly clip: SpriteAnimationClip;
}

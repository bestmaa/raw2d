import type { TextureFrame } from "./TextureAtlas.type.js";

export interface SpriteAnimationClipOptions {
  readonly frames: readonly TextureFrame[];
  readonly fps: number;
  readonly loop?: boolean;
  readonly name?: string;
}

export interface SpriteAnimationClipSnapshot {
  readonly name: string | null;
  readonly frameCount: number;
  readonly fps: number;
  readonly loop: boolean;
  readonly duration: number;
}

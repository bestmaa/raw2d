import type { Sprite } from "raw2d-sprite";

export type WebGLSpriteBatchTextureKey<TSprite extends Sprite = Sprite> = (sprite: TSprite) => string;

export interface SortWebGLSpritesForBatchingOptions<TSprite extends Sprite = Sprite> {
  readonly sprites: readonly TSprite[];
  readonly getTextureKey?: WebGLSpriteBatchTextureKey<TSprite>;
}

export interface EstimateWebGLSpriteTextureBindsOptions<TSprite extends Sprite = Sprite> {
  readonly sprites: readonly TSprite[];
  readonly getTextureKey?: WebGLSpriteBatchTextureKey<TSprite>;
}


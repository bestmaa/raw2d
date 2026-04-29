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

export interface AnalyzeWebGLSpriteBatchingOptions<TSprite extends Sprite = Sprite> {
  readonly sprites: readonly TSprite[];
  readonly getTextureKey?: WebGLSpriteBatchTextureKey<TSprite>;
}

export interface WebGLSpriteTextureGroup {
  readonly key: string;
  readonly count: number;
}

export interface WebGLSpriteBatchingReport {
  readonly spriteCount: number;
  readonly textureGroupCount: number;
  readonly currentTextureBinds: number;
  readonly sortedTextureBinds: number;
  readonly potentialReduction: number;
  readonly averageSpritesPerCurrentBind: number;
  readonly averageSpritesPerSortedBind: number;
  readonly textureGroups: readonly WebGLSpriteTextureGroup[];
}

import type { Sprite } from "raw2d-sprite";
import type {
  EstimateWebGLSpriteTextureBindsOptions,
  SortWebGLSpritesForBatchingOptions,
  WebGLSpriteBatchTextureKey
} from "./WebGLSpriteBatchingStrategy.type.js";

interface IndexedSprite<TSprite extends Sprite> {
  readonly sprite: TSprite;
  readonly index: number;
}

export function sortWebGLSpritesForBatching<TSprite extends Sprite>(
  options: SortWebGLSpritesForBatchingOptions<TSprite>
): readonly TSprite[] {
  const getTextureKey = options.getTextureKey ?? getDefaultTextureKey;

  return options.sprites
    .map((sprite, index): IndexedSprite<TSprite> => ({ sprite, index }))
    .sort((first, second) => compareSprites(first, second, getTextureKey))
    .map((entry) => entry.sprite);
}

export function estimateWebGLSpriteTextureBinds<TSprite extends Sprite>(
  options: EstimateWebGLSpriteTextureBindsOptions<TSprite>
): number {
  const getTextureKey = options.getTextureKey ?? getDefaultTextureKey;
  let binds = 0;
  let lastKey: string | null = null;

  for (const sprite of options.sprites) {
    const key = createBatchKey(sprite, getTextureKey);

    if (key !== lastKey) {
      binds += 1;
      lastKey = key;
    }
  }

  return binds;
}

function compareSprites<TSprite extends Sprite>(
  first: IndexedSprite<TSprite>,
  second: IndexedSprite<TSprite>,
  getTextureKey: WebGLSpriteBatchTextureKey<TSprite>
): number {
  return (
    first.sprite.zIndex - second.sprite.zIndex ||
    compareStrings(first.sprite.renderMode, second.sprite.renderMode) ||
    compareStrings(getTextureKey(first.sprite), getTextureKey(second.sprite)) ||
    first.index - second.index
  );
}

function createBatchKey<TSprite extends Sprite>(sprite: TSprite, getTextureKey: WebGLSpriteBatchTextureKey<TSprite>): string {
  return `${sprite.zIndex}:${sprite.renderMode}:${getTextureKey(sprite)}`;
}

function getDefaultTextureKey(sprite: Sprite): string {
  return sprite.texture.id;
}

function compareStrings(first: string, second: string): number {
  return first < second ? -1 : first > second ? 1 : 0;
}


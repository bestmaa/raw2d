import { Sprite, type Texture } from "raw2d-sprite";
import { analyzeWebGLSpriteBatching } from "./WebGLSpriteBatchingStrategy.js";
import { isWebGLTextureDisposed } from "./isWebGLTextureDisposed.js";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export function trackWebGLSpriteRunDiagnostics(
  run: WebGLRenderRun,
  getTextureKey: (texture: Texture) => string,
  stats: MutableWebGLRenderStats
): void {
  const sprites = run.items
    .map((item) => item.object)
    .filter((object): object is Sprite => object instanceof Sprite);
  const activeSprites = sprites.filter((sprite) => !isWebGLTextureDisposed(sprite.texture));
  const report = analyzeWebGLSpriteBatching({
    sprites: activeSprites,
    getTextureKey: (sprite) => getTextureKey(sprite.texture)
  });

  stats.skippedSpriteTextures += sprites.length - activeSprites.length;
  stats.spriteTextureGroups += report.textureGroupCount;
  stats.spriteTextureBinds += report.currentTextureBinds;
  stats.sortedSpriteTextureBinds += report.sortedTextureBinds;
  stats.spriteTextureBindReduction += report.potentialReduction;
}

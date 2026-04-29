import type { RenderItem } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import { sortWebGLSpritesForBatching } from "./WebGLSpriteBatchingStrategy.js";
import type { ApplyWebGLSpriteSortingOptions } from "./applyWebGLSpriteSorting.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export function applyWebGLSpriteSorting(options: ApplyWebGLSpriteSortingOptions): readonly WebGLRenderRun[] {
  if (options.mode !== "texture") {
    return options.runs;
  }

  return options.runs.map((run) => (canSortSpriteRun(run) ? sortSpriteRun(run, options) : run));
}

function canSortSpriteRun(run: WebGLRenderRun): boolean {
  return run.kind === "sprite" && run.items.every((item) => item.object instanceof Sprite);
}

function sortSpriteRun(run: WebGLRenderRun, options: ApplyWebGLSpriteSortingOptions): WebGLRenderRun {
  const items = run.items as readonly RenderItem<Sprite>[];
  const itemByObject = new Map<Sprite, RenderItem<Sprite>>();
  const sortedSprites = sortWebGLSpritesForBatching({
    sprites: items.map((item) => item.object),
    getTextureKey: (sprite) => options.getTextureKey(sprite.texture)
  });

  for (const item of items) {
    itemByObject.set(item.object, item);
  }

  return {
    ...run,
    items: sortedSprites.map((sprite) => itemByObject.get(sprite)).filter(isRenderItem)
  };
}

function isRenderItem(item: RenderItem<Sprite> | undefined): item is RenderItem<Sprite> {
  return item !== undefined;
}

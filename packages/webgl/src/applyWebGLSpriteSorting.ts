import type { RenderItem } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
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

  return {
    ...run,
    items: sortConsecutiveGroups(items, options)
  };
}

function sortConsecutiveGroups(
  items: readonly RenderItem<Sprite>[],
  options: ApplyWebGLSpriteSortingOptions
): readonly RenderItem<Sprite>[] {
  const sorted: RenderItem<Sprite>[] = [];
  let group: RenderItem<Sprite>[] = [];

  for (const item of items) {
    if (group.length > 0 && !isSameSortBoundary(group[0], item)) {
      sorted.push(...sortGroup(group, options));
      group = [];
    }

    group.push(item);
  }

  sorted.push(...sortGroup(group, options));
  return sorted;
}

function isSameSortBoundary(first: RenderItem<Sprite>, second: RenderItem<Sprite>): boolean {
  return first.zIndex === second.zIndex && first.object.renderMode === second.object.renderMode;
}

function sortGroup(
  group: readonly RenderItem<Sprite>[],
  options: ApplyWebGLSpriteSortingOptions
): readonly RenderItem<Sprite>[] {
  return group
    .map((item, index) => ({ item, index }))
    .sort((first, second) => compareTextureKeys(first.item, second.item, options) || first.index - second.index)
    .map((entry) => entry.item);
}

function compareTextureKeys(
  first: RenderItem<Sprite>,
  second: RenderItem<Sprite>,
  options: ApplyWebGLSpriteSortingOptions
): number {
  const firstKey = options.getTextureKey(first.object.texture);
  const secondKey = options.getTextureKey(second.object.texture);
  return firstKey < secondKey ? -1 : firstKey > secondKey ? 1 : 0;
}

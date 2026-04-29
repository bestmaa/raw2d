import type {
  TextureAtlasPackerItem,
  TextureAtlasPackerSort,
  TextureAtlasPackerStatsFrame
} from "./TextureAtlasPacker.type.js";

type TextureAtlasPackerItemSizeGetter = (item: TextureAtlasPackerItem) => TextureAtlasPackerStatsFrame;

export function sortTextureAtlasPackerItems(
  items: readonly TextureAtlasPackerItem[],
  sort: TextureAtlasPackerSort,
  getSize: TextureAtlasPackerItemSizeGetter
): readonly TextureAtlasPackerItem[] {
  if (sort === "none") {
    return [...items];
  }

  return items
    .map((item, index) => ({ item, index, size: getSize(item) }))
    .sort((left, right) => compareItems(left, right, sort))
    .map((entry) => entry.item);
}

function compareItems(
  left: { readonly index: number; readonly size: TextureAtlasPackerStatsFrame },
  right: { readonly index: number; readonly size: TextureAtlasPackerStatsFrame },
  sort: TextureAtlasPackerSort
): number {
  const primary = sort === "area"
    ? right.size.width * right.size.height - left.size.width * left.size.height
    : right.size.height - left.size.height;

  return primary === 0 ? left.index - right.index : primary;
}

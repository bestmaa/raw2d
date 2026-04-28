import type { Object2D } from "./Object2D.js";
import type { SortRenderObjectsOptions } from "./sortRenderObjects.type.js";

interface IndexedObject<TObject extends Object2D> {
  readonly object: TObject;
  readonly index: number;
}

export function sortRenderObjects<TObject extends Object2D>(
  options: SortRenderObjectsOptions<TObject>
): readonly TObject[] {
  return options.objects
    .map((object, index): IndexedObject<TObject> => ({ object, index }))
    .sort(compareIndexedObjects)
    .map((entry) => entry.object);
}

function compareIndexedObjects<TObject extends Object2D>(first: IndexedObject<TObject>, second: IndexedObject<TObject>): number {
  const zIndexDiff = first.object.zIndex - second.object.zIndex;

  if (zIndexDiff !== 0) {
    return zIndexDiff;
  }

  return first.index - second.index;
}

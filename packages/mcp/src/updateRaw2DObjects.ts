import { updateRaw2DObjectMaterial } from "./updateRaw2DObjectMaterial.js";
import { updateRaw2DObjectTransform } from "./updateRaw2DObjectTransform.js";
import type { UpdateRaw2DObjectsOptions, UpdateRaw2DObjectsResult } from "./updateRaw2DObjects.type.js";

export function updateRaw2DObjects(options: UpdateRaw2DObjectsOptions): UpdateRaw2DObjectsResult {
  let document = options.document;
  const updatedIds = new Set<string>();

  for (const update of options.transforms ?? []) {
    document = updateRaw2DObjectTransform({
      document,
      id: update.id,
      transform: update.transform
    });
    updatedIds.add(update.id);
  }

  for (const update of options.materials ?? []) {
    document = updateRaw2DObjectMaterial({
      document,
      id: update.id,
      material: update.material
    });
    updatedIds.add(update.id);
  }

  return {
    document,
    updatedIds: [...updatedIds]
  };
}

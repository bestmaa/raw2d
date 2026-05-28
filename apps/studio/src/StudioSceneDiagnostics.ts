import type { StudioSceneState } from "./StudioSceneState.type";

export function validateStudioAssetReferences(scene: StudioSceneState): readonly string[] {
  const assetIds = new Set(scene.assets.map((asset) => asset.id));
  const objects = flattenObjects(scene.objects);
  const objectIds = new Set(objects.map((object) => object.id));
  const warnings: string[] = [];

  for (const object of objects) {
    if (object.type === "sprite" && object.assetSlot !== "empty" && !assetIds.has(object.assetSlot)) {
      warnings.push(`Sprite ${object.id} references missing asset ${object.assetSlot}.`);
    }
  }

  for (const asset of scene.assets) {
    for (const objectId of asset.objectIds) {
      if (!objectIds.has(objectId)) {
        warnings.push(`Asset ${asset.id} references missing object ${objectId}.`);
      }
    }
  }

  return warnings;
}

function flattenObjects(objects: StudioSceneState["objects"]): StudioSceneState["objects"] {
  return objects.flatMap((object) => object.type === "group" ? [object, ...flattenObjects(object.children)] : [object]);
}

import type { StudioSceneState } from "./StudioSceneState.type";

export function validateStudioAssetReferences(scene: StudioSceneState): readonly string[] {
  const assetIds = new Set(scene.assets.map((asset) => asset.id));
  const objectIds = new Set(scene.objects.map((object) => object.id));
  const warnings: string[] = [];

  for (const object of scene.objects) {
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

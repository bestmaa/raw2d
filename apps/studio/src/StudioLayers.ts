import type { ApplyStudioLayerActionOptions, StudioLayerActionResult } from "./StudioLayers.type";
import { getPrimaryStudioSelectionId, normalizeStudioSelection, updateStudioSelection } from "./StudioSelection";
import type { StudioSceneObject } from "./StudioSceneState.type";

export function applyStudioLayerAction(options: ApplyStudioLayerActionOptions): StudioLayerActionResult {
  const index = options.scene.objects.findIndex((object) => object.id === options.objectId);
  const selectedObjectIds = normalizeStudioSelection({
    scene: options.scene,
    selectedObjectIds: options.selectedObjectIds ?? (options.selectedObjectId ? [options.selectedObjectId] : [])
  });

  if (index === -1) {
    return { scene: options.scene, selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds), selectedObjectIds, handled: false };
  }

  if (options.action === "select") {
    const selection = updateStudioSelection({
      scene: options.scene,
      selectedObjectIds,
      objectId: options.objectId,
      additive: options.additiveSelection ?? false
    });
    return {
      scene: options.scene,
      selectedObjectId: getPrimaryStudioSelectionId(selection),
      selectedObjectIds: selection,
      handled: true
    };
  }

  if (options.action === "toggle-visibility") {
    return {
      scene: {
        ...options.scene,
        objects: options.scene.objects.map((object) =>
          object.id === options.objectId ? { ...object, visible: !(object.visible ?? true) } : object
        )
      },
      selectedObjectId: options.objectId,
      selectedObjectIds: [options.objectId],
      handled: true
    };
  }

  return moveLayer(options, index, selectedObjectIds);
}

function moveLayer(
  options: ApplyStudioLayerActionOptions,
  index: number,
  selectedObjectIds: readonly string[]
): StudioLayerActionResult {
  const direction = options.action === "move-up" ? -1 : 1;
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= options.scene.objects.length) {
    return { scene: options.scene, selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds), selectedObjectIds, handled: false };
  }

  const objects = [...options.scene.objects];
  const current = objects[index];
  const target = objects[targetIndex];

  if (!current || !target) {
    return { scene: options.scene, selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds), selectedObjectIds, handled: false };
  }

  objects[index] = target;
  objects[targetIndex] = current;

  return {
    scene: { ...options.scene, objects: objects as readonly StudioSceneObject[] },
    selectedObjectId: options.objectId,
    selectedObjectIds: [options.objectId],
    handled: true
  };
}

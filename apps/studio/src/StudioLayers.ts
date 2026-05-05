import type { ApplyStudioLayerActionOptions, StudioLayerActionResult } from "./StudioLayers.type";
import type { StudioSceneObject } from "./StudioSceneState.type";

export function applyStudioLayerAction(options: ApplyStudioLayerActionOptions): StudioLayerActionResult {
  const index = options.scene.objects.findIndex((object) => object.id === options.objectId);

  if (index === -1) {
    return { scene: options.scene, selectedObjectId: options.selectedObjectId, handled: false };
  }

  if (options.action === "select") {
    return { scene: options.scene, selectedObjectId: options.objectId, handled: true };
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
      handled: true
    };
  }

  return moveLayer(options, index);
}

function moveLayer(options: ApplyStudioLayerActionOptions, index: number): StudioLayerActionResult {
  const direction = options.action === "move-up" ? -1 : 1;
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= options.scene.objects.length) {
    return { scene: options.scene, selectedObjectId: options.selectedObjectId, handled: false };
  }

  const objects = [...options.scene.objects];
  const current = objects[index];
  const target = objects[targetIndex];

  if (!current || !target) {
    return { scene: options.scene, selectedObjectId: options.selectedObjectId, handled: false };
  }

  objects[index] = target;
  objects[targetIndex] = current;

  return {
    scene: { ...options.scene, objects: objects as readonly StudioSceneObject[] },
    selectedObjectId: options.objectId,
    handled: true
  };
}

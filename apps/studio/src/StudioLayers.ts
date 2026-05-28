import type { ApplyStudioLayerActionOptions, StudioLayerActionResult } from "./StudioLayers.type";
import { findStudioSceneObject, mapStudioSceneObjects } from "./StudioSceneGraph";
import { getPrimaryStudioSelectionId, normalizeStudioSelection, updateStudioSelection } from "./StudioSelection";
import type { StudioGroupState, StudioSceneObject } from "./StudioSceneState.type";

export function applyStudioLayerAction(options: ApplyStudioLayerActionOptions): StudioLayerActionResult {
  const entry = findStudioSceneObject(options.scene, options.objectId);
  const selectedObjectIds = normalizeStudioSelection({
    scene: options.scene,
    selectedObjectIds: options.selectedObjectIds ?? (options.selectedObjectId ? [options.selectedObjectId] : [])
  });

  if (!entry) {
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
        objects: mapStudioSceneObjects(options.scene.objects, (object) =>
          object.id === options.objectId ? { ...object, visible: !(object.visible ?? true) } : object
        )
      },
      selectedObjectId: options.objectId,
      selectedObjectIds: [options.objectId],
      handled: true
    };
  }

  return moveLayer(options, entry.index, selectedObjectIds, entry.parentId);
}

function moveLayer(
  options: ApplyStudioLayerActionOptions,
  index: number,
  selectedObjectIds: readonly string[],
  parentId: string | undefined
): StudioLayerActionResult {
  const direction = options.action === "move-up" ? -1 : 1;
  const targetIndex = index + direction;

  const siblings = parentId
    ? (findStudioSceneObject(options.scene, parentId)?.object as StudioGroupState | undefined)?.children
    : options.scene.objects;

  if (!siblings || targetIndex < 0 || targetIndex >= siblings.length) {
    return { scene: options.scene, selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds), selectedObjectIds, handled: false };
  }

  const objects = [...siblings];
  const current = objects[index];
  const target = objects[targetIndex];

  if (!current || !target) {
    return { scene: options.scene, selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds), selectedObjectIds, handled: false };
  }

  objects[index] = target;
  objects[targetIndex] = current;

  return {
    scene: parentId
      ? replaceGroupChildren(options, parentId, objects)
      : { ...options.scene, objects: objects as readonly StudioSceneObject[] },
    selectedObjectId: options.objectId,
    selectedObjectIds: [options.objectId],
    handled: true
  };
}

function replaceGroupChildren(
  options: ApplyStudioLayerActionOptions,
  parentId: string,
  children: readonly StudioSceneObject[]
): ApplyStudioLayerActionOptions["scene"] {
  return {
    ...options.scene,
    objects: mapStudioSceneObjects(options.scene.objects, (object) =>
      object.id === parentId && object.type === "group" ? { ...object, children } : object
    )
  };
}

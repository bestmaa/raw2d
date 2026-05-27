import { pickStudioObjectId } from "./StudioDrag";
import type { StudioPoint } from "./StudioDrag.type";
import type { MoveStudioObjectsOptions, StudioMultiDragStart } from "./StudioMultiDrag.type";
import { normalizeStudioSelection } from "./StudioSelection";
import type { StudioSceneState } from "./StudioSceneState.type";

export function startStudioMultiDrag(
  scene: StudioSceneState,
  selectedObjectIds: readonly string[],
  pointer: StudioPoint
): StudioMultiDragStart | undefined {
  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  const pickedId = pickStudioObjectId(scene, pointer);

  if (selection.length < 2 || !pickedId || !selection.includes(pickedId)) {
    return undefined;
  }

  return {
    selectedObjectIds: selection,
    session: {
      objectIds: selection,
      startPointer: pointer,
      startObjects: scene.objects.filter((object) => selection.includes(object.id)).map((object) => ({ ...object }))
    }
  };
}

export function moveStudioObjects(options: MoveStudioObjectsOptions): StudioSceneState {
  const deltaX = options.pointer.x - options.session.startPointer.x;
  const deltaY = options.pointer.y - options.session.startPointer.y;

  return {
    ...options.scene,
    objects: options.scene.objects.map((object) => {
      const startObject = options.session.startObjects.find((candidate) => candidate.id === object.id);

      if (!startObject) {
        return object;
      }

      return {
        ...object,
        x: Math.round(startObject.x + deltaX),
        y: Math.round(startObject.y + deltaY)
      };
    })
  };
}

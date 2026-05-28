import type { StudioGroupingCommandResult } from "./StudioGroupingCommands.type";
import { groupStudioObjects, ungroupStudioObject } from "./StudioGrouping";
import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioGroupCommand(
  scene: StudioSceneState,
  selectedObjectIds: readonly string[]
): StudioGroupingCommandResult | undefined {
  const result = groupStudioObjects(scene, selectedObjectIds);
  return result
    ? {
        command: { kind: "replace-objects", before: scene.objects, after: result.scene.objects },
        options: {
          selectedObjectId: result.groupId,
          selectedObjectIds: [result.groupId],
          statusMessage: "Grouped objects"
        }
      }
    : undefined;
}

export function createStudioUngroupCommand(
  scene: StudioSceneState,
  selectedObjectId: string | undefined
): StudioGroupingCommandResult | undefined {
  const result = ungroupStudioObject(scene, selectedObjectId);
  return result
    ? {
        command: { kind: "replace-objects", before: scene.objects, after: result.scene.objects },
        options: {
          selectedObjectId: result.childIds.at(-1),
          selectedObjectIds: result.childIds,
          statusMessage: "Ungrouped objects"
        }
      }
    : undefined;
}

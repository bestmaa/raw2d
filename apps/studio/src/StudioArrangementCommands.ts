import { alignStudioSelection, distributeStudioSelection, duplicateStudioSelection, snapStudioSelection } from "./StudioArrangement";
import type { StudioArrangementAction, StudioArrangementCommandResult } from "./StudioArrangement.type";
import { createStudioTransformBatchCommand } from "./StudioCommandFactory";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";
import { normalizeStudioSelection } from "./StudioSelection";

export function createStudioArrangementCommand(
  scene: StudioSceneState,
  selectedObjectIds: readonly string[],
  action: StudioArrangementAction
): StudioArrangementCommandResult | undefined {
  if (action === "duplicate") {
    return createDuplicateCommand(scene, selectedObjectIds);
  }

  const afterScene = createArrangedScene(scene, selectedObjectIds, action);
  if (!afterScene) return undefined;

  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  const command = createStudioTransformBatchCommand(getSelectedObjects(scene, selection), afterScene);
  return command ? { command, options: { selectedObjectIds: selection, statusMessage: getStatus(action) } } : undefined;
}

function createDuplicateCommand(scene: StudioSceneState, selectedObjectIds: readonly string[]): StudioArrangementCommandResult | undefined {
  const result = duplicateStudioSelection(scene, selectedObjectIds);
  if (!result) return undefined;

  return {
    command: {
      kind: "replace-objects",
      before: scene.objects,
      after: result.scene.objects,
      beforeAssets: scene.assets,
      afterAssets: result.scene.assets
    },
    options: {
      selectedObjectId: result.selectedObjectIds.at(-1),
      selectedObjectIds: result.selectedObjectIds,
      statusMessage: "Duplicated selection"
    }
  };
}

function createArrangedScene(
  scene: StudioSceneState,
  selectedObjectIds: readonly string[],
  action: StudioArrangementAction
): StudioSceneState | undefined {
  if (action === "distribute-horizontal") return distributeStudioSelection(scene, selectedObjectIds, "horizontal");
  if (action === "distribute-vertical") return distributeStudioSelection(scene, selectedObjectIds, "vertical");
  if (action === "snap-grid") return snapStudioSelection(scene, selectedObjectIds);
  return alignStudioSelection(scene, selectedObjectIds, action);
}

function getSelectedObjects(scene: StudioSceneState, selectedObjectIds: readonly string[]): readonly StudioSceneObject[] {
  return flattenStudioSceneObjects(scene)
    .filter((entry) => selectedObjectIds.includes(entry.object.id))
    .map((entry) => entry.object);
}

function getStatus(action: StudioArrangementAction): string {
  if (action === "snap-grid") return "Snapped selection";
  if (action.startsWith("distribute")) return "Distributed selection";
  return "Aligned selection";
}

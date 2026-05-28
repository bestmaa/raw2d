import type { StudioCommand } from "./StudioCommand.type";
import { createStudioDeleteObjectsCommand, createStudioTransformBatchCommand, createStudioTransformCommand, findStudioObject } from "./StudioCommandFactory";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioKeyboardCommand(options: {
  readonly beforeScene: StudioSceneState;
  readonly afterScene: StudioSceneState;
  readonly key: string;
  readonly selectedObjectId?: string;
  readonly selectedObjectIds: readonly string[];
}): StudioCommand | undefined {
  if (options.key === "Delete" || options.key === "Backspace") {
    return createStudioDeleteObjectsCommand(options.beforeScene, options.selectedObjectIds);
  }

  if (options.selectedObjectIds.length > 1) {
    const beforeObjects = flattenStudioSceneObjects(options.beforeScene)
      .filter((entry) => options.selectedObjectIds.includes(entry.object.id))
      .map((entry) => entry.object);
    return createStudioTransformBatchCommand(beforeObjects, options.afterScene);
  }

  const before = findStudioObject(options.beforeScene, options.selectedObjectId);
  const after = findStudioObject(options.afterScene, options.selectedObjectId);
  return before && after ? createStudioTransformCommand(before, after) : undefined;
}

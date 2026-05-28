import { pasteStudioClipboard } from "./StudioClipboard";
import type { StudioCommand, StudioCommandApplyOptions } from "./StudioCommand.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioClipboardCommandResult {
  readonly command: StudioCommand;
  readonly options: StudioCommandApplyOptions;
}

export function createStudioPasteCommand(scene: StudioSceneState, text: string): StudioClipboardCommandResult | undefined {
  const result = pasteStudioClipboard(scene, text);
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
      statusMessage: "Pasted selection"
    }
  };
}

import type { StudioSceneState } from "./StudioSceneState.type";
import type { ApplyStudioEditorCommand } from "./StudioCommand.type";

export interface StudioAssetBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly getSelectedAssetId: () => string | undefined;
  readonly getSelectedObjectId: () => string | undefined;
  readonly setSelectedAssetId: (assetId: string | undefined) => void;
  readonly applyCommand: ApplyStudioEditorCommand;
  readonly setStatusMessage: (message: string) => void;
  readonly mount: () => void;
  readonly urlRef?: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
}

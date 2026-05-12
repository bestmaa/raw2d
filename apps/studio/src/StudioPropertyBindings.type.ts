import type { StudioSceneState } from "./StudioSceneState.type";
import type { ApplyStudioEditorCommand } from "./StudioCommand.type";

export interface StudioPropertyBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly getSelectedObjectId: () => string | undefined;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly applyCommand: ApplyStudioEditorCommand;
  readonly renderRuntimeScene: () => void;
}

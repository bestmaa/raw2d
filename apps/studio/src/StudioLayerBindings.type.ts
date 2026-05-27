import type { StudioSceneState } from "./StudioSceneState.type";
import type { ApplyStudioEditorCommand } from "./StudioCommand.type";

export interface StudioLayerBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly getSelectedObjectId: () => string | undefined;
  readonly getSelectedObjectIds: () => readonly string[];
  readonly setScene: (scene: StudioSceneState) => void;
  readonly applyCommand: ApplyStudioEditorCommand;
  readonly setSelectedObjectId: (selectedObjectId: string | undefined) => void;
  readonly setSelectedObjectIds: (selectedObjectIds: readonly string[]) => void;
  readonly mount: () => void;
}

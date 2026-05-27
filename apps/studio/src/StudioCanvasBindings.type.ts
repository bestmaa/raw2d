import type { ApplyStudioEditorCommand } from "./StudioCommand.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioCanvasBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly getSelectedObjectId: () => string | undefined;
  readonly getSelectedObjectIds: () => readonly string[];
  readonly setScene: (scene: StudioSceneState) => void;
  readonly setSelectedObjectId: (selectedObjectId: string | undefined) => void;
  readonly setSelectedObjectIds: (selectedObjectIds: readonly string[]) => void;
  readonly applyCommand: ApplyStudioEditorCommand;
  readonly renderRuntimeScene: () => void;
  readonly mount: () => void;
}

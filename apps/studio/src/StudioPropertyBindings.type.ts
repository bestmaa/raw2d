import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioPropertyBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly getSelectedObjectId: () => string | undefined;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly renderRuntimeScene: () => void;
}

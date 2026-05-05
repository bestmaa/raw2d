import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioLayerBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly getSelectedObjectId: () => string | undefined;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly setSelectedObjectId: (selectedObjectId: string | undefined) => void;
  readonly mount: () => void;
}

import type { StudioRendererMode } from "./StudioRenderer.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioAppActionBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly setRendererMode: (mode: StudioRendererMode) => void;
  readonly setSelectedObjectId: (selectedObjectId: string | undefined) => void;
  readonly mount: () => void;
}

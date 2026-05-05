import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioSceneLoadBindingOptions {
  readonly root: HTMLElement;
  readonly onSceneLoaded: (scene: StudioSceneState) => void;
  readonly onLoadError?: (error: Error) => void;
}

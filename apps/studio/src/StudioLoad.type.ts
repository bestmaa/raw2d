import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioSceneLoadResult {
  readonly scene: StudioSceneState;
  readonly warnings: readonly string[];
}

export interface StudioSceneLoadBindingOptions {
  readonly root: HTMLElement;
  readonly onSceneLoaded: (scene: StudioSceneState) => void;
  readonly onLoadError?: (error: Error) => void;
}

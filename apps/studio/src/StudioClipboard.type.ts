import type { StudioAssetState } from "./StudioAssets.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export interface StudioClipboardPayload {
  readonly format: "raw2d-studio-clipboard";
  readonly version: 1;
  readonly objects: readonly StudioSceneObject[];
  readonly assets: readonly StudioAssetState[];
}

export interface StudioClipboardPasteResult {
  readonly scene: StudioSceneState;
  readonly selectedObjectIds: readonly string[];
}

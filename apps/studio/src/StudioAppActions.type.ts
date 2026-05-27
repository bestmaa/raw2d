import type { StudioRendererMode } from "./StudioRenderer.type";
import type { StudioSceneState } from "./StudioSceneState.type";
import type { StudioAction } from "./StudioActions.type";

export interface StudioAppActionBindingOptions {
  readonly root: HTMLElement;
  readonly getScene: () => StudioSceneState;
  readonly setScene: (scene: StudioSceneState) => void;
  readonly setRendererMode: (mode: StudioRendererMode) => void;
  readonly setSelectedObjectId: (selectedObjectId: string | undefined) => void;
  readonly setSelectedAssetId: (selectedAssetId: string | undefined) => void;
  readonly setStatusMessage: (message: string) => void;
  readonly resetHistory: () => void;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly onCreateObject: (action: StudioAction) => void;
  readonly mount: () => void;
}

import type { StudioRendererMode } from "./StudioRenderer.type";
import type { StudioSceneState } from "./StudioSceneState.type";
import type { StudioStatsPanelModel } from "./StudioStats.type";

export interface StudioRuntimeRenderOptions {
  readonly canvasElement: HTMLCanvasElement;
  readonly sceneState: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly rendererMode: StudioRendererMode;
}

export interface StudioRuntimeRenderResult {
  readonly stats: StudioStatsPanelModel;
}

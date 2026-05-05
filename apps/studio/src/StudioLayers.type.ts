import type { StudioSceneState } from "./StudioSceneState.type";

export type StudioLayerAction = "select" | "toggle-visibility" | "move-up" | "move-down";

export interface ApplyStudioLayerActionOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly objectId: string;
  readonly action: StudioLayerAction;
}

export interface StudioLayerActionResult {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly handled: boolean;
}

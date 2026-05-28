import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioGroupObjectsResult {
  readonly scene: StudioSceneState;
  readonly groupId: string;
}

export interface StudioUngroupObjectResult {
  readonly scene: StudioSceneState;
  readonly childIds: readonly string[];
}

import type { StudioResizeBounds } from "./StudioResize.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioSelectionOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectIds: readonly string[];
}

export interface UpdateStudioSelectionOptions extends StudioSelectionOptions {
  readonly objectId: string | undefined;
  readonly additive: boolean;
}

export interface StudioSelectionBoundsOptions extends StudioSelectionOptions {
  readonly minimumCount?: number;
}

export type StudioSelectionBounds = StudioResizeBounds;

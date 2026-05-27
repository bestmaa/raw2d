import type { StudioPoint } from "./StudioDrag.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export interface StudioMultiDragSession {
  readonly objectIds: readonly string[];
  readonly startPointer: StudioPoint;
  readonly startObjects: readonly StudioSceneObject[];
}

export interface StudioMultiDragStart {
  readonly session: StudioMultiDragSession;
  readonly selectedObjectIds: readonly string[];
}

export interface MoveStudioObjectsOptions {
  readonly scene: StudioSceneState;
  readonly session: StudioMultiDragSession;
  readonly pointer: StudioPoint;
}

import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioPoint {
  readonly x: number;
  readonly y: number;
}

export interface StudioDragSession {
  readonly objectId: string;
  readonly startPointer: StudioPoint;
  readonly startObject: StudioPoint;
}

export interface StudioDragStart {
  readonly session: StudioDragSession;
  readonly selectedObjectId: string;
}

export interface MoveStudioObjectOptions {
  readonly scene: StudioSceneState;
  readonly session: StudioDragSession;
  readonly pointer: StudioPoint;
}

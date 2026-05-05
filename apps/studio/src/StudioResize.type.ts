import type { StudioPoint } from "./StudioDrag.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export type StudioResizeHandleId = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface StudioResizeHandle {
  readonly id: StudioResizeHandleId;
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

export interface StudioResizeSession {
  readonly objectId: string;
  readonly handleId: StudioResizeHandleId;
  readonly startPointer: StudioPoint;
  readonly startBounds: StudioResizeBounds;
}

export interface StudioResizeBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface StudioResizeStart {
  readonly session: StudioResizeSession;
  readonly selectedObjectId: string;
}

export interface ResizeStudioObjectOptions {
  readonly scene: StudioSceneState;
  readonly session: StudioResizeSession;
  readonly pointer: StudioPoint;
}

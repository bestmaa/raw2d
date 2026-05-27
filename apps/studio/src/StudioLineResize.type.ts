import type { StudioPoint } from "./StudioDrag.type";
import type { StudioLineState } from "./StudioSceneState.type";
import type { StudioResizeHandleId } from "./StudioResize.type";

export interface StudioLineResizeState {
  readonly objectX: number;
  readonly objectY: number;
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface ResizeStudioLineEndpointOptions {
  readonly object: StudioLineState;
  readonly handleId: StudioResizeHandleId;
  readonly startLine: StudioLineResizeState;
  readonly pointer: StudioPoint;
}

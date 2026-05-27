import type { StudioPoint } from "./StudioDrag.type";
import type { StudioTextState } from "./StudioSceneState.type";
import type { StudioResizeBounds } from "./StudioResize.type";

export interface StudioTextResizeState {
  readonly x: number;
  readonly y: number;
  readonly font?: string;
}

export interface ResizeStudioTextObjectOptions {
  readonly object: StudioTextState;
  readonly bounds: StudioResizeBounds;
}

export interface StudioTextMetricsEstimate {
  readonly fontSize: number;
  readonly widthRatio: number;
}

export type GetStudioTextBounds = (object: StudioTextState) => StudioResizeBounds;
export type ResizeStudioTextFromPointer = (object: StudioTextState, pointer: StudioPoint) => StudioTextState;

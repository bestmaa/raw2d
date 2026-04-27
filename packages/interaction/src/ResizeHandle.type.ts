import type { Rectangle } from "raw2d-core";

export type ResizeHandleName = "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left";

export interface ResizeHandle {
  readonly name: ResizeHandleName;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly cursor: string;
}

export interface GetResizeHandlesOptions {
  readonly bounds: Rectangle;
  readonly size?: number;
}

export interface PickResizeHandleOptions {
  readonly handles: readonly ResizeHandle[];
  readonly x: number;
  readonly y: number;
}

export type PickResizeHandleResult = ResizeHandle | null;

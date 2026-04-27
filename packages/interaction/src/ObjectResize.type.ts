import type { Rect } from "raw2d-core";
import type { ResizeHandleName } from "./ResizeHandle.type.js";

export interface StartObjectResizeOptions {
  readonly object: Rect;
  readonly handleName: ResizeHandleName;
  readonly pointerX: number;
  readonly pointerY: number;
  readonly minWidth?: number;
  readonly minHeight?: number;
}

export interface UpdateObjectResizeOptions {
  readonly state: ObjectResizeState;
  readonly pointerX: number;
  readonly pointerY: number;
}

export interface EndObjectResizeOptions {
  readonly state: ObjectResizeState;
}

export interface ObjectResizeState {
  readonly object: Rect;
  readonly handleName: ResizeHandleName;
  readonly startPointerX: number;
  readonly startPointerY: number;
  readonly startObjectX: number;
  readonly startObjectY: number;
  readonly startWidth: number;
  readonly startHeight: number;
  readonly minWidth: number;
  readonly minHeight: number;
  active: boolean;
}

import type { Object2D } from "raw2d-core";

export interface StartObjectDragOptions {
  readonly object: Object2D;
  readonly pointerX: number;
  readonly pointerY: number;
}

export interface UpdateObjectDragOptions {
  readonly state: ObjectDragState;
  readonly pointerX: number;
  readonly pointerY: number;
}

export interface EndObjectDragOptions {
  readonly state: ObjectDragState;
}

export interface ObjectDragState {
  readonly object: Object2D;
  readonly startPointerX: number;
  readonly startPointerY: number;
  readonly startObjectX: number;
  readonly startObjectY: number;
  active: boolean;
}

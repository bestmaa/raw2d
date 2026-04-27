import type { ObjectDragState } from "raw2d";

export interface DragDemoState {
  dragState: ObjectDragState | null;
  selectedName: string;
  pointerX: number;
  pointerY: number;
}

export interface CanvasPoint {
  readonly x: number;
  readonly y: number;
}

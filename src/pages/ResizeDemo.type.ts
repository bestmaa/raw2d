import type { ObjectResizeState, Rect } from "raw2d";

export interface ResizeDemoState {
  readonly rect: Rect;
  resizeState: ObjectResizeState | null;
  hoveredHandleName: string;
}

export interface ResizeDemoPointerOptions {
  readonly canvasElement: HTMLCanvasElement;
  readonly event: PointerEvent;
}

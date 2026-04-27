import type { Canvas, Camera2D, Circle, InteractionController, Line, Rect, Scene } from "raw2d";

export type InteractionControllerDemoVariant =
  | "create"
  | "global"
  | "single"
  | "single-custom"
  | "many"
  | "selection"
  | "detach"
  | "state"
  | "renderer";

export interface InteractionControllerDemoOptions {
  readonly variant?: InteractionControllerDemoVariant;
}

export interface InteractionDemoObjects {
  readonly rectA: Rect;
  readonly rectB: Rect;
  readonly circle: Circle;
  readonly line: Line;
}

export interface InteractionControllerDemoRenderOptions {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly controller: InteractionController;
  readonly code: HTMLElement;
  readonly objects: InteractionDemoObjects;
  readonly variant: InteractionControllerDemoVariant;
}

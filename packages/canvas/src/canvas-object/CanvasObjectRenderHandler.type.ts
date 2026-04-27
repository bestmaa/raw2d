import type { CanvasObject } from "../Canvas.type.js";

export interface CanvasObjectRenderHandler {
  readonly canRender: (object: CanvasObject) => boolean;
  readonly render: (context: CanvasRenderingContext2D, object: CanvasObject) => void;
}

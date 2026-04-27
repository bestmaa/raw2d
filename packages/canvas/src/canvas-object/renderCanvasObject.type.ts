import type { CanvasObject } from "../Canvas.type.js";
import type { CanvasObjectRenderHandler } from "./CanvasObjectRenderHandler.type.js";

export interface RenderCanvasObjectOptions {
  readonly context: CanvasRenderingContext2D;
  readonly object: CanvasObject;
  readonly handlers: readonly CanvasObjectRenderHandler[];
}

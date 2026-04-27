import type { CanvasObject } from "./Canvas.type.js";
import { createCanvasObjectRenderHandlers, renderCanvasObject } from "./canvas-object/index.js";
import type { CanvasObjectRenderHandler } from "./canvas-object/index.js";
import type {
  CanvasObjectRendererLike,
  CanvasObjectRendererOptions
} from "./CanvasObjectRenderer.type.js";

export class CanvasObjectRenderer implements CanvasObjectRendererLike {
  private readonly context: CanvasRenderingContext2D;
  private readonly handlers: readonly CanvasObjectRenderHandler[];

  public constructor(options: CanvasObjectRendererOptions) {
    this.context = options.context;
    this.handlers = createCanvasObjectRenderHandlers();
  }

  public render(objects: readonly CanvasObject[]): void {
    for (const object of objects) {
      if (!object.visible) {
        continue;
      }

      renderCanvasObject({ context: this.context, object, handlers: this.handlers });
    }
  }
}

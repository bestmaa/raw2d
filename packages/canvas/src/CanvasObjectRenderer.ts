import { Group2D, sortRenderObjects } from "raw2d-core";
import type { CanvasObject } from "./Canvas.type.js";
import { applyObjectTransform } from "./canvas/applyObjectTransform.js";
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
      this.renderObject(object);
    }
  }

  private renderObject(object: CanvasObject): void {
    if (!object.visible) {
      return;
    }

    if (object instanceof Group2D) {
      this.renderGroup(object);
      return;
    }

    renderCanvasObject({ context: this.context, object, handlers: this.handlers });
  }

  private renderGroup(group: Group2D): void {
    this.context.save();
    applyObjectTransform({ context: this.context, object: group });

    for (const child of sortRenderObjects({ objects: group.getChildren() })) {
      this.renderObject(child);
    }

    this.context.restore();
  }
}

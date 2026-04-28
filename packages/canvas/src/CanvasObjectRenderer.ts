import { Group2D, RenderList, type RenderItem } from "raw2d-core";
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

  public render(objects: readonly CanvasObject[] | RenderList<CanvasObject>): void {
    if (objects instanceof RenderList) {
      this.renderList(objects);
      return;
    }

    for (const object of objects) {
      this.renderObject(object);
    }
  }

  private renderList(renderList: RenderList<CanvasObject>): void {
    for (const item of renderList.getRootItems()) {
      this.renderItem(item);
    }
  }

  private renderItem(item: RenderItem<CanvasObject>): void {
    this.renderObject(item.object, item.children);
  }

  private renderObject(object: CanvasObject, children?: readonly RenderItem<CanvasObject>[]): void {
    if (!object.visible) {
      return;
    }

    if (object instanceof Group2D) {
      this.renderGroup(object, children);
      return;
    }

    renderCanvasObject({ context: this.context, object, handlers: this.handlers });
  }

  private renderGroup(group: Group2D, children?: readonly RenderItem<CanvasObject>[]): void {
    this.context.save();
    applyObjectTransform({ context: this.context, object: group });

    if (children) {
      for (const child of children) {
        this.renderItem(child);
      }
    } else {
      for (const child of group.getChildren()) {
        this.renderObject(child);
      }
    }

    this.context.restore();
  }
}

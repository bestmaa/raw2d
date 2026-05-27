import { Group2D, RenderList, type RenderItem } from "raw2d-core";
import { applyCanvasEffects } from "./applyCanvasEffects.js";
import type { CanvasObject } from "./Canvas.type.js";
import { applyObjectTransform } from "./canvas/applyObjectTransform.js";
import { createCanvasObjectRenderHandlers, renderCanvasObject } from "./canvas-object/index.js";
import type { CanvasObjectRenderHandler } from "./canvas-object/index.js";
import type {
  CanvasObjectRendererLike,
  CanvasObjectRendererOptions,
  CanvasObjectRendererRenderOptions
} from "./CanvasObjectRenderer.type.js";

export class CanvasObjectRenderer implements CanvasObjectRendererLike {
  private readonly context: CanvasRenderingContext2D;
  private readonly handlers: readonly CanvasObjectRenderHandler[];

  public constructor(options: CanvasObjectRendererOptions) {
    this.context = options.context;
    this.handlers = createCanvasObjectRenderHandlers();
  }

  public render(
    objects: readonly CanvasObject[] | RenderList<CanvasObject>,
    options: CanvasObjectRendererRenderOptions = {}
  ): void {
    if (objects instanceof RenderList) {
      this.renderList(objects, options);
      return;
    }

    for (const object of objects) {
      this.renderObject(object, undefined, options);
    }
  }

  private renderList(renderList: RenderList<CanvasObject>, options: CanvasObjectRendererRenderOptions): void {
    for (const item of renderList.getRootItems()) {
      this.renderItem(item, options);
    }
  }

  private renderItem(item: RenderItem<CanvasObject>, options: CanvasObjectRendererRenderOptions): void {
    this.renderObject(item.object, item.children, options);
  }

  private renderObject(
    object: CanvasObject,
    children: readonly RenderItem<CanvasObject>[] | undefined,
    options: CanvasObjectRendererRenderOptions
  ): void {
    if (!object.visible) {
      return;
    }

    const effects = options.effects?.(object) ?? [];

    if (effects.length > 0) {
      this.context.save();
      applyCanvasEffects({ context: this.context, effects });
      this.renderObjectWithoutEffects(object, children, options);
      this.context.restore();
      return;
    }

    this.renderObjectWithoutEffects(object, children, options);
  }

  private renderObjectWithoutEffects(
    object: CanvasObject,
    children: readonly RenderItem<CanvasObject>[] | undefined,
    options: CanvasObjectRendererRenderOptions
  ): void {
    if (object instanceof Group2D) {
      this.renderGroup(object, children, options);
      return;
    }

    renderCanvasObject({ context: this.context, object, handlers: this.handlers });
  }

  private renderGroup(
    group: Group2D,
    children: readonly RenderItem<CanvasObject>[] | undefined,
    options: CanvasObjectRendererRenderOptions
  ): void {
    this.context.save();
    applyObjectTransform({ context: this.context, object: group });

    if (children) {
      for (const child of children) {
        this.renderItem(child, options);
      }
    } else {
      for (const child of group.getChildren()) {
        this.renderObject(child, undefined, options);
      }
    }

    this.context.restore();
  }
}

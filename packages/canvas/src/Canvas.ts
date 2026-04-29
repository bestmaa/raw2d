import { Camera2D, Group2D, RenderPipeline, getRendererSupport, type Renderer2DLike, type RendererSupportProfile, type RenderItem, type RenderList, type RenderListStats, type Scene } from "raw2d-core";
import { CanvasObjectRenderer } from "./CanvasObjectRenderer.js";
import { getCanvasObjectWorldBounds } from "./culling/index.js";
import type { CanvasObject, CanvasOptions, CanvasRenderOptions, CanvasRenderStats, CanvasSize } from "./Canvas.type.js";

export class Canvas implements Renderer2DLike<CanvasObject, CanvasRenderOptions, CanvasRenderStats, CanvasSize> {
  public readonly element: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly renderer: CanvasObjectRenderer;
  private readonly pipeline: RenderPipeline<CanvasObject>;
  private readonly objects: CanvasObject[] = [];
  private readonly defaultCamera: Camera2D;
  private width: number;
  private height: number;
  private pixelRatio: number;
  private backgroundColor: string;
  private stats: CanvasRenderStats = { objects: 0, drawCalls: 0, renderList: createEmptyRenderListStats() };

  public constructor(options: CanvasOptions) {
    this.element = options.canvas;
    this.width = options.width ?? this.element.clientWidth;
    this.height = options.height ?? this.element.clientHeight;
    this.pixelRatio = options.pixelRatio ?? window.devicePixelRatio ?? 1;
    this.backgroundColor = options.backgroundColor ?? "#000000";
    this.defaultCamera = new Camera2D();

    const context = this.element.getContext("2d", {
      alpha: options.alpha ?? false
    });

    if (!context) {
      throw new Error("Canvas 2D context is not available.");
    }

    this.context = context;
    this.renderer = new CanvasObjectRenderer({ context });
    this.pipeline = new RenderPipeline({
      boundsProvider: (object) => getCanvasObjectWorldBounds({ object, context })
    });
    this.setSize(this.width, this.height, this.pixelRatio);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  public add(object: CanvasObject): this {
    if (!this.objects.includes(object)) {
      this.objects.push(object);
    }

    return this;
  }

  public remove(object: CanvasObject): this {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }

    return this;
  }

  public getObjects(): readonly CanvasObject[] {
    return this.objects;
  }

  public getSize(): CanvasSize {
    return {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio
    };
  }

  public getStats(): CanvasRenderStats {
    return this.stats;
  }

  public getSupport(): RendererSupportProfile {
    return getRendererSupport("canvas");
  }

  public setSize(width: number, height: number, pixelRatio = this.pixelRatio): void {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.pixelRatio = Math.max(1, pixelRatio);

    this.element.width = Math.floor(this.width * this.pixelRatio);
    this.element.height = Math.floor(this.height * this.pixelRatio);
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  public clear(color = this.backgroundColor): void {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.element.width, this.element.height);
    this.context.restore();
  }

  public setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  public dispose(): void {}

  public render(scene?: Scene, camera = this.defaultCamera, options: CanvasRenderOptions = {}): void {
    const renderList = options.renderList ?? this.createRenderList(scene, camera, options);

    this.clear(this.backgroundColor);
    this.context.save();
    this.applyCamera(camera);
    this.renderer.render(renderList);
    this.context.restore();
    this.stats = createCanvasStats(renderList);
  }

  public createRenderList(
    scene?: Scene,
    camera = this.defaultCamera,
    renderOptions: CanvasRenderOptions = {}
  ): RenderList<CanvasObject> {
    return this.pipeline.build({
      scene,
      objects: scene ? undefined : this.objects,
      camera,
      viewport: { width: this.width, height: this.height },
      culling: renderOptions.culling,
      filter: renderOptions.cullingFilter
    });
  }

  private applyCamera(camera: Camera2D): void {
    this.context.scale(camera.zoom, camera.zoom);
    this.context.translate(-camera.x, -camera.y);
  }
}

function createCanvasStats(renderList: RenderList<CanvasObject>): CanvasRenderStats {
  const flatItems = renderList.getFlatItems();
  return {
    objects: flatItems.length,
    drawCalls: flatItems.filter(isDrawableItem).length,
    renderList: renderList.getStats()
  };
}

function isDrawableItem(item: RenderItem<CanvasObject>): boolean {
  return !(item.object instanceof Group2D);
}

function createEmptyRenderListStats(): RenderListStats {
  return {
    total: 0,
    accepted: 0,
    hidden: 0,
    filtered: 0,
    culled: 0
  };
}

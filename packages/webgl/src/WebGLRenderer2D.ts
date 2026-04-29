import { Camera2D, RenderPipeline, getRendererSupport, type Object2D, type RendererSupportProfile, type RenderList, type Scene } from "raw2d-core";
import { createWebGLRenderRuns } from "./createWebGLRenderRuns.js";
import { createWebGLShapeBatch } from "./createWebGLShapeBatch.js";
import { createWebGLSpriteBatch } from "./createWebGLSpriteBatch.js";
import { createMutableWebGLRenderStats } from "./createMutableWebGLRenderStats.js";
import { getWebGLBounds } from "./getWebGLBounds.js";
import { getWebGLRenderRunKind } from "./getWebGLRenderRunKind.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";
import { finalizeWebGLRenderStats } from "./finalizeWebGLRenderStats.js";
import { createWebGLStaticRunKey } from "./createWebGLStaticRunKey.js";
import { configureWebGLShapeProgram, configureWebGLSpriteProgram } from "./configureWebGLPrograms.js";
import { drawWebGLShapeBatch, drawWebGLSpriteBatch } from "./drawWebGLBatches.js";
import { trackWebGLShapeBatchStats, trackWebGLSpriteBatchStats } from "./trackWebGLBatchStats.js";
import { trackWebGLRunModeStats } from "./trackWebGLRunModeStats.js";
import { trackWebGLUploadStats } from "./trackWebGLUploadStats.js";
import { trackWebGLTextTextureStats } from "./trackWebGLTextTextureStats.js";
import { trackWebGLSpriteRunDiagnostics } from "./trackWebGLSpriteRunDiagnostics.js";
import { WebGLRenderer2DResources } from "./WebGLRenderer2DResources.js";
import { emitWebGLShapePathFillFallbacks } from "./emitWebGLShapePathFillFallbacks.js";
import { releaseDisposedWebGLSpriteTextures } from "./releaseDisposedWebGLSpriteTextures.js";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";
import type { WebGLRenderer2DLike, WebGLRenderer2DOptions, WebGLRenderer2DRenderOptions, WebGLRenderer2DSize } from "./WebGLRenderer2D.type.js";

export class WebGLRenderer2D implements WebGLRenderer2DLike {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  private readonly resourceOptions: WebGLRenderer2DOptions;
  private readonly handleContextLost = (event: Event): void => this.onContextLost(event);
  private readonly handleContextRestored = (): void => this.onContextRestored();
  private readonly pipeline = new RenderPipeline<Object2D>({
    boundsProvider: (object) => getWebGLBounds(object)
  });
  private readonly shapeFloatBuffer = new WebGLFloatBuffer();
  private readonly spriteFloatBuffer = new WebGLFloatBuffer();
  private readonly defaultCamera = new Camera2D();
  private resources: WebGLRenderer2DResources;
  private width: number;
  private height: number;
  private backgroundColor: string;
  private contextLost = false;
  private stats: WebGLRenderStats = finalizeWebGLRenderStats(createMutableWebGLRenderStats());

  public constructor(options: WebGLRenderer2DOptions) {
    this.canvas = options.canvas;
    this.width = options.width ?? this.canvas.clientWidth;
    this.height = options.height ?? this.canvas.clientHeight;
    this.backgroundColor = options.backgroundColor ?? "#000000";
    this.resourceOptions = options;

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 context is not available.");
    }

    this.gl = gl;
    this.resources = new WebGLRenderer2DResources(gl, options);
    this.canvas.addEventListener?.("webglcontextlost", this.handleContextLost);
    this.canvas.addEventListener?.("webglcontextrestored", this.handleContextRestored);
    this.setSize(this.width, this.height);
  }

  public setSize(width: number, height: number): void {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  public getSize(): WebGLRenderer2DSize { return { width: this.width, height: this.height }; }
  public getStats(): WebGLRenderStats { return this.stats; }
  public getSupport(): RendererSupportProfile { return getRendererSupport("webgl"); }
  public getTextureCacheSize(): number { return this.resources.textureCache.getSize(); }
  public getTextTextureCacheSize(): number { return this.resources.textTextureCache.getSize(); }
  public isContextLost(): boolean {
    return this.contextLost || (typeof this.gl.isContextLost === "function" && this.gl.isContextLost());
  }

  public setBackgroundColor(color: string): void { this.backgroundColor = color; }

  public clearTextureCache(): void { this.resources.clearTextureCache(); }

  public dispose(): void {
    this.canvas.removeEventListener?.("webglcontextlost", this.handleContextLost);
    this.canvas.removeEventListener?.("webglcontextrestored", this.handleContextRestored);
    this.resources.dispose();
  }

  public createRenderList(scene?: Scene, camera = this.defaultCamera, options: WebGLRenderer2DRenderOptions = {}): RenderList<Object2D> {
    return this.pipeline.build({
      scene,
      camera,
      viewport: { width: this.width, height: this.height },
      culling: options.culling
    });
  }

  public render(scene: Scene, camera = this.defaultCamera, options: WebGLRenderer2DRenderOptions = {}): void {
    if (this.isContextLost()) {
      this.contextLost = true;
      this.stats = finalizeWebGLRenderStats(createMutableWebGLRenderStats());
      return;
    }

    const renderList = options.renderList ?? this.createRenderList(scene, camera, options);
    const items = renderList.getFlatItems();
    const runs = createWebGLRenderRuns(items, getWebGLRenderRunKind);
    const stats = createMutableWebGLRenderStats(renderList.getStats());

    this.clear();
    this.resources.staticShapeCache.beginFrame();
    this.resources.staticSpriteCache.beginFrame();
    this.resources.textTextureCache.beginFrame();

    for (const run of runs) {
      if (run.kind === "shape") {
        this.renderShapeRun(run, camera, stats);
      } else if (run.kind === "sprite") {
        this.renderSpriteRun(run, camera, stats);
      } else {
        trackWebGLRunModeStats(run, 0, stats);
        stats.unsupported += run.items.length;
      }
    }

    this.resources.staticShapeCache.sweep();
    this.resources.staticSpriteCache.sweep();
    trackWebGLTextTextureStats(this.resources.textTextureCache, stats);
    this.stats = finalizeWebGLRenderStats(stats);
  }

  private renderShapeRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    if (run.mode === "static" && this.renderCachedShapeRun(run, camera, stats)) {
      return;
    }

    const batch = createWebGLShapeBatch({ items: run.items, camera, width: this.width, height: this.height, floatBuffer: this.shapeFloatBuffer });
    const uploader = run.mode === "static" ? this.cacheShapeBatch(run, camera, batch).uploader : this.resources.shapeUploaders.dynamic;
    configureWebGLShapeProgram(this.gl, this.resources.shapeProgram, uploader);
    trackWebGLUploadStats(uploader.upload(batch.vertices), stats);
    drawWebGLShapeBatch(this.gl, batch);
    trackWebGLShapeBatchStats(batch, run, stats);
    emitWebGLShapePathFillFallbacks(batch, this.resourceOptions);
  }

  private renderCachedShapeRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): boolean {
    const identity = this.createStaticRunIdentity(run, camera);
    const entry = this.resources.staticShapeCache.get(identity.runId, identity.key);

    if (!entry) {
      stats.staticCacheMisses += 1;
      return false;
    }

    stats.staticCacheHits += 1;
    configureWebGLShapeProgram(this.gl, this.resources.shapeProgram, entry.uploader);
    drawWebGLShapeBatch(this.gl, entry.batch);
    trackWebGLShapeBatchStats(entry.batch, run, stats);
    emitWebGLShapePathFillFallbacks(entry.batch, this.resourceOptions);
    return true;
  }

  private cacheShapeBatch(run: WebGLRenderRun, camera: Camera2D, batch: WebGLShapeBatch): ReturnType<WebGLRenderer2DResources["staticShapeCache"]["set"]> {
    const identity = this.createStaticRunIdentity(run, camera);
    return this.resources.staticShapeCache.set(identity.runId, identity.key, batch);
  }

  private renderSpriteRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    releaseDisposedWebGLSpriteTextures(run, this.resources.textureCache);
    trackWebGLSpriteRunDiagnostics(run, (texture) => this.resources.textureCache.getKey(texture), stats);

    if (run.mode === "static" && this.renderCachedSpriteRun(run, camera, stats)) {
      return;
    }

    const batch = createWebGLSpriteBatch({
      items: run.items,
      camera,
      width: this.width,
      height: this.height,
      floatBuffer: this.spriteFloatBuffer,
      getTextureKey: (texture) => this.resources.textureCache.getKey(texture),
      getTextTexture: (text) => this.resources.textTextureCache.get(text)
    });

    this.resources.releaseRetiredTextTextures();
    const uploader = run.mode === "static" ? this.cacheSpriteBatch(run, camera, batch).uploader : this.resources.spriteUploaders.dynamic;
    configureWebGLSpriteProgram(this.gl, this.resources.spriteProgram, uploader);
    trackWebGLUploadStats(uploader.upload(batch.vertices), stats);
    drawWebGLSpriteBatch(this.gl, batch, this.resources.textureCache, stats);
    trackWebGLSpriteBatchStats(batch, run, stats);
  }

  private renderCachedSpriteRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): boolean {
    const identity = this.createStaticRunIdentity(run, camera);
    const entry = this.resources.staticSpriteCache.get(identity.runId, identity.key);

    if (!entry) {
      stats.staticCacheMisses += 1;
      return false;
    }

    stats.staticCacheHits += 1;
    configureWebGLSpriteProgram(this.gl, this.resources.spriteProgram, entry.uploader);
    drawWebGLSpriteBatch(this.gl, entry.batch, this.resources.textureCache, stats);
    trackWebGLSpriteBatchStats(entry.batch, run, stats);
    return true;
  }

  private cacheSpriteBatch(run: WebGLRenderRun, camera: Camera2D, batch: WebGLSpriteBatch): ReturnType<WebGLRenderer2DResources["staticSpriteCache"]["set"]> {
    const identity = this.createStaticRunIdentity(run, camera);
    return this.resources.staticSpriteCache.set(identity.runId, identity.key, batch);
  }

  public clear(colorValue = this.backgroundColor): void {
    const color = parseWebGLColor(colorValue);
    this.gl.clearColor(color.r, color.g, color.b, color.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  private createStaticRunIdentity(run: WebGLRenderRun, camera: Camera2D): ReturnType<typeof createWebGLStaticRunKey> {
    return createWebGLStaticRunKey({
      run,
      camera,
      width: this.width,
      height: this.height,
      getTextureKey: (texture) => this.resources.textureCache.getKey(texture)
    });
  }

  private onContextLost(event: Event): void {
    event.preventDefault();
    this.contextLost = true;
  }

  private onContextRestored(): void {
    this.contextLost = false;
    this.resources = new WebGLRenderer2DResources(this.gl, this.resourceOptions);
    this.setSize(this.width, this.height);
  }
}

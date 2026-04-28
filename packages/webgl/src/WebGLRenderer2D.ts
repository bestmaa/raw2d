import { Camera2D, RenderPipeline, type Object2D, type RenderList, type Scene } from "raw2d-core";
import { createWebGLProgram } from "./createWebGLProgram.js";
import { createWebGLRenderRuns } from "./createWebGLRenderRuns.js";
import { createWebGLShapeBatch } from "./createWebGLShapeBatch.js";
import { createWebGLSpriteBatch } from "./createWebGLSpriteBatch.js";
import { createMutableWebGLRenderStats } from "./createMutableWebGLRenderStats.js";
import { getWebGLBounds } from "./getWebGLBounds.js";
import { getWebGLRenderRunKind } from "./getWebGLRenderRunKind.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { WebGLTextureCache } from "./WebGLTextureCache.js";
import { WebGLTextTextureCache } from "./WebGLTextTextureCache.js";
import { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";
import { WebGLStaticBatchCache } from "./WebGLStaticBatchCache.js";
import { finalizeWebGLRenderStats } from "./finalizeWebGLRenderStats.js";
import { createWebGLBufferUploaders } from "./createWebGLBufferUploaders.js";
import { createWebGLStaticRunKey } from "./createWebGLStaticRunKey.js";
import { configureWebGLShapeProgram, configureWebGLSpriteProgram } from "./configureWebGLPrograms.js";
import { drawWebGLShapeBatch, drawWebGLSpriteBatch } from "./drawWebGLBatches.js";
import { trackWebGLShapeBatchStats, trackWebGLSpriteBatchStats } from "./trackWebGLBatchStats.js";
import { trackWebGLRunModeStats } from "./trackWebGLRunModeStats.js";
import { trackWebGLUploadStats } from "./trackWebGLUploadStats.js";
import { shapeFragmentSource, shapeVertexSource, spriteFragmentSource, spriteVertexSource } from "./WebGLRenderer2DShaders.js";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLBufferUploaderMap } from "./WebGLBufferUploaderMap.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";
import type { WebGLRenderer2DLike, WebGLRenderer2DOptions, WebGLRenderer2DRenderOptions, WebGLRenderer2DSize } from "./WebGLRenderer2D.type.js";

export class WebGLRenderer2D implements WebGLRenderer2DLike {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  private readonly pipeline = new RenderPipeline<Object2D>({
    boundsProvider: (object) => getWebGLBounds(object)
  });
  private readonly shapeProgram: WebGLProgram;
  private readonly spriteProgram: WebGLProgram;
  private readonly shapeUploaders: WebGLBufferUploaderMap;
  private readonly spriteUploaders: WebGLBufferUploaderMap;
  private readonly textureCache: WebGLTextureCache;
  private readonly textTextureCache: WebGLTextTextureCache;
  private readonly shapeFloatBuffer = new WebGLFloatBuffer();
  private readonly spriteFloatBuffer = new WebGLFloatBuffer();
  private readonly staticShapeCache: WebGLStaticBatchCache<WebGLShapeBatch>;
  private readonly staticSpriteCache: WebGLStaticBatchCache<WebGLSpriteBatch>;
  private readonly defaultCamera = new Camera2D();
  private width: number;
  private height: number;
  private backgroundColor: string;
  private stats: WebGLRenderStats = finalizeWebGLRenderStats(createMutableWebGLRenderStats(0));

  public constructor(options: WebGLRenderer2DOptions) {
    this.canvas = options.canvas;
    this.width = options.width ?? this.canvas.clientWidth;
    this.height = options.height ?? this.canvas.clientHeight;
    this.backgroundColor = options.backgroundColor ?? "#000000";

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 context is not available.");
    }

    this.gl = gl;
    this.shapeProgram = createWebGLProgram(gl, shapeVertexSource, shapeFragmentSource);
    this.spriteProgram = createWebGLProgram(gl, spriteVertexSource, spriteFragmentSource);
    this.shapeUploaders = createWebGLBufferUploaders(gl);
    this.spriteUploaders = createWebGLBufferUploaders(gl);
    this.staticShapeCache = new WebGLStaticBatchCache(gl);
    this.staticSpriteCache = new WebGLStaticBatchCache(gl);
    this.textureCache = new WebGLTextureCache(gl);
    this.textTextureCache = new WebGLTextTextureCache({
      createCanvas: options.createTextCanvas,
      maxEntries: options.textTextureCacheMaxEntries
    });
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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
  public getTextureCacheSize(): number { return this.textureCache.getSize(); }
  public getTextTextureCacheSize(): number { return this.textTextureCache.getSize(); }

  public setBackgroundColor(color: string): void { this.backgroundColor = color; }

  public clearTextureCache(): void {
    this.textTextureCache.clear();
    this.releaseRetiredTextTextures();
    this.textureCache.clear();
  }

  public dispose(): void {
    this.staticShapeCache.dispose();
    this.staticSpriteCache.dispose();
    for (const uploader of [this.shapeUploaders.dynamic, this.shapeUploaders.static, this.spriteUploaders.dynamic, this.spriteUploaders.static]) {
      uploader.dispose();
    }
    this.textureCache.dispose();
    this.textTextureCache.dispose();
    this.gl.deleteProgram(this.shapeProgram);
    this.gl.deleteProgram(this.spriteProgram);
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
    const renderList = options.renderList ?? this.createRenderList(scene, camera, options);
    const items = renderList.getFlatItems();
    const runs = createWebGLRenderRuns(items, getWebGLRenderRunKind);
    const stats = createMutableWebGLRenderStats(items.length);

    this.clear();
    this.staticShapeCache.beginFrame();
    this.staticSpriteCache.beginFrame();

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

    this.staticShapeCache.sweep();
    this.staticSpriteCache.sweep();
    this.stats = finalizeWebGLRenderStats(stats);
  }

  private renderShapeRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    if (run.mode === "static" && this.renderCachedShapeRun(run, camera, stats)) {
      return;
    }

    const batch = createWebGLShapeBatch({ items: run.items, camera, width: this.width, height: this.height, floatBuffer: this.shapeFloatBuffer });
    const uploader = run.mode === "static" ? this.cacheShapeBatch(run, camera, batch).uploader : this.shapeUploaders.dynamic;
    configureWebGLShapeProgram(this.gl, this.shapeProgram, uploader);
    trackWebGLUploadStats(uploader.upload(batch.vertices), stats);
    drawWebGLShapeBatch(this.gl, batch);
    trackWebGLShapeBatchStats(batch, run, stats);
  }

  private renderCachedShapeRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): boolean {
    const identity = this.createStaticRunIdentity(run, camera);
    const entry = this.staticShapeCache.get(identity.runId, identity.key);

    if (!entry) {
      stats.staticCacheMisses += 1;
      return false;
    }

    stats.staticCacheHits += 1;
    configureWebGLShapeProgram(this.gl, this.shapeProgram, entry.uploader);
    drawWebGLShapeBatch(this.gl, entry.batch);
    trackWebGLShapeBatchStats(entry.batch, run, stats);
    return true;
  }

  private cacheShapeBatch(run: WebGLRenderRun, camera: Camera2D, batch: WebGLShapeBatch): ReturnType<WebGLStaticBatchCache<WebGLShapeBatch>["set"]> {
    const identity = this.createStaticRunIdentity(run, camera);
    return this.staticShapeCache.set(identity.runId, identity.key, batch);
  }

  private renderSpriteRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    if (run.mode === "static" && this.renderCachedSpriteRun(run, camera, stats)) {
      return;
    }

    const batch = createWebGLSpriteBatch({
      items: run.items,
      camera,
      width: this.width,
      height: this.height,
      floatBuffer: this.spriteFloatBuffer,
      getTextureKey: (texture) => this.textureCache.getKey(texture),
      getTextTexture: (text) => this.textTextureCache.get(text)
    });

    this.releaseRetiredTextTextures();
    const uploader = run.mode === "static" ? this.cacheSpriteBatch(run, camera, batch).uploader : this.spriteUploaders.dynamic;
    configureWebGLSpriteProgram(this.gl, this.spriteProgram, uploader);
    trackWebGLUploadStats(uploader.upload(batch.vertices), stats);
    drawWebGLSpriteBatch(this.gl, batch, this.textureCache, stats);
    trackWebGLSpriteBatchStats(batch, run, stats);
  }

  private renderCachedSpriteRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): boolean {
    const identity = this.createStaticRunIdentity(run, camera);
    const entry = this.staticSpriteCache.get(identity.runId, identity.key);

    if (!entry) {
      stats.staticCacheMisses += 1;
      return false;
    }

    stats.staticCacheHits += 1;
    configureWebGLSpriteProgram(this.gl, this.spriteProgram, entry.uploader);
    drawWebGLSpriteBatch(this.gl, entry.batch, this.textureCache, stats);
    trackWebGLSpriteBatchStats(entry.batch, run, stats);
    return true;
  }

  private cacheSpriteBatch(run: WebGLRenderRun, camera: Camera2D, batch: WebGLSpriteBatch): ReturnType<WebGLStaticBatchCache<WebGLSpriteBatch>["set"]> {
    const identity = this.createStaticRunIdentity(run, camera);
    return this.staticSpriteCache.set(identity.runId, identity.key, batch);
  }

  private clear(): void {
    const color = parseWebGLColor(this.backgroundColor);
    this.gl.clearColor(color.r, color.g, color.b, color.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  private releaseRetiredTextTextures(): void {
    for (const texture of this.textTextureCache.drainRetiredTextures()) {
      this.textureCache.delete(texture);
    }
  }

  private createStaticRunIdentity(run: WebGLRenderRun, camera: Camera2D): ReturnType<typeof createWebGLStaticRunKey> {
    return createWebGLStaticRunKey({
      run,
      camera,
      width: this.width,
      height: this.height,
      getTextureKey: (texture) => this.textureCache.getKey(texture)
    });
  }
}

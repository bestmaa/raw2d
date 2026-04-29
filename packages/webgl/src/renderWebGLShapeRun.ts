import { createWebGLShapeBatch } from "./createWebGLShapeBatch.js";
import { createWebGLShapePathFallbackBatch, shouldRasterizeShapePath } from "./createWebGLShapePathFallbackBatch.js";
import { createWebGLStaticRunKey } from "./createWebGLStaticRunKey.js";
import { configureWebGLShapeProgram, configureWebGLSpriteProgram } from "./configureWebGLPrograms.js";
import { drawWebGLShapeBatch, drawWebGLSpriteBatch } from "./drawWebGLBatches.js";
import { emitWebGLShapePathFillFallbacks } from "./emitWebGLShapePathFillFallbacks.js";
import { trackWebGLShapeBatchStats } from "./trackWebGLBatchStats.js";
import { trackWebGLUploadStats } from "./trackWebGLUploadStats.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";
import type { RenderWebGLShapeRunOptions } from "./renderWebGLShapeRun.type.js";

export function renderWebGLShapeRun(options: RenderWebGLShapeRunOptions): void {
  if (hasRasterizedFallbacks(options)) {
    renderSegmentedShapeRun(options);
    return;
  }

  if (options.run.mode === "static" && renderCachedShapeRun(options)) {
    return;
  }

  renderUncachedShapeRun(options);
}

function renderSegmentedShapeRun(options: RenderWebGLShapeRunOptions): void {
  let pending: WebGLRenderRun["items"] = [];

  for (const item of options.run.items) {
    if (shouldRasterizeShapePath(item, {})) {
      renderShapeBatch(options, { ...options.run, items: pending }, false);
      renderFallbackBatch(options, { ...options.run, items: [item] });
      renderShapeBatch(options, { ...options.run, items: [item] }, true);
      pending = [];
    } else {
      pending = [...pending, item];
    }
  }

  renderShapeBatch(options, { ...options.run, items: pending }, false);
}

function renderShapeBatch(options: RenderWebGLShapeRunOptions, run: WebGLRenderRun, emitFallbacks: boolean): void {
  if (run.items.length === 0) {
    return;
  }

  const batch = createWebGLShapeBatch({
    items: run.items,
    camera: options.camera,
    width: options.width,
    height: options.height,
    floatBuffer: options.shapeFloatBuffer
  });
  configureWebGLShapeProgram(options.gl, options.resources.shapeProgram, options.resources.shapeUploaders.dynamic);
  trackWebGLUploadStats(options.resources.shapeUploaders.dynamic.upload(batch.vertices), options.stats);
  drawWebGLShapeBatch(options.gl, batch);
  trackWebGLShapeBatchStats(batch, run, options.stats);

  if (emitFallbacks) {
    emitWebGLShapePathFillFallbacks(batch, options.resourceOptions);
  }
}

function renderUncachedShapeRun(options: RenderWebGLShapeRunOptions): void {
  const batch = createWebGLShapeBatch({
    items: options.run.items,
    camera: options.camera,
    width: options.width,
    height: options.height,
    floatBuffer: options.shapeFloatBuffer
  });
  const uploader = options.run.mode === "static" ? cacheShapeBatch(options, batch).uploader : options.resources.shapeUploaders.dynamic;

  configureWebGLShapeProgram(options.gl, options.resources.shapeProgram, uploader);
  trackWebGLUploadStats(uploader.upload(batch.vertices), options.stats);
  drawWebGLShapeBatch(options.gl, batch);
  trackWebGLShapeBatchStats(batch, options.run, options.stats);
  emitWebGLShapePathFillFallbacks(batch, options.resourceOptions);
}

function renderFallbackBatch(options: RenderWebGLShapeRunOptions, run: WebGLRenderRun): void {
  const batch = createWebGLShapePathFallbackBatch({
    items: run.items,
    camera: options.camera,
    width: options.width,
    height: options.height,
    floatBuffer: options.spriteFloatBuffer,
    getTextureKey: (texture) => options.resources.textureCache.getKey(texture),
    getShapePathTexture: (shapePath) => options.resources.shapePathTextureCache.get(shapePath)
  });

  if (batch.drawBatches.length === 0) {
    return;
  }

  configureWebGLSpriteProgram(options.gl, options.resources.spriteProgram, options.resources.spriteUploaders.dynamic);
  trackWebGLUploadStats(options.resources.spriteUploaders.dynamic.upload(batch.vertices), options.stats);
  drawWebGLSpriteBatch(options.gl, batch, options.resources.textureCache, options.stats);
  trackFallbackBatchStats(batch, run, options);
}

function renderCachedShapeRun(options: RenderWebGLShapeRunOptions): boolean {
  const identity = createShapeRunIdentity(options);
  const entry = options.resources.staticShapeCache.get(identity.runId, identity.key);

  if (!entry) {
    options.stats.staticCacheMisses += 1;
    return false;
  }

  options.stats.staticCacheHits += 1;
  configureWebGLShapeProgram(options.gl, options.resources.shapeProgram, entry.uploader);
  drawWebGLShapeBatch(options.gl, entry.batch);
  trackWebGLShapeBatchStats(entry.batch, options.run, options.stats);
  emitWebGLShapePathFillFallbacks(entry.batch, options.resourceOptions);
  return true;
}

function cacheShapeBatch(options: RenderWebGLShapeRunOptions, batch: WebGLShapeBatch): ReturnType<RenderWebGLShapeRunOptions["resources"]["staticShapeCache"]["set"]> {
  const identity = createShapeRunIdentity(options);
  return options.resources.staticShapeCache.set(identity.runId, identity.key, batch);
}

function createShapeRunIdentity(options: RenderWebGLShapeRunOptions): ReturnType<typeof createWebGLStaticRunKey> {
  return createWebGLStaticRunKey({
    run: options.run,
    camera: options.camera,
    width: options.width,
    height: options.height,
    getTextureKey: (texture) => options.resources.textureCache.getKey(texture)
  });
}

function hasRasterizedFallbacks(options: RenderWebGLShapeRunOptions): boolean {
  return options.resourceOptions.shapePathFillFallback === "rasterize" && options.run.items.some((item) => shouldRasterizeShapePath(item, {}));
}

function trackFallbackBatchStats(batch: WebGLSpriteBatch, run: WebGLRenderRun, options: RenderWebGLShapeRunOptions): void {
  options.stats.batches += batch.drawBatches.length;
  options.stats.drawCalls += batch.drawBatches.length;
  options.stats.vertices += batch.vertices.length / 5;

  if (run.mode === "static") {
    options.stats.staticBatches += batch.drawBatches.length;
  } else {
    options.stats.dynamicBatches += batch.drawBatches.length;
  }
}

import { trackWebGLRunModeStats } from "./trackWebGLRunModeStats.js";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";

export function trackWebGLShapeBatchStats(
  batch: WebGLShapeBatch,
  run: WebGLRenderRun,
  stats: MutableWebGLRenderStats
): void {
  stats.rects += batch.rects;
  stats.arcs += batch.arcs;
  stats.circles += batch.circles;
  stats.ellipses += batch.ellipses;
  stats.lines += batch.lines;
  stats.polylines += batch.polylines;
  stats.polygons += batch.polygons;
  stats.shapePaths += batch.shapePaths;
  stats.shapePathUnsupportedFills += batch.shapePathUnsupportedFills;
  trackWebGLRunModeStats(run, batch.drawBatches.length, stats);
  stats.vertices += batch.vertices.length / 6;
  stats.drawCalls += batch.drawBatches.length;
  stats.unsupported += batch.unsupported;
}

export function trackWebGLSpriteBatchStats(
  batch: WebGLSpriteBatch,
  run: WebGLRenderRun,
  stats: MutableWebGLRenderStats
): void {
  stats.sprites += batch.sprites;
  stats.spriteBatches += batch.drawBatches.length;

  if (run.mode === "static") {
    stats.staticSprites += batch.sprites;
    stats.staticSpriteBatches += batch.drawBatches.length;
  } else {
    stats.dynamicSprites += batch.sprites;
    stats.dynamicSpriteBatches += batch.drawBatches.length;
  }

  trackWebGLRunModeStats(run, batch.drawBatches.length, stats);
  stats.vertices += batch.vertices.length / 5;
  stats.drawCalls += batch.drawBatches.length;
  stats.unsupported += batch.unsupported;
}

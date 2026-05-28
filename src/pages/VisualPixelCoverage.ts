import type { Renderer2DStats, WebGLRenderStats } from "raw2d";
import type { VisualPixelCoverage } from "./VisualPixelTest.type";

export function createBaseCoverage(stats: Renderer2DStats): VisualPixelCoverage {
  return {
    objects: stats.objects,
    culled: stats.renderList.culled,
    drawCalls: stats.drawCalls,
    sprites: 0,
    shapePaths: 0,
    textTextures: 0,
    staticBatches: 0,
    staticCacheHits: 0
  };
}

export function createWebGLCoverage(stats: WebGLRenderStats): VisualPixelCoverage {
  return {
    objects: stats.objects,
    culled: stats.renderList.culled,
    drawCalls: stats.drawCalls,
    sprites: stats.sprites,
    shapePaths: stats.shapePaths,
    textTextures: stats.textTextures,
    staticBatches: stats.staticBatches,
    staticCacheHits: stats.staticCacheHits
  };
}

export function createEmptyCoverage(): VisualPixelCoverage {
  return {
    objects: 0,
    culled: 0,
    drawCalls: 0,
    sprites: 0,
    shapePaths: 0,
    textTextures: 0,
    staticBatches: 0,
    staticCacheHits: 0
  };
}

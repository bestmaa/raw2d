import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";

export function finalizeWebGLRenderStats(stats: MutableWebGLRenderStats): WebGLRenderStats {
  return {
    objects: stats.objects,
    rects: stats.rects,
    circles: stats.circles,
    ellipses: stats.ellipses,
    lines: stats.lines,
    polylines: stats.polylines,
    polygons: stats.polygons,
    sprites: stats.sprites,
    textures: stats.textures.size,
    batches: stats.batches,
    staticBatches: stats.staticBatches,
    dynamicBatches: stats.dynamicBatches,
    staticObjects: stats.staticObjects,
    dynamicObjects: stats.dynamicObjects,
    staticCacheHits: stats.staticCacheHits,
    staticCacheMisses: stats.staticCacheMisses,
    vertices: stats.vertices,
    drawCalls: stats.drawCalls,
    uploadBufferDataCalls: stats.uploadBufferDataCalls,
    uploadBufferSubDataCalls: stats.uploadBufferSubDataCalls,
    uploadedBytes: stats.uploadedBytes,
    unsupported: stats.unsupported
  };
}

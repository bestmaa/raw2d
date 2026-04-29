import type { RenderListStats } from "raw2d-core";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";

const emptyRenderListStats: RenderListStats = {
  total: 0,
  accepted: 0,
  hidden: 0,
  filtered: 0,
  culled: 0
};

export function createMutableWebGLRenderStats(renderList: RenderListStats = emptyRenderListStats): MutableWebGLRenderStats {
  return {
    objects: renderList.accepted,
    renderList,
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    textures: new Set<string>(),
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    batches: 0,
    staticBatches: 0,
    dynamicBatches: 0,
    staticObjects: 0,
    dynamicObjects: 0,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 0,
    drawCalls: 0,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 0,
    unsupported: 0
  };
}

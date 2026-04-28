import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";

export function createMutableWebGLRenderStats(objects: number): MutableWebGLRenderStats {
  return {
    objects,
    rects: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    sprites: 0,
    textures: new Set<string>(),
    batches: 0,
    vertices: 0,
    drawCalls: 0,
    unsupported: 0
  };
}

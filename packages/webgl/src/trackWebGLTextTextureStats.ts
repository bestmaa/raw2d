import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLTextTextureCache } from "./WebGLTextTextureCache.js";

export function trackWebGLTextTextureStats(cache: WebGLTextTextureCache, stats: MutableWebGLRenderStats): void {
  const textStats = cache.getStats();
  stats.textTextures = textStats.size;
  stats.textTextureCacheHits = textStats.hits;
  stats.textTextureCacheMisses = textStats.misses;
  stats.textTextureEvictions = textStats.evictions;
  stats.retiredTextTextures = textStats.retired;
}


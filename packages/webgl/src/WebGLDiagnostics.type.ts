import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";

export interface WebGLDiagnostics {
  readonly renderer: "webgl2";
  readonly contextLost: boolean;
  readonly textureCacheSize: number;
  readonly textTextureCacheSize: number;
  readonly shapePathTextureCacheSize: number;
  readonly stats: WebGLRenderStats;
}

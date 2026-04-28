import type { WebGLRenderer2DOptions } from "./WebGLRenderer2D.type.js";

export interface WebGLRenderer2DResourceOptions {
  readonly createTextCanvas?: WebGLRenderer2DOptions["createTextCanvas"];
  readonly textTextureCacheMaxEntries?: number;
}

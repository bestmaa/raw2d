import type { Renderer2DStats } from "raw2d-core";

export interface WebGLRenderStats extends Renderer2DStats {
  readonly objects: number;
  readonly rects: number;
  readonly arcs: number;
  readonly circles: number;
  readonly ellipses: number;
  readonly lines: number;
  readonly polylines: number;
  readonly polygons: number;
  readonly shapePaths: number;
  readonly sprites: number;
  readonly textures: number;
  readonly textureBinds: number;
  readonly textureUploads: number;
  readonly textureCacheHits: number;
  readonly batches: number;
  readonly staticBatches: number;
  readonly dynamicBatches: number;
  readonly staticObjects: number;
  readonly dynamicObjects: number;
  readonly staticCacheHits: number;
  readonly staticCacheMisses: number;
  readonly vertices: number;
  readonly drawCalls: number;
  readonly uploadBufferDataCalls: number;
  readonly uploadBufferSubDataCalls: number;
  readonly uploadedBytes: number;
  readonly unsupported: number;
}

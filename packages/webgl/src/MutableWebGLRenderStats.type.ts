export interface MutableWebGLRenderStats {
  objects: number;
  rects: number;
  arcs: number;
  circles: number;
  ellipses: number;
  lines: number;
  polylines: number;
  polygons: number;
  sprites: number;
  textures: Set<string>;
  textureBinds: number;
  textureUploads: number;
  textureCacheHits: number;
  batches: number;
  staticBatches: number;
  dynamicBatches: number;
  staticObjects: number;
  dynamicObjects: number;
  staticCacheHits: number;
  staticCacheMisses: number;
  vertices: number;
  drawCalls: number;
  uploadBufferDataCalls: number;
  uploadBufferSubDataCalls: number;
  uploadedBytes: number;
  unsupported: number;
}

export interface MutableWebGLRenderStats {
  objects: number;
  rects: number;
  circles: number;
  ellipses: number;
  lines: number;
  polylines: number;
  polygons: number;
  sprites: number;
  textures: Set<string>;
  batches: number;
  vertices: number;
  drawCalls: number;
  unsupported: number;
}

export interface WebGLRenderStats {
  readonly objects: number;
  readonly rects: number;
  readonly circles: number;
  readonly ellipses: number;
  readonly lines: number;
  readonly polylines: number;
  readonly polygons: number;
  readonly sprites: number;
  readonly textures: number;
  readonly batches: number;
  readonly vertices: number;
  readonly drawCalls: number;
  readonly unsupported: number;
}

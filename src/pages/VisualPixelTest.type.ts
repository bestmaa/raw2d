export interface VisualPixelRendererResult {
  readonly renderer: "canvas" | "webgl";
  readonly status: "passed" | "unavailable" | "failed";
  readonly hash: string;
  readonly coloredPixels: number;
  readonly width: number;
  readonly height: number;
  readonly coverage: VisualPixelCoverage;
  readonly message: string;
}

export interface VisualPixelCoverage {
  readonly objects: number;
  readonly culled: number;
  readonly drawCalls: number;
  readonly sprites: number;
  readonly shapePaths: number;
  readonly textTextures: number;
  readonly staticBatches: number;
  readonly staticCacheHits: number;
}

export interface VisualPixelTestResult {
  readonly canvas: VisualPixelRendererResult;
  readonly webgl: VisualPixelRendererResult;
}

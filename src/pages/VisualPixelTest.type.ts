import type { RendererSupportLevel, RendererSupportObjectKind } from "raw2d";

export type VisualPixelRendererName = "canvas" | "webgl";

export type VisualPixelStatus = "passed" | "unavailable" | "failed";

export interface VisualPixelRendererResult {
  readonly renderer: VisualPixelRendererName;
  readonly status: VisualPixelStatus;
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
  readonly matrix: readonly VisualPixelMatrixRow[];
}

export interface VisualPixelMatrixCell {
  readonly renderer: VisualPixelRendererName;
  readonly status: VisualPixelStatus;
  readonly hash: string;
  readonly coloredPixels: number;
  readonly message: string;
}

export interface VisualPixelMatrixRow {
  readonly kind: RendererSupportObjectKind;
  readonly canvasSupport: RendererSupportLevel;
  readonly webglSupport: RendererSupportLevel;
  readonly canvas: VisualPixelMatrixCell;
  readonly webgl: VisualPixelMatrixCell;
}

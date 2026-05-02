export interface VisualPixelRendererResult {
  readonly renderer: "canvas" | "webgl";
  readonly status: "passed" | "unavailable" | "failed";
  readonly hash: string;
  readonly coloredPixels: number;
  readonly width: number;
  readonly height: number;
  readonly message: string;
}

export interface VisualPixelTestResult {
  readonly canvas: VisualPixelRendererResult;
  readonly webgl: VisualPixelRendererResult;
}

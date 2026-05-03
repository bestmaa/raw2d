import type { Raw2DReactRenderer, Raw2DReactRendererKind } from "./Raw2DCanvas.type.js";

export interface CreateRaw2DReactRendererOptions {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Raw2DReactRendererKind;
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
  readonly backgroundColor: string;
  readonly fallbackToCanvas: boolean;
}

export interface CreateRaw2DReactRendererResult {
  readonly renderer: Raw2DReactRenderer;
  readonly rendererKind: Raw2DReactRendererKind;
}

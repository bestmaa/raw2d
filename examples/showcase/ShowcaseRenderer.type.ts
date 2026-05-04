import type { Canvas, WebGLRenderer2D } from "raw2d";

export type ShowcaseRendererMode = "canvas" | "webgl";

export interface ShowcaseRendererOptions {
  readonly canvas: HTMLCanvasElement;
  readonly mode: ShowcaseRendererMode;
  readonly width: number;
  readonly height: number;
}

export interface ShowcaseRendererResult {
  readonly activeMode: ShowcaseRendererMode;
  readonly label: string;
  readonly renderer: Canvas | WebGLRenderer2D;
}

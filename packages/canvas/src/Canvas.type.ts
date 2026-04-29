import type { Object2D, Renderer2DRenderOptions, Renderer2DSize, Renderer2DStats } from "raw2d-core";

export type CanvasObject = Object2D;

export interface CanvasOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly pixelRatio?: number;
  readonly alpha?: boolean;
  readonly backgroundColor?: string;
}

export interface CanvasRenderOptions extends Renderer2DRenderOptions<CanvasObject> {
  readonly cullingFilter?: (object: CanvasObject) => boolean;
}

export interface CanvasSize extends Renderer2DSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}

export interface CanvasRenderStats extends Renderer2DStats {}

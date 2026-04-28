import type { Object2D, Renderer2DSize, Renderer2DStats, RenderList } from "raw2d-core";

export type CanvasObject = Object2D;

export interface CanvasOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly pixelRatio?: number;
  readonly alpha?: boolean;
  readonly backgroundColor?: string;
}

export interface CanvasRenderOptions {
  readonly culling?: boolean;
  readonly cullingFilter?: (object: CanvasObject) => boolean;
  readonly renderList?: RenderList<CanvasObject>;
}

export interface CanvasSize extends Renderer2DSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}

export interface CanvasRenderStats extends Renderer2DStats {}

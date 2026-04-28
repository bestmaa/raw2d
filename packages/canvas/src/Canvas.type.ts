import type { Object2D, RenderList } from "raw2d-core";

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

export interface CanvasSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}

export interface CanvasRenderStats {
  readonly objects: number;
  readonly drawCalls: number;
}

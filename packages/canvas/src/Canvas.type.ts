import type { Object2D } from "raw2d-core";

export type CanvasObject = Object2D;

export interface CanvasOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly pixelRatio?: number;
  readonly alpha?: boolean;
  readonly backgroundColor?: string;
}

export interface CanvasSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}

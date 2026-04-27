import type { Circle, Line, Rect, Text2D } from "../objects";

export type CanvasObject = Rect | Circle | Line | Text2D;

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

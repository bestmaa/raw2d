import type { Camera2D } from "raw2d-core";

export interface InteractionPointerInput {
  readonly clientX: number;
  readonly clientY: number;
}

export interface GetInteractionPointOptions {
  readonly canvas: HTMLCanvasElement;
  readonly event: InteractionPointerInput;
  readonly camera?: Camera2D;
  readonly width?: number;
  readonly height?: number;
}

export interface InteractionPoint {
  readonly canvasX: number;
  readonly canvasY: number;
  readonly x: number;
  readonly y: number;
}

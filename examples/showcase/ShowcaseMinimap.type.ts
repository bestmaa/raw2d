import type { Camera2D } from "raw2d";

export interface DrawShowcaseMinimapOptions {
  readonly camera: Camera2D;
  readonly canvas: HTMLCanvasElement;
  readonly viewportHeight: number;
  readonly viewportWidth: number;
  readonly worldHeight: number;
  readonly worldWidth: number;
}

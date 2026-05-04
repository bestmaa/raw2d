import type { Camera2D, InteractionController } from "raw2d";

export interface DrawShowcaseOverlayOptions {
  readonly camera: Camera2D;
  readonly canvas: HTMLCanvasElement;
  readonly interaction: InteractionController;
}

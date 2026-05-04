import type { InteractionController } from "raw2d";

export interface ShowcaseInteractionResult {
  readonly controller: InteractionController;
}

export interface ShowcaseInteractionOptions {
  readonly canvas: HTMLCanvasElement;
  readonly scene: import("raw2d").Scene;
  readonly camera: import("raw2d").Camera2D;
  readonly width: number;
  readonly height: number;
}

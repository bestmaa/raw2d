import type { Camera2D, Object2D, Scene } from "raw2d";

export interface StudioRuntimeScene {
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly objects: readonly Object2D[];
}

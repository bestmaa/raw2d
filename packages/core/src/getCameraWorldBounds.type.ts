import type { Camera2D } from "./Camera2D.js";

export interface GetCameraWorldBoundsOptions {
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
}

import type { Scene, Camera2D } from "raw2d-core";

export interface WebGLRenderer2DOptions {
  readonly canvas: HTMLCanvasElement;
}

export interface WebGLRenderer2DLike {
  render(scene: Scene, camera: Camera2D): void;
  setSize(width: number, height: number): void;
}

import type { StudioRendererMode } from "./StudioRenderer.type";

export interface StudioCameraState {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
}

export interface StudioSceneObjectState {
  readonly id: string;
  readonly type: string;
  readonly name: string;
}

export interface StudioSceneState {
  readonly version: 1;
  readonly name: string;
  readonly rendererMode: StudioRendererMode;
  readonly camera: StudioCameraState;
  readonly objects: readonly StudioSceneObjectState[];
}

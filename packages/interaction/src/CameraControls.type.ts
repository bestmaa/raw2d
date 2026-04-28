import type { Camera2D, Camera2DTransform } from "raw2d-core";
import type { InteractionPoint, InteractionPointerInput } from "./InteractionPoint.type.js";

export type CameraControlsMode = "idle" | "panning";

export interface CameraControlsOptions {
  readonly target: HTMLCanvasElement;
  readonly camera: Camera2D;
  readonly width?: number;
  readonly height?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly zoomSpeed?: number;
  readonly panButton?: number;
  readonly preventDefault?: boolean;
  readonly onChange?: (snapshot: CameraControlsSnapshot) => void;
}

export interface CameraControlsPointerEvent extends InteractionPointerInput {
  readonly button?: number;
  readonly pointerId?: number;
  preventDefault?(): void;
}

export interface CameraControlsWheelEvent extends InteractionPointerInput {
  readonly deltaY: number;
  preventDefault?(): void;
}

export interface CameraControlsSnapshot {
  readonly mode: CameraControlsMode;
  readonly camera: Camera2DTransform;
}

export interface CameraControlsState {
  mode: CameraControlsMode;
  lastPoint: InteractionPoint | null;
}

export interface CameraControlsFeatureFlags {
  pan: boolean;
  zoom: boolean;
}

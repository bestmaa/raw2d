import type { StudioRendererMode } from "./StudioRenderer.type";

export interface StudioCameraState {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
}

export interface StudioSceneObjectState {
  readonly id: string;
  readonly type: "rect" | "circle" | "line" | "text2d" | "sprite";
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly material?: StudioMaterialState;
}

export interface StudioMaterialState {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
}

export interface StudioRectState extends StudioSceneObjectState {
  readonly type: "rect";
  readonly width: number;
  readonly height: number;
}

export interface StudioCircleState extends StudioSceneObjectState {
  readonly type: "circle";
  readonly radius: number;
}

export interface StudioLineState extends StudioSceneObjectState {
  readonly type: "line";
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface StudioTextState extends StudioSceneObjectState {
  readonly type: "text2d";
  readonly text: string;
  readonly font?: string;
}

export interface StudioSpriteState extends StudioSceneObjectState {
  readonly type: "sprite";
  readonly width: number;
  readonly height: number;
  readonly assetSlot: string;
}

export type StudioSceneObject =
  | StudioRectState
  | StudioCircleState
  | StudioLineState
  | StudioTextState
  | StudioSpriteState;

export interface StudioSceneState {
  readonly version: 1;
  readonly name: string;
  readonly rendererMode: StudioRendererMode;
  readonly camera: StudioCameraState;
  readonly objects: readonly StudioSceneObject[];
}

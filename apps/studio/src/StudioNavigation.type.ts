import type { StudioSceneState } from "./StudioSceneState.type";

export type StudioNavigationAction = "zoom-selection" | "fit-scene";

export interface StudioNavigationViewport {
  readonly width: number;
  readonly height: number;
}

export interface StudioNavigationBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface StudioMinimapItem extends StudioNavigationBounds {
  readonly id: string;
  readonly selected: boolean;
}

export interface StudioMinimapModel {
  readonly width: number;
  readonly height: number;
  readonly items: readonly StudioMinimapItem[];
  readonly viewport: StudioNavigationBounds;
}

export interface StudioNavigationOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectIds: readonly string[];
}

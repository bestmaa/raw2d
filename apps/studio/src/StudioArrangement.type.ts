import type { StudioCommand, StudioCommandApplyOptions } from "./StudioCommand.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export type StudioArrangementAction =
  | "duplicate"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-top"
  | "align-middle"
  | "align-bottom"
  | "distribute-horizontal"
  | "distribute-vertical"
  | "snap-grid";

export interface StudioArrangementResult {
  readonly scene: StudioSceneState;
  readonly selectedObjectIds: readonly string[];
}

export interface StudioArrangementCommandResult {
  readonly command: StudioCommand;
  readonly options: StudioCommandApplyOptions;
}

export interface StudioArrangementEntry {
  readonly object: StudioSceneObject;
  readonly bounds: StudioArrangementBounds;
}

export interface StudioArrangementBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

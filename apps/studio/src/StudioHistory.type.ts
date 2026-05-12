import type { StudioCommand } from "./StudioCommand.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioHistoryState {
  readonly undoStack: readonly StudioCommand[];
  readonly redoStack: readonly StudioCommand[];
  readonly limit: number;
}

export interface CreateStudioHistoryOptions {
  readonly limit?: number;
}

export interface ApplyStudioHistoryCommandOptions {
  readonly scene: StudioSceneState;
  readonly history: StudioHistoryState;
  readonly command: StudioCommand;
}

export interface UpdateStudioHistoryOptions {
  readonly scene: StudioSceneState;
  readonly history: StudioHistoryState;
}

export interface StudioHistoryResult {
  readonly scene: StudioSceneState;
  readonly history: StudioHistoryState;
  readonly handled: boolean;
}

import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioKeyboardCommand {
  readonly key: string;
  readonly shiftKey: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
}

export type StudioHistoryKeyboardAction = "undo" | "redo";

export interface StudioKeyboardResult {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly handled: boolean;
}

export interface ApplyStudioKeyboardOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly command: StudioKeyboardCommand;
}

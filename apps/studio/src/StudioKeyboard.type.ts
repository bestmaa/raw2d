import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioKeyboardCommand {
  readonly key: string;
  readonly shiftKey: boolean;
}

export interface StudioKeyboardResult {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly handled: boolean;
}

export interface ApplyStudioKeyboardOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly command: StudioKeyboardCommand;
}

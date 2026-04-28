import type { SceneLike } from "raw2d-core";
import type { SelectionManager } from "./SelectionManager.js";

export interface KeyboardControllerOptions {
  readonly target: KeyboardEventTarget;
  readonly selection: SelectionManager;
  readonly scene?: SceneLike;
  readonly moveStep?: number;
  readonly fastMoveStep?: number;
  readonly preventDefault?: boolean;
  readonly onChange?: (snapshot: KeyboardControllerSnapshot) => void;
}

export interface KeyboardEventTarget {
  addEventListener(type: "keydown", listener: (event: KeyboardControllerKeyEvent) => void): void;
  removeEventListener(type: "keydown", listener: (event: KeyboardControllerKeyEvent) => void): void;
}

export interface KeyboardControllerKeyEvent {
  readonly key: string;
  readonly shiftKey?: boolean;
  preventDefault?(): void;
}

export interface KeyboardControllerSnapshot {
  readonly selectedCount: number;
  readonly lastAction: KeyboardControllerAction;
}

export type KeyboardControllerAction = "none" | "move" | "delete" | "clear";

export interface KeyboardControllerFeatureFlags {
  move: boolean;
  delete: boolean;
  clear: boolean;
}

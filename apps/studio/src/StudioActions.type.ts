import type { StudioArrangementAction } from "./StudioArrangement.type";
import type { StudioNavigationAction } from "./StudioNavigation.type";

export type StudioAction =
  | "sample-scene"
  | "undo"
  | "redo"
  | "save-scene"
  | "load-scene"
  | "export-png"
  | "copy-selection"
  | "paste-selection"
  | "copy-canvas-code"
  | "copy-webgl-code"
  | "group"
  | "ungroup"
  | StudioArrangementAction
  | StudioNavigationAction
  | "rect"
  | "circle"
  | "line"
  | "text"
  | "sprite";

export interface StudioActionBindingOptions {
  readonly root: HTMLElement;
  readonly onAction: (action: StudioAction) => void;
}

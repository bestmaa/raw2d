export type StudioAction =
  | "sample-scene"
  | "undo"
  | "redo"
  | "save-scene"
  | "load-scene"
  | "export-png"
  | "copy-canvas-code"
  | "copy-webgl-code"
  | "rect"
  | "circle"
  | "line"
  | "text"
  | "sprite";

export interface StudioActionBindingOptions {
  readonly root: HTMLElement;
  readonly onAction: (action: StudioAction) => void;
}

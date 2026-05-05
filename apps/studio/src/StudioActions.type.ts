export type StudioAction =
  | "sample-scene"
  | "save-scene"
  | "load-scene"
  | "export-png"
  | "rect"
  | "circle"
  | "line"
  | "text"
  | "sprite";

export interface StudioActionBindingOptions {
  readonly root: HTMLElement;
  readonly onAction: (action: StudioAction) => void;
}

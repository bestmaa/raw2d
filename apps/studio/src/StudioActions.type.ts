export type StudioAction = "sample-scene" | "save-scene" | "rect" | "circle" | "line" | "text" | "sprite";

export interface StudioActionBindingOptions {
  readonly root: HTMLElement;
  readonly onAction: (action: StudioAction) => void;
}

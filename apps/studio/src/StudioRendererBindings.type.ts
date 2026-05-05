import type { StudioRendererMode } from "./StudioRenderer.type";

export interface StudioRendererBindingOptions {
  readonly root: HTMLElement;
  readonly onRendererMode: (mode: StudioRendererMode) => void;
}

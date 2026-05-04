export type StudioRendererMode = "canvas" | "webgl";

export interface StudioRendererOption {
  readonly mode: StudioRendererMode;
  readonly label: string;
  readonly description: string;
}

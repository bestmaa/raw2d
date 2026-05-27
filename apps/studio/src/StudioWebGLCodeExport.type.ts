import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioWebGLCodeExportOptions {
  readonly scene: StudioSceneState;
  readonly canvasSelector?: string;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
}

export interface CopyStudioWebGLCodeOptions extends StudioWebGLCodeExportOptions {
  readonly clipboard?: Pick<Clipboard, "writeText">;
}

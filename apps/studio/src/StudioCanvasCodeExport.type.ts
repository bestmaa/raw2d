import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioCanvasCodeExportOptions {
  readonly scene: StudioSceneState;
  readonly canvasSelector?: string;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
}

export interface CopyStudioCanvasCodeOptions extends StudioCanvasCodeExportOptions {
  readonly clipboard?: Pick<Clipboard, "writeText">;
}

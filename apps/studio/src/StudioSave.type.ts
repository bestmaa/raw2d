import type { StudioSceneState } from "./StudioSceneState.type";

export interface StudioSceneSaveDocument {
  readonly version: 1;
  readonly name: string;
  readonly rendererMode: StudioSceneState["rendererMode"];
  readonly camera: StudioSceneState["camera"];
  readonly objects: StudioSceneState["objects"];
}

export interface StudioSceneDownloadOptions {
  readonly scene: StudioSceneState;
  readonly documentRef?: Document;
  readonly urlRef?: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
}

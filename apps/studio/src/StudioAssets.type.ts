import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export interface StudioImageAssetState {
  readonly id: string;
  readonly type: "image";
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly objectIds: readonly string[];
}

export type StudioAssetState = StudioImageAssetState;

export interface StudioImageAssetInput {
  readonly id?: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly objectIds?: readonly string[];
}

export interface AddStudioImageAssetOptions {
  readonly scene: StudioSceneState;
  readonly asset: StudioImageAssetInput;
}

export interface StudioAssetLookupOptions {
  readonly scene: StudioSceneState;
  readonly assetId: string;
}

export interface StudioAssetObjectReferenceOptions extends StudioAssetLookupOptions {
  readonly objectId: StudioSceneObject["id"];
}

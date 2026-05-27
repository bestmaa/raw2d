import type { StudioMaterialState, StudioSceneObject } from "./StudioSceneState.type";

export interface StudioMcpCameraDocument {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
}

export interface StudioMcpSceneDocument {
  readonly scene: {
    readonly objects: readonly StudioMcpObjectDocument[];
  };
  readonly camera: StudioMcpCameraDocument;
}

export interface StudioMcpBaseObjectDocument {
  readonly id?: unknown;
  readonly type?: unknown;
  readonly name?: unknown;
  readonly x?: unknown;
  readonly y?: unknown;
  readonly visible?: unknown;
  readonly material?: unknown;
}

export type StudioMcpObjectDocument = StudioMcpBaseObjectDocument & Record<string, unknown>;

export interface StudioMcpIdResolution {
  readonly id: string;
  readonly warnings: readonly string[];
}

export type StudioMcpImportedObject = StudioSceneObject & {
  readonly material?: StudioMaterialState;
};

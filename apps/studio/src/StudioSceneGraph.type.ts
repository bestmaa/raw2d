import type { StudioSceneObject } from "./StudioSceneState.type";

export interface StudioSceneGraphEntry {
  readonly object: StudioSceneObject;
  readonly index: number;
  readonly depth: number;
  readonly parentId?: string;
  readonly worldX: number;
  readonly worldY: number;
}

export interface StudioSceneGraphOffset {
  readonly x: number;
  readonly y: number;
}

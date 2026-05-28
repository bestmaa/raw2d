import type { Raw2DMcpMaterialJson, Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { Raw2DMcpObjectTransformPatch } from "./updateRaw2DObjectTransform.type.js";

export type Raw2DMcpSceneEditOperationType =
  | "createObject"
  | "updateObject"
  | "deleteObject"
  | "reorderObject"
  | "setSpriteAsset"
  | "clearSpriteAsset";

export interface Raw2DMcpObjectGeometryPatch {
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly startX?: number;
  readonly startY?: number;
  readonly endX?: number;
  readonly endY?: number;
  readonly text?: string;
  readonly font?: string;
}

export interface Raw2DMcpCreateObjectOperation {
  readonly type: "createObject";
  readonly object: Raw2DMcpSceneObjectJson;
  readonly index?: number;
}

export interface Raw2DMcpUpdateObjectOperation {
  readonly type: "updateObject";
  readonly id: string;
  readonly transform?: Raw2DMcpObjectTransformPatch;
  readonly material?: Raw2DMcpMaterialJson;
  readonly geometry?: Raw2DMcpObjectGeometryPatch;
}

export interface Raw2DMcpDeleteObjectOperation {
  readonly type: "deleteObject";
  readonly id: string;
}

export interface Raw2DMcpReorderObjectOperation {
  readonly type: "reorderObject";
  readonly id: string;
  readonly index: number;
}

export interface Raw2DMcpSetSpriteAssetOperation {
  readonly type: "setSpriteAsset";
  readonly id: string;
  readonly textureId: string;
  readonly frameName?: string;
}

export interface Raw2DMcpClearSpriteAssetOperation {
  readonly type: "clearSpriteAsset";
  readonly id: string;
}

export type Raw2DMcpSceneEditOperation =
  | Raw2DMcpCreateObjectOperation
  | Raw2DMcpUpdateObjectOperation
  | Raw2DMcpDeleteObjectOperation
  | Raw2DMcpReorderObjectOperation
  | Raw2DMcpSetSpriteAssetOperation
  | Raw2DMcpClearSpriteAssetOperation;

export interface CreateRaw2DMcpSceneEditPlanOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly operations: readonly Raw2DMcpSceneEditOperation[];
}

export interface Raw2DMcpSceneEditPlanStep {
  readonly id: string;
  readonly type: Raw2DMcpSceneEditOperationType;
  readonly objectId: string;
  readonly summary: string;
}

export interface Raw2DMcpSceneEditPlan {
  readonly document: Raw2DMcpSceneDocument;
  readonly steps: readonly Raw2DMcpSceneEditPlanStep[];
  readonly affectedObjectIds: readonly string[];
  readonly beforeObjectIds: readonly string[];
  readonly afterObjectIds: readonly string[];
}

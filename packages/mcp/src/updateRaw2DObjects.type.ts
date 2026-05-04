import type { Raw2DMcpMaterialJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { Raw2DMcpObjectTransformPatch } from "./updateRaw2DObjectTransform.type.js";

export interface Raw2DMcpTransformUpdate {
  readonly id: string;
  readonly transform: Raw2DMcpObjectTransformPatch;
}

export interface Raw2DMcpMaterialUpdate {
  readonly id: string;
  readonly material: Raw2DMcpMaterialJson;
}

export interface UpdateRaw2DObjectsOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly transforms?: readonly Raw2DMcpTransformUpdate[];
  readonly materials?: readonly Raw2DMcpMaterialUpdate[];
}

export interface UpdateRaw2DObjectsResult {
  readonly document: Raw2DMcpSceneDocument;
  readonly updatedIds: readonly string[];
}

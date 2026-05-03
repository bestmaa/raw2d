import type { Raw2DMcpMaterialJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export interface UpdateRaw2DObjectMaterialOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly id: string;
  readonly material: Raw2DMcpMaterialJson;
}

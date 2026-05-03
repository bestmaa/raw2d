import type {
  Raw2DMcpOriginKeyword,
  Raw2DMcpPointJson,
  Raw2DMcpRenderModeJson
} from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export interface Raw2DMcpObjectTransformPatch {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly origin?: Raw2DMcpOriginKeyword | Raw2DMcpPointJson;
  readonly visible?: boolean;
  readonly zIndex?: number;
  readonly renderMode?: Raw2DMcpRenderModeJson;
}

export interface UpdateRaw2DObjectTransformOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly id: string;
  readonly transform: Raw2DMcpObjectTransformPatch;
}

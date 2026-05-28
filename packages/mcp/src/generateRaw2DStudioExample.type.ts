import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { Raw2DMcpStudioSceneJson } from "./Raw2DStudioSceneJson.type.js";
import type { Raw2DMcpStudioValidationResult } from "./validateRaw2DStudioScene.type.js";

export interface GenerateRaw2DStudioExampleOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly name?: string;
  readonly rendererMode?: "canvas" | "webgl";
}

export interface Raw2DMcpGeneratedStudioExample {
  readonly renderer: "studio";
  readonly filename: string;
  readonly json: string;
  readonly document: Raw2DMcpStudioSceneJson;
  readonly scene: Raw2DMcpStudioSceneJson;
  readonly validation: Raw2DMcpStudioValidationResult;
}

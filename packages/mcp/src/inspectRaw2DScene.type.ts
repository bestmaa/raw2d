import type { Raw2DMcpSceneObjectType } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export type Raw2DMcpObjectTypeCounts = Record<Raw2DMcpSceneObjectType, number>;

export interface InspectRaw2DSceneOptions {
  readonly document: Raw2DMcpSceneDocument;
}

export interface Raw2DMcpSceneInspection {
  readonly objectCount: number;
  readonly objectTypes: Raw2DMcpObjectTypeCounts;
  readonly usesTextures: boolean;
  readonly usesText: boolean;
  readonly rendererHints: readonly string[];
}

import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export type Raw2DMcpExampleRenderer = "canvas" | "webgl2";

export interface GenerateRaw2DExampleOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly canvasSelector?: string;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
}

export interface Raw2DMcpGeneratedExample {
  readonly renderer: Raw2DMcpExampleRenderer;
  readonly code: string;
}

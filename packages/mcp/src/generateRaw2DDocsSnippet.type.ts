import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export interface GenerateRaw2DDocsSnippetOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly title?: string;
  readonly renderer?: "canvas" | "webgl2";
}

export interface Raw2DMcpDocsSnippet {
  readonly title: string;
  readonly markdown: string;
}

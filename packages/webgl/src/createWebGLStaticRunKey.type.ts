import type { Camera2D } from "raw2d-core";
import type { Texture } from "raw2d-sprite";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export interface WebGLStaticRunKeyOptions {
  readonly run: WebGLRenderRun;
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly getTextureKey: (texture: Texture) => string;
}

export interface WebGLStaticRunIdentity {
  readonly runId: string;
  readonly key: string;
}

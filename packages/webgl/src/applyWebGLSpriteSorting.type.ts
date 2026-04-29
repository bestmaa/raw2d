import type { Texture } from "raw2d-sprite";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLSpriteSortingMode } from "./WebGLRenderer2D.type.js";

export interface ApplyWebGLSpriteSortingOptions {
  readonly runs: readonly WebGLRenderRun[];
  readonly mode?: WebGLSpriteSortingMode;
  readonly getTextureKey: (texture: Texture) => string;
}

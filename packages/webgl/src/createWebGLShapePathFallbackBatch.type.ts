import type { Camera2D, RenderItem } from "raw2d-core";
import type { Texture } from "raw2d-sprite";
import type { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";
import type { WebGLShapePathTextureProvider } from "./WebGLShapePathTextureCache.type.js";

export interface WebGLShapePathFallbackBatchOptions {
  readonly items: readonly RenderItem[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly curveSegments?: number;
  readonly getTextureKey: (texture: Texture) => string;
  readonly getShapePathTexture: WebGLShapePathTextureProvider;
  readonly floatBuffer?: WebGLFloatBuffer;
}

import type { Camera2D, RenderItem } from "raw2d-core";
import type { Sprite, Texture } from "raw2d-sprite";
import type { WebGLDrawBatch } from "./WebGLDrawBatch.type.js";

export interface WebGLSpriteBatchOptions {
  readonly items: readonly RenderItem[];
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly getTextureKey: (texture: Texture) => string;
}

export interface WebGLSpriteDrawBatch extends WebGLDrawBatch {
  readonly texture: Texture;
}

export interface WebGLSpriteBatch {
  readonly vertices: Float32Array;
  readonly drawBatches: readonly WebGLSpriteDrawBatch[];
  readonly sprites: number;
  readonly textures: number;
  readonly unsupported: number;
}

export type WebGLSpriteItem = RenderItem<Sprite>;


import type { Object2DOptions } from "raw2d-core";
import type { Texture } from "./Texture.js";
import type { TextureFrame } from "./TextureAtlas.type.js";

export interface SpriteOptions extends Object2DOptions {
  readonly texture: Texture;
  readonly frame?: TextureFrame | null;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}

export interface SpriteSize {
  readonly width: number;
  readonly height: number;
}

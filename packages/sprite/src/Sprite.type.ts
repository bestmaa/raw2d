import type { Object2DOptions } from "raw2d-core";
import type { Texture } from "./Texture.js";

export interface SpriteOptions extends Object2DOptions {
  readonly texture: Texture;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}

export interface SpriteSize {
  readonly width: number;
  readonly height: number;
}

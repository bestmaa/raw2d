import type { Texture } from "./Texture.js";

export interface TextureFrame {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TextureAtlasOptions {
  readonly texture: Texture;
  readonly frames?: Readonly<Record<string, TextureFrame>>;
}

export interface TextureAtlasFrameOptions extends TextureFrame {
  readonly name: string;
}

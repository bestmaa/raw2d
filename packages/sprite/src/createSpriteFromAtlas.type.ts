import type { Object2DOptions } from "raw2d-core";
import type { Sprite } from "./Sprite.js";
import type { TextureAtlas } from "./TextureAtlas.js";

export interface CreateSpriteFromAtlasOptions extends Object2DOptions {
  readonly atlas: TextureAtlas;
  readonly frame: string;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}

export interface CreateSpritesFromAtlasOptions {
  readonly atlas: TextureAtlas;
  readonly sprites: Readonly<Record<string, CreateSpriteFromAtlasEntry>>;
}

export interface CreateSpriteFromAtlasEntry extends Object2DOptions {
  readonly frame: string;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}

export type SpriteAtlasMap = Readonly<Record<string, Sprite>>;

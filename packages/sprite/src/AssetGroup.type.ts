import type { Texture } from "./Texture.js";
import type { TextureAtlas } from "./TextureAtlas.js";

export interface AssetGroupOptions {
  readonly textures?: ReadonlyMap<string, Texture>;
  readonly atlases?: ReadonlyMap<string, TextureAtlas>;
  readonly errors?: ReadonlyMap<string, Error>;
}

export interface AssetGroupSnapshot {
  readonly textureNames: readonly string[];
  readonly atlasNames: readonly string[];
  readonly errorNames: readonly string[];
}


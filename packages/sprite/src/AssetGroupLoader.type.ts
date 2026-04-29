import type { Texture } from "./Texture.js";
import type { TextureAtlas } from "./TextureAtlas.js";
import type { TextureAtlasLoaderLoadOptions } from "./TextureAtlasLoader.type.js";
import type { TextureLoaderLoadOptions } from "./TextureLoader.type.js";

export type AssetGroupAssetKind = "texture" | "atlas";

export type AssetGroupManifest = Readonly<Record<string, AssetGroupManifestEntry>>;

export type AssetGroupManifestEntry = string | AssetGroupTextureEntry | AssetGroupAtlasEntry;

export interface AssetGroupTextureEntry extends TextureLoaderLoadOptions {
  readonly type: "texture";
  readonly url: string;
}

export interface AssetGroupAtlasEntry extends TextureAtlasLoaderLoadOptions {
  readonly type: "atlas";
  readonly url: string;
}

export interface AssetGroupProgressEvent {
  readonly name: string;
  readonly kind: AssetGroupAssetKind;
  readonly loaded: number;
  readonly total: number;
  readonly status: "loaded" | "failed";
  readonly error?: Error;
}

export interface AssetGroupLoaderOptions {
  readonly textureLoader?: AssetGroupTextureLoader;
  readonly atlasLoader?: AssetGroupAtlasLoader;
  readonly onProgress?: (event: AssetGroupProgressEvent) => void;
  readonly failFast?: boolean;
}

export interface AssetGroupLoadOptions {
  readonly onProgress?: (event: AssetGroupProgressEvent) => void;
  readonly failFast?: boolean;
}

export interface AssetGroupTextureLoader {
  load(url: string, options?: TextureLoaderLoadOptions): Promise<Texture>;
  clearCache?(): void;
}

export interface AssetGroupAtlasLoader {
  load(url: string, options?: TextureAtlasLoaderLoadOptions): Promise<TextureAtlas>;
  clearCache?(): void;
}

export interface AssetGroupLoadedEntry {
  readonly name: string;
  readonly kind: AssetGroupAssetKind;
  readonly texture?: Texture;
  readonly atlas?: TextureAtlas;
  readonly error?: Error;
}


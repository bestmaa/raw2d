import type { Texture } from "./Texture.js";
import type { TextureLoaderCrossOrigin } from "./TextureLoader.type.js";

export interface TextureAtlasData {
  readonly image: string;
  readonly frames: Readonly<Record<string, TextureAtlasLoaderFrame>>;
}

export interface TextureAtlasLoaderFrame {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TextureAtlasLoaderResponse {
  readonly ok?: boolean;
  readonly status?: number;
  json(): Promise<unknown>;
}

export interface TextureAtlasTextureLoader {
  load(url: string, options?: TextureAtlasTextureLoadOptions): Promise<Texture>;
}

export interface TextureAtlasTextureLoadOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly cache?: boolean;
}

export interface TextureAtlasLoaderOptions {
  readonly baseUrl?: string;
  readonly cache?: boolean;
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly fetch?: (url: string) => Promise<TextureAtlasLoaderResponse>;
  readonly textureLoader?: TextureAtlasTextureLoader;
}

export interface TextureAtlasLoaderLoadOptions {
  readonly baseUrl?: string;
  readonly cache?: boolean;
  readonly crossOrigin?: TextureLoaderCrossOrigin;
}

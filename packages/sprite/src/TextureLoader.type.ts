export type TextureLoaderCrossOrigin = "" | "anonymous" | "use-credentials";

export interface TextureLoaderOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly cache?: boolean;
}

export interface TextureLoaderLoadOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly cache?: boolean;
}

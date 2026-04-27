export type TextureLoaderCrossOrigin = "" | "anonymous" | "use-credentials";

export interface TextureLoaderOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
}

export interface TextureLoaderLoadOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
}

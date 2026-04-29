export type TextureLoaderCrossOrigin = "" | "anonymous" | "use-credentials";

export interface TextureLoaderImageElement {
  crossOrigin: string | null;
  src: string;
  readonly naturalWidth: number;
  readonly naturalHeight: number;
  addEventListener(type: "load" | "error", listener: () => void): void;
  removeEventListener(type: "load" | "error", listener: () => void): void;
  decode?: () => Promise<void>;
}

export type TextureLoaderCreateImage = () => TextureLoaderImageElement;

export type TextureLoaderCreateImageBitmap = (
  source: ImageBitmapSource,
  options?: ImageBitmapOptions
) => Promise<ImageBitmap>;

export interface TextureLoaderOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly cache?: boolean;
  readonly decode?: boolean;
  readonly imageBitmap?: boolean;
  readonly imageBitmapOptions?: ImageBitmapOptions;
  readonly createImage?: TextureLoaderCreateImage;
  readonly createImageBitmap?: TextureLoaderCreateImageBitmap;
}

export interface TextureLoaderLoadOptions {
  readonly crossOrigin?: TextureLoaderCrossOrigin;
  readonly cache?: boolean;
  readonly decode?: boolean;
  readonly imageBitmap?: boolean;
  readonly imageBitmapOptions?: ImageBitmapOptions;
  readonly width?: number;
  readonly height?: number;
  readonly id?: string;
  readonly cacheKey?: string;
}

export interface TextureLoaderSourceOptions {
  readonly width?: number;
  readonly height?: number;
  readonly id?: string;
  readonly url?: string;
}

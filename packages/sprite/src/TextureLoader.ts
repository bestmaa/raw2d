import { Texture } from "./Texture.js";
import type { TextureSource } from "./Texture.type.js";
import type {
  TextureLoaderCreateImage,
  TextureLoaderCreateImageBitmap,
  TextureLoaderCrossOrigin,
  TextureLoaderImageElement,
  TextureLoaderLoadOptions,
  TextureLoaderOptions,
  TextureLoaderSourceOptions
} from "./TextureLoader.type.js";

export class TextureLoader {
  private readonly crossOrigin?: TextureLoaderCrossOrigin;
  private readonly cacheEnabled: boolean;
  private readonly decodeEnabled: boolean;
  private readonly imageBitmapEnabled: boolean;
  private readonly imageBitmapOptions?: ImageBitmapOptions;
  private readonly createImage: TextureLoaderCreateImage;
  private readonly createBitmap: TextureLoaderCreateImageBitmap;
  private readonly cache = new Map<string, Promise<Texture>>();

  public constructor(options: TextureLoaderOptions = {}) {
    this.crossOrigin = options.crossOrigin;
    this.cacheEnabled = options.cache ?? false;
    this.decodeEnabled = options.decode ?? true;
    this.imageBitmapEnabled = options.imageBitmap ?? false;
    this.imageBitmapOptions = options.imageBitmapOptions;
    this.createImage = options.createImage ?? defaultCreateImage;
    this.createBitmap = options.createImageBitmap ?? defaultCreateImageBitmap;
  }

  public load(url: string, options: TextureLoaderLoadOptions = {}): Promise<Texture> {
    const cacheEnabled = options.cache ?? this.cacheEnabled;

    if (!cacheEnabled) {
      return this.loadImage(url, options);
    }

    const key = createCacheKey(url, options.crossOrigin ?? this.crossOrigin);
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    const promise = this.loadImage(url, options);
    this.cache.set(key, promise);
    promise.catch(() => {
      this.cache.delete(key);
    });
    return promise;
  }

  public fromSource(source: TextureSource, options: TextureLoaderSourceOptions = {}): Texture {
    return new Texture({
      source,
      width: options.width,
      height: options.height,
      id: options.id,
      url: options.url
    });
  }

  public deleteFromCache(url: string, options: TextureLoaderLoadOptions = {}): boolean {
    const key = createCacheKey(url, options.crossOrigin ?? this.crossOrigin, options.cacheKey);
    return this.cache.delete(key);
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public dispose(): void {
    this.clearCache();
  }

  private async loadImage(url: string, options: TextureLoaderLoadOptions): Promise<Texture> {
    const image = this.createImage();
    const crossOrigin = options.crossOrigin ?? this.crossOrigin;

    if (crossOrigin !== undefined) {
      image.crossOrigin = crossOrigin;
    }

    const loaded = waitForImage(image, url);
    image.src = url;
    await loaded;

    if ((options.decode ?? this.decodeEnabled) && image.decode) {
      await image.decode();
    }

    const source = await this.createTextureSource(image, options);

    return new Texture({
      source,
      width: options.width,
      height: options.height,
      id: options.id,
      url
    });
  }

  private async createTextureSource(image: TextureLoaderImageElement, options: TextureLoaderLoadOptions): Promise<TextureSource> {
    const useBitmap = options.imageBitmap ?? this.imageBitmapEnabled;

    if (!useBitmap) {
      return image as unknown as TextureSource;
    }

    return this.createBitmap(image as unknown as ImageBitmapSource, options.imageBitmapOptions ?? this.imageBitmapOptions);
  }
}

function waitForImage(image: TextureLoaderImageElement, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
    const handleLoad = (): void => {
      cleanup();
      resolve();
    };
    const handleError = (): void => {
      cleanup();
      reject(new Error(`Failed to load texture: ${url}`));
    };

    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
  });
}

function defaultCreateImage(): TextureLoaderImageElement {
  if (typeof Image === "undefined") {
    throw new Error("TextureLoader requires a browser Image implementation or a custom createImage option.");
  }

  return new Image();
}

function defaultCreateImageBitmap(source: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap> {
  if (typeof createImageBitmap === "undefined") {
    throw new Error("TextureLoader imageBitmap mode requires createImageBitmap support or a custom createImageBitmap option.");
  }

  return createImageBitmap(source, options);
}

function createCacheKey(url: string, crossOrigin?: TextureLoaderCrossOrigin, cacheKey?: string): string {
  return cacheKey ?? `${crossOrigin ?? "none"}:${url}`;
}

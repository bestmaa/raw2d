import { Texture } from "./Texture.js";
import type { TextureLoaderLoadOptions, TextureLoaderOptions } from "./TextureLoader.type.js";

export class TextureLoader {
  private readonly crossOrigin?: "" | "anonymous" | "use-credentials";
  private readonly cacheEnabled: boolean;
  private readonly cache = new Map<string, Promise<Texture>>();

  public constructor(options: TextureLoaderOptions = {}) {
    this.crossOrigin = options.crossOrigin;
    this.cacheEnabled = options.cache ?? false;
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
    return promise;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private loadImage(url: string, options: TextureLoaderLoadOptions): Promise<Texture> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const crossOrigin = options.crossOrigin ?? this.crossOrigin;

      if (crossOrigin !== undefined) {
        image.crossOrigin = crossOrigin;
      }

      image.addEventListener("load", () => {
        resolve(new Texture({ source: image }));
      });
      image.addEventListener("error", () => {
        reject(new Error(`Failed to load texture: ${url}`));
      });
      image.src = url;
    });
  }
}

function createCacheKey(url: string, crossOrigin?: "" | "anonymous" | "use-credentials"): string {
  return `${crossOrigin ?? "none"}:${url}`;
}

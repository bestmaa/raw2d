import { TextureAtlas } from "./TextureAtlas.js";
import { TextureLoader } from "./TextureLoader.js";
import type {
  TextureAtlasData,
  TextureAtlasLoaderLoadOptions,
  TextureAtlasLoaderOptions,
  TextureAtlasLoaderResponse,
  TextureAtlasTextureLoader
} from "./TextureAtlasLoader.type.js";

export class TextureAtlasLoader {
  private readonly baseUrl?: string;
  private readonly cacheEnabled: boolean;
  private readonly crossOrigin?: "" | "anonymous" | "use-credentials";
  private readonly fetchJson: (url: string) => Promise<TextureAtlasLoaderResponse>;
  private readonly textureLoader: TextureAtlasTextureLoader;
  private readonly cache = new Map<string, Promise<TextureAtlas>>();

  public constructor(options: TextureAtlasLoaderOptions = {}) {
    this.baseUrl = options.baseUrl;
    this.cacheEnabled = options.cache ?? false;
    this.crossOrigin = options.crossOrigin;
    this.fetchJson = options.fetch ?? ((url) => fetch(url));
    this.textureLoader = options.textureLoader ?? new TextureLoader({
      cache: options.cache,
      crossOrigin: options.crossOrigin
    });
  }

  public load(url: string, options: TextureAtlasLoaderLoadOptions = {}): Promise<TextureAtlas> {
    const cacheEnabled = options.cache ?? this.cacheEnabled;
    const key = createCacheKey(url, options.baseUrl ?? this.baseUrl);

    if (cacheEnabled) {
      const cached = this.cache.get(key);

      if (cached) {
        return cached;
      }
    }

    const promise = this.loadAtlas(url, options);

    if (cacheEnabled) {
      this.cache.set(key, promise);
    }

    return promise;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private async loadAtlas(url: string, options: TextureAtlasLoaderLoadOptions): Promise<TextureAtlas> {
    const atlasUrl = resolveUrl(url, options.baseUrl ?? this.baseUrl);
    const response = await this.fetchJson(atlasUrl);

    if (response.ok === false) {
      throw new Error(`Failed to load texture atlas: ${atlasUrl} (${response.status ?? "unknown"})`);
    }

    const data = parseAtlasData(await response.json());
    const texture = await this.textureLoader.load(resolveUrl(data.image, getDirectoryUrl(atlasUrl)), {
      cache: options.cache ?? this.cacheEnabled,
      crossOrigin: options.crossOrigin ?? this.crossOrigin
    });
    return new TextureAtlas({ texture, frames: data.frames });
  }
}

function parseAtlasData(value: unknown): TextureAtlasData {
  if (!isObject(value) || typeof value.image !== "string" || !isFrames(value.frames)) {
    throw new Error("Invalid texture atlas data.");
  }

  return {
    image: value.image,
    frames: value.frames
  };
}

function isFrames(value: unknown): value is TextureAtlasData["frames"] {
  if (!isObject(value)) {
    return false;
  }

  return Object.values(value).every(isFrame);
}

function isFrame(value: unknown): value is TextureAtlasData["frames"][string] {
  return (
    isObject(value) &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.width === "number" &&
    typeof value.height === "number"
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveUrl(url: string, baseUrl?: string): string {
  if (!baseUrl) {
    return url;
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return joinRelativeUrl(baseUrl, url);
  }
}

function getDirectoryUrl(url: string): string {
  try {
    return new URL(".", url).toString();
  } catch {
    const slashIndex = url.lastIndexOf("/");
    return slashIndex >= 0 ? url.slice(0, slashIndex + 1) : "";
  }
}

function createCacheKey(url: string, baseUrl?: string): string {
  return `${baseUrl ?? ""}:${url}`;
}

function joinRelativeUrl(baseUrl: string, url: string): string {
  if (url.startsWith("/") || baseUrl.endsWith("/")) {
    return `${baseUrl}${url}`;
  }

  return `${baseUrl}/${url}`;
}

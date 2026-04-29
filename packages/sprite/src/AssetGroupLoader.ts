import { AssetGroup } from "./AssetGroup.js";
import type {
  AssetGroupAtlasEntry,
  AssetGroupAtlasLoader,
  AssetGroupAssetKind,
  AssetGroupLoadOptions,
  AssetGroupLoadedEntry,
  AssetGroupLoaderOptions,
  AssetGroupManifest,
  AssetGroupManifestEntry,
  AssetGroupProgressEvent,
  AssetGroupTextureEntry,
  AssetGroupTextureLoader
} from "./AssetGroupLoader.type.js";
import type { Texture } from "./Texture.js";
import type { TextureAtlas } from "./TextureAtlas.js";
import { TextureAtlasLoader } from "./TextureAtlasLoader.js";
import { TextureLoader } from "./TextureLoader.js";

export class AssetGroupLoader {
  private readonly textureLoader: AssetGroupTextureLoader;
  private readonly atlasLoader: AssetGroupAtlasLoader;
  private readonly onProgress?: (event: AssetGroupProgressEvent) => void;
  private readonly failFast: boolean;

  public constructor(options: AssetGroupLoaderOptions = {}) {
    this.textureLoader = options.textureLoader ?? new TextureLoader({ cache: true });
    this.atlasLoader = options.atlasLoader ?? new TextureAtlasLoader({
      cache: true,
      textureLoader: this.textureLoader
    });
    this.onProgress = options.onProgress;
    this.failFast = options.failFast ?? true;
  }

  public async load(manifest: AssetGroupManifest, options: AssetGroupLoadOptions = {}): Promise<AssetGroup> {
    const entries = Object.entries(manifest);
    const total = entries.length;
    let loaded = 0;

    const results = await Promise.all(entries.map(async ([name, entry]) => {
      const normalized = normalizeEntry(entry);

      try {
        const result = await this.loadEntry(name, normalized);
        loaded += 1;
        this.emitProgress(name, normalized.type, loaded, total, "loaded", options);
        return result;
      } catch (cause) {
        const error = toError(cause);
        loaded += 1;
        this.emitProgress(name, normalized.type, loaded, total, "failed", options, error);

        if (options.failFast ?? this.failFast) {
          throw error;
        }

        return { name, kind: normalized.type, error };
      }
    }));

    return createGroup(results);
  }

  public clearCache(): void {
    this.textureLoader.clearCache?.();
    this.atlasLoader.clearCache?.();
  }

  public dispose(): void {
    this.clearCache();
  }

  private async loadEntry(name: string, entry: AssetGroupTextureEntry | AssetGroupAtlasEntry): Promise<AssetGroupLoadedEntry> {
    if (entry.type === "texture") {
      const texture = await this.textureLoader.load(entry.url, entry);
      return { name, kind: "texture", texture };
    }

    const atlas = await this.atlasLoader.load(entry.url, entry);
    return { name, kind: "atlas", atlas };
  }

  private emitProgress(
    name: string,
    kind: AssetGroupAssetKind,
    loaded: number,
    total: number,
    status: "loaded" | "failed",
    options: AssetGroupLoadOptions,
    error?: Error
  ): void {
    const event: AssetGroupProgressEvent = { name, kind, loaded, total, status, error };
    this.onProgress?.(event);
    options.onProgress?.(event);
  }
}

function normalizeEntry(entry: AssetGroupManifestEntry): AssetGroupTextureEntry | AssetGroupAtlasEntry {
  if (typeof entry === "string") {
    return { type: "texture", url: entry };
  }

  return entry;
}

function createGroup(results: readonly AssetGroupLoadedEntry[]): AssetGroup {
  const textures = new Map<string, Texture>();
  const atlases = new Map<string, TextureAtlas>();
  const errors = new Map<string, Error>();

  for (const result of results) {
    if (result.texture) {
      textures.set(result.name, result.texture);
    } else if (result.atlas) {
      atlases.set(result.name, result.atlas);
    } else if (result.error) {
      errors.set(result.name, result.error);
    }
  }

  return new AssetGroup({ textures, atlases, errors });
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}

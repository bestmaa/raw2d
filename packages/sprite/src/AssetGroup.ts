import type { AssetGroupOptions, AssetGroupSnapshot } from "./AssetGroup.type.js";
import type { Texture } from "./Texture.js";
import type { TextureAtlas } from "./TextureAtlas.js";
import type { TextureAtlasPackerStats } from "./TextureAtlasPacker.type.js";

export class AssetGroup {
  private readonly textures = new Map<string, Texture>();
  private readonly atlases = new Map<string, TextureAtlas>();
  private readonly atlasPackingStats = new Map<string, TextureAtlasPackerStats>();
  private readonly errors = new Map<string, Error>();

  public constructor(options: AssetGroupOptions = {}) {
    copyMap(options.textures, this.textures);
    copyMap(options.atlases, this.atlases);
    copyMap(options.atlasPackingStats, this.atlasPackingStats);
    copyMap(options.errors, this.errors);
  }

  public getTexture(name: string): Texture {
    const texture = this.textures.get(name);

    if (!texture) {
      throw new Error(`Texture asset not found: ${name}`);
    }

    return texture;
  }

  public getAtlas(name: string): TextureAtlas {
    const atlas = this.atlases.get(name);

    if (!atlas) {
      throw new Error(`Texture atlas asset not found: ${name}`);
    }

    return atlas;
  }

  public getError(name: string): Error | null {
    return this.errors.get(name) ?? null;
  }

  public getAtlasPackingStats(name: string): TextureAtlasPackerStats {
    const stats = this.atlasPackingStats.get(name);

    if (!stats) {
      throw new Error(`Texture atlas packing stats not found: ${name}`);
    }

    return stats;
  }

  public hasTexture(name: string): boolean {
    return this.textures.has(name);
  }

  public hasAtlas(name: string): boolean {
    return this.atlases.has(name);
  }

  public hasError(name: string): boolean {
    return this.errors.has(name);
  }

  public hasAtlasPackingStats(name: string): boolean {
    return this.atlasPackingStats.has(name);
  }

  public getTextureNames(): readonly string[] {
    return [...this.textures.keys()];
  }

  public getAtlasNames(): readonly string[] {
    return [...this.atlases.keys()];
  }

  public getErrorNames(): readonly string[] {
    return [...this.errors.keys()];
  }

  public getAtlasPackingStatsNames(): readonly string[] {
    return [...this.atlasPackingStats.keys()];
  }

  public getSnapshot(): AssetGroupSnapshot {
    return {
      textureNames: this.getTextureNames(),
      atlasNames: this.getAtlasNames(),
      atlasPackingStatsNames: this.getAtlasPackingStatsNames(),
      errorNames: this.getErrorNames()
    };
  }

  public dispose(): void {
    const uniqueTextures = new Set<Texture>(this.textures.values());

    for (const atlas of this.atlases.values()) {
      uniqueTextures.add(atlas.texture);
    }

    for (const texture of uniqueTextures) {
      texture.dispose();
    }
  }
}

function copyMap<TKey, TValue>(source: ReadonlyMap<TKey, TValue> | undefined, target: Map<TKey, TValue>): void {
  if (!source) {
    return;
  }

  for (const [key, value] of source) {
    target.set(key, value);
  }
}

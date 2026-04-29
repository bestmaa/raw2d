import { Texture } from "raw2d-sprite";
import type { Text2D } from "raw2d-text";
import { createWebGLTextTextureKey } from "./createWebGLTextTextureKey.js";
import { drawWebGLTextTexture } from "./drawWebGLTextTexture.js";
import { getWebGLTextContext } from "./getWebGLTextContext.js";
import { measureWebGLTextMetrics } from "./measureWebGLTextMetrics.js";
import type { WebGLTextTextureCacheOptions, WebGLTextTextureCacheStats, WebGLTextTextureEntry } from "./WebGLTextTextureCache.type.js";

interface CachedTextTexture {
  readonly key: string;
  readonly entry: WebGLTextTextureEntry;
}

export class WebGLTextTextureCache {
  private readonly cache = new Map<string, CachedTextTexture>();
  private readonly options: WebGLTextTextureCacheOptions;
  private readonly padding: number;
  private readonly maxEntries: number;
  private readonly retiredTextures: Texture[] = [];
  private readonly usedThisFrame = new Set<string>();
  private frameStats = createEmptyTextTextureCacheStats();

  public constructor(options: WebGLTextTextureCacheOptions = {}) {
    this.options = options;
    this.padding = Math.max(0, options.padding ?? 2);
    this.maxEntries = Math.max(1, Math.floor(options.maxEntries ?? 256));
  }

  public get(text: Text2D): WebGLTextTextureEntry {
    const existing = this.cache.get(text.id);
    const key = createWebGLTextTextureKey(text);
    this.usedThisFrame.add(text.id);

    if (existing && existing.key === key) {
      this.cache.delete(text.id);
      this.cache.set(text.id, existing);
      this.frameStats.hits += 1;
      return existing.entry;
    }

    if (existing) {
      this.retiredTextures.push(existing.entry.texture);
      this.frameStats.retired += 1;
    }

    const entry = this.createEntry(text, key);
    this.cache.set(text.id, { key, entry });
    this.frameStats.misses += 1;
    this.evictOverflow();
    return entry;
  }

  public delete(text: Text2D): boolean {
    const existing = this.cache.get(text.id);

    if (!existing) {
      return false;
    }

    this.retiredTextures.push(existing.entry.texture);
    this.frameStats.retired += 1;
    this.cache.delete(text.id);
    return true;
  }

  public clear(): void {
    for (const existing of this.cache.values()) {
      this.retiredTextures.push(existing.entry.texture);
    }

    this.cache.clear();
  }

  public getSize(): number {
    return this.cache.size;
  }

  public beginFrame(): void {
    this.frameStats = createEmptyTextTextureCacheStats();
    this.usedThisFrame.clear();
  }

  public getStats(): WebGLTextTextureCacheStats {
    return {
      size: this.cache.size,
      used: this.usedThisFrame.size,
      hits: this.frameStats.hits,
      misses: this.frameStats.misses,
      evictions: this.frameStats.evictions,
      retired: this.frameStats.retired
    };
  }

  public drainRetiredTextures(): readonly Texture[] {
    const textures = this.retiredTextures.slice();
    this.retiredTextures.length = 0;
    return textures;
  }

  public dispose(): void {
    this.clear();
    this.retiredTextures.length = 0;
  }

  private createEntry(text: Text2D, key: string): WebGLTextTextureEntry {
    const measureCanvas = this.createCanvas(1, 1);
    const metrics = measureWebGLTextMetrics(measureCanvas, text);
    const padding = this.padding + metrics.strokeWidth;
    const width = Math.max(1, Math.ceil(metrics.width + padding * 2));
    const height = Math.max(1, Math.ceil(metrics.height + padding * 2));
    const canvas = this.createCanvas(width, height);
    const context = getTextContext(canvas);

    drawWebGLTextTexture({ context, text, metrics, padding, width, height });

    return {
      texture: new Texture({ source: canvas, width, height }),
      key,
      localX: metrics.localX - padding,
      localY: metrics.localY - padding,
      width,
      height
    };
  }

  private createCanvas(width: number, height: number): HTMLCanvasElement {
    if (this.options.createCanvas) {
      return this.options.createCanvas(width, height);
    }

    if (typeof document === "undefined") {
      throw new Error("WebGL Text2D rendering needs document.createElement or createTextCanvas.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private evictOverflow(): void {
    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;

      if (oldestKey === undefined) {
        return;
      }

      const oldest = this.cache.get(oldestKey);

      if (oldest) {
        this.retiredTextures.push(oldest.entry.texture);
        this.frameStats.evictions += 1;
        this.frameStats.retired += 1;
      }

      this.cache.delete(oldestKey);
    }
  }
}

function getTextContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return getWebGLTextContext(canvas);
}

interface MutableTextTextureCacheStats {
  hits: number;
  misses: number;
  evictions: number;
  retired: number;
}

function createEmptyTextTextureCacheStats(): MutableTextTextureCacheStats {
  return {
    hits: 0,
    misses: 0,
    evictions: 0,
    retired: 0
  };
}

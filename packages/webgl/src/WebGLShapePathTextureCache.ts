import { getShapePathLocalBounds, type PathCommand, type ShapePath } from "raw2d-core";
import { Texture } from "raw2d-sprite";
import type {
  WebGLShapePathTextureCacheOptions,
  WebGLShapePathTextureCacheStats,
  WebGLShapePathTextureEntry
} from "./WebGLShapePathTextureCache.type.js";

interface CachedShapePathTexture {
  readonly key: string;
  readonly entry: WebGLShapePathTextureEntry;
}

interface MutableShapePathTextureStats {
  hits: number;
  misses: number;
  evictions: number;
  retired: number;
}

export class WebGLShapePathTextureCache {
  private readonly cache = new Map<string, CachedShapePathTexture>();
  private readonly retiredTextures: Texture[] = [];
  private readonly options: WebGLShapePathTextureCacheOptions;
  private readonly padding: number;
  private readonly maxEntries: number;
  private frameStats = createEmptyStats();

  public constructor(options: WebGLShapePathTextureCacheOptions = {}) {
    this.options = options;
    this.padding = Math.max(0, options.padding ?? 2);
    this.maxEntries = Math.max(1, Math.floor(options.maxEntries ?? 128));
  }

  public get(shapePath: ShapePath): WebGLShapePathTextureEntry {
    const existing = this.cache.get(shapePath.id);
    const key = createShapePathTextureKey(shapePath);

    if (existing && existing.key === key) {
      this.cache.delete(shapePath.id);
      this.cache.set(shapePath.id, existing);
      this.frameStats.hits += 1;
      return existing.entry;
    }

    if (existing) {
      this.retiredTextures.push(existing.entry.texture);
      this.frameStats.retired += 1;
    }

    const entry = this.createEntry(shapePath, key);
    this.cache.set(shapePath.id, { key, entry });
    this.frameStats.misses += 1;
    this.evictOverflow();
    return entry;
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
    this.frameStats = createEmptyStats();
  }

  public getStats(): WebGLShapePathTextureCacheStats {
    return { size: this.cache.size, ...this.frameStats };
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

  private createEntry(shapePath: ShapePath, key: string): WebGLShapePathTextureEntry {
    const bounds = getShapePathLocalBounds(shapePath);
    const width = Math.max(1, Math.ceil(bounds.width + this.padding * 2));
    const height = Math.max(1, Math.ceil(bounds.height + this.padding * 2));
    const canvas = this.createCanvas(width, height);
    const context = getShapePathContext(canvas);

    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(this.padding - bounds.x, this.padding - bounds.y);
    writePath(context, shapePath.commands);
    context.fillStyle = shapePath.material.fillColor;
    context.fill();
    context.restore();

    return {
      texture: new Texture({ source: canvas, width, height }),
      key,
      localX: bounds.x - this.padding - (bounds.x + bounds.width * shapePath.originX),
      localY: bounds.y - this.padding - (bounds.y + bounds.height * shapePath.originY),
      width,
      height
    };
  }

  private createCanvas(width: number, height: number): HTMLCanvasElement {
    if (this.options.createCanvas) {
      return this.options.createCanvas(width, height);
    }

    if (typeof document === "undefined") {
      throw new Error("WebGL ShapePath fallback needs document.createElement or createShapePathCanvas.");
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

function writePath(context: CanvasRenderingContext2D, commands: readonly PathCommand[]): void {
  context.beginPath();

  for (const command of commands) {
    if (command.type === "moveTo") {
      context.moveTo(command.x, command.y);
    } else if (command.type === "lineTo") {
      context.lineTo(command.x, command.y);
    } else if (command.type === "quadraticCurveTo") {
      context.quadraticCurveTo(command.cpx, command.cpy, command.x, command.y);
    } else if (command.type === "bezierCurveTo") {
      context.bezierCurveTo(command.cp1x, command.cp1y, command.cp2x, command.cp2y, command.x, command.y);
    } else {
      context.closePath();
    }
  }
}

function createShapePathTextureKey(shapePath: ShapePath): string {
  return [JSON.stringify(shapePath.commands), shapePath.material.fillColor, shapePath.fill].join("|");
}

function getShapePathContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("WebGL ShapePath fallback needs a 2D canvas context.");
  }

  return context;
}

function createEmptyStats(): MutableShapePathTextureStats {
  return { hits: 0, misses: 0, evictions: 0, retired: 0 };
}

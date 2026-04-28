import { Texture } from "raw2d-sprite";
import type { Text2D } from "raw2d-text";
import type { WebGLTextTextureCacheOptions, WebGLTextTextureEntry } from "./WebGLTextTextureCache.type.js";

interface CachedTextTexture {
  readonly key: string;
  readonly entry: WebGLTextTextureEntry;
}

export class WebGLTextTextureCache {
  private readonly cache = new Map<string, CachedTextTexture>();
  private readonly options: WebGLTextTextureCacheOptions;
  private readonly padding: number;

  public constructor(options: WebGLTextTextureCacheOptions = {}) {
    this.options = options;
    this.padding = Math.max(0, options.padding ?? 2);
  }

  public get(text: Text2D): WebGLTextTextureEntry {
    const existing = this.cache.get(text.id);
    const key = createTextTextureKey(text);

    if (existing && existing.key === key) {
      return existing.entry;
    }

    const entry = this.createEntry(text, key);
    this.cache.set(text.id, { key, entry });
    return entry;
  }

  private createEntry(text: Text2D, key: string): WebGLTextTextureEntry {
    const measureCanvas = this.createCanvas(1, 1);
    const metrics = measureText(measureCanvas, text);
    const width = Math.max(1, Math.ceil(metrics.width + this.padding * 2));
    const height = Math.max(1, Math.ceil(metrics.height + this.padding * 2));
    const canvas = this.createCanvas(width, height);
    const context = getTextContext(canvas);

    context.clearRect(0, 0, width, height);
    context.font = text.font;
    context.textAlign = text.align;
    context.textBaseline = text.baseline;
    context.fillStyle = text.material.fillColor;
    context.fillText(text.text, this.padding - metrics.localX, this.padding - metrics.localY);

    return {
      texture: new Texture({ source: canvas, width, height }),
      key,
      localX: metrics.localX - this.padding,
      localY: metrics.localY - this.padding,
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
}

function measureText(canvas: HTMLCanvasElement, text: Text2D): TextMetricsBox {
  const context = getTextContext(canvas);
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;
  const metrics = context.measureText(text.text);
  const estimatedSize = estimateFontSize(text.font);
  const measuredWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const measuredHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    localX: measuredWidth > 0 ? -metrics.actualBoundingBoxLeft : 0,
    localY: measuredHeight > 0 ? -metrics.actualBoundingBoxAscent : -estimatedSize * 0.8,
    width: Math.max(1, measuredWidth || metrics.width || estimatedSize),
    height: Math.max(1, measuredHeight || estimatedSize)
  };
}

function getTextContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("WebGL Text2D rendering needs a 2D canvas context.");
  }

  return context;
}

function createTextTextureKey(text: Text2D): string {
  return [
    text.text,
    text.font,
    text.align,
    text.baseline,
    text.material.fillColor,
    text.version,
    text.material.version
  ].join("|");
}

function estimateFontSize(font: string): number {
  const match = /(\d+(?:\.\d+)?)px/.exec(font);
  return match ? Number(match[1]) : 16;
}

interface TextMetricsBox {
  readonly localX: number;
  readonly localY: number;
  readonly width: number;
  readonly height: number;
}

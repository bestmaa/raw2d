import { Texture } from "./Texture.js";
import { TextureAtlas } from "./TextureAtlas.js";
import type { TextureFrame } from "./TextureAtlas.type.js";
import { createTextureAtlasPackerStats } from "./createTextureAtlasPackerStats.js";
import { sortTextureAtlasPackerItems } from "./sortTextureAtlasPackerItems.js";
import type {
  TextureAtlasPackerCanvas,
  TextureAtlasPackerContext,
  TextureAtlasPackerItem,
  TextureAtlasPackerOptions,
  TextureAtlasPackerResult,
  TextureAtlasPackerSort
} from "./TextureAtlasPacker.type.js";
import type { TextureSource } from "./Texture.type.js";

interface Placement {
  readonly item: TextureAtlasPackerItem;
  readonly frame: TextureFrame;
}

export class TextureAtlasPacker {
  private readonly padding: number;
  private readonly edgeBleed: number;
  private readonly maxWidth: number;
  private readonly maxHeight: number;
  private readonly powerOfTwo: boolean;
  private readonly sort: TextureAtlasPackerSort;
  private readonly createCanvas: TextureAtlasPackerOptions["createCanvas"];

  public constructor(options: TextureAtlasPackerOptions = {}) {
    this.padding = Math.max(0, Math.floor(options.padding ?? 0));
    this.edgeBleed = Math.max(0, Math.floor(options.edgeBleed ?? 0));
    this.maxWidth = Math.max(1, Math.floor(options.maxWidth ?? 2048));
    this.maxHeight = Math.max(1, Math.floor(options.maxHeight ?? Number.POSITIVE_INFINITY));
    this.powerOfTwo = options.powerOfTwo ?? false;
    this.sort = options.sort ?? "none";
    this.createCanvas = options.createCanvas;
  }

  public pack(items: readonly TextureAtlasPackerItem[]): TextureAtlas {
    return this.packWithStats(items).atlas;
  }

  public packWithStats(items: readonly TextureAtlasPackerItem[]): TextureAtlasPackerResult {
    const placements = this.createPlacements(items);
    const width = this.getAtlasWidth(placements);
    const height = this.getAtlasHeight(placements);
    const atlas = this.createAtlas(placements, width, height);
    const stats = createTextureAtlasPackerStats(width, height, placements.map((placement) => placement.frame));

    return { atlas, stats };
  }

  private createAtlas(placements: readonly Placement[], width: number, height: number): TextureAtlas {
    const canvas = this.createAtlasCanvas(width, height);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("TextureAtlasPacker could not create a 2D context.");
    }

    context.clearRect(0, 0, width, height);

    for (const placement of placements) {
      this.drawPlacement(context, placement);
    }

    return new TextureAtlas({
      texture: new Texture({ source: canvas, width, height }),
      frames: Object.fromEntries(placements.map((placement) => [placement.item.name, placement.frame]))
    });
  }

  private createPlacements(items: readonly TextureAtlasPackerItem[]): readonly Placement[] {
    const placements: Placement[] = [];
    const names = new Set<string>();
    const sortedItems = sortTextureAtlasPackerItems(items, this.sort, getItemSize);
    let x = this.padding;
    let y = this.padding;
    let rowHeight = 0;

    for (const item of sortedItems) {
      const width = getSourceWidth(item);
      const height = getSourceHeight(item);

      this.validateItem(item, width, height, names);

      if (width + this.padding * 2 > this.maxWidth) {
        throw new Error(`TextureAtlasPacker item is wider than maxWidth: ${item.name}`);
      }

      if (height + this.padding * 2 > this.maxHeight) {
        throw new Error(`TextureAtlasPacker item is taller than maxHeight: ${item.name}`);
      }

      if (x + width + this.padding > this.maxWidth && rowHeight > 0) {
        x = this.padding;
        y += rowHeight + this.padding;
        rowHeight = 0;
      }

      if (y + height + this.padding > this.maxHeight) {
        throw new Error(`TextureAtlasPacker atlas is full before placing item: ${item.name}`);
      }

      placements.push({ item, frame: { x, y, width, height } });
      x += width + this.padding;
      rowHeight = Math.max(rowHeight, height);
    }

    return placements;
  }

  private validateItem(item: TextureAtlasPackerItem, width: number, height: number, names: Set<string>): void {
    if (names.has(item.name)) {
      throw new Error(`TextureAtlasPacker duplicate frame name: ${item.name}`);
    }

    if (width <= 0 || height <= 0) {
      throw new Error(`TextureAtlasPacker item has invalid size: ${item.name}`);
    }

    names.add(item.name);
  }

  private getAtlasWidth(placements: readonly Placement[]): number {
    const width = placements.reduce((current, placement) => Math.max(current, placement.frame.x + placement.frame.width + this.padding), 1);
    return this.powerOfTwo ? nextPowerOfTwo(width) : width;
  }

  private getAtlasHeight(placements: readonly Placement[]): number {
    const height = placements.reduce((current, placement) => Math.max(current, placement.frame.y + placement.frame.height + this.padding), 1);
    return this.powerOfTwo ? nextPowerOfTwo(height) : height;
  }

  private createAtlasCanvas(width: number, height: number): TextureAtlasPackerCanvas {
    if (this.createCanvas) {
      return this.createCanvas(width, height);
    }

    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }

    if (typeof OffscreenCanvas !== "undefined") {
      return new OffscreenCanvas(width, height);
    }

    throw new Error("TextureAtlasPacker needs createCanvas outside browser environments.");
  }

  private drawPlacement(context: TextureAtlasPackerContext, placement: Placement): void {
    const frame = placement.frame;
    const source = placement.item.source;

    context.drawImage(source, 0, 0, frame.width, frame.height, frame.x, frame.y, frame.width, frame.height);
    this.drawEdgeBleed(context, source, frame);
  }

  private drawEdgeBleed(context: TextureAtlasPackerContext, source: TextureSource, frame: TextureFrame): void {
    const bleed = Math.min(this.edgeBleed, this.padding, frame.width, frame.height);

    if (bleed <= 0) {
      return;
    }

    context.drawImage(source, 0, 0, 1, frame.height, frame.x - bleed, frame.y, bleed, frame.height);
    context.drawImage(source, frame.width - 1, 0, 1, frame.height, frame.x + frame.width, frame.y, bleed, frame.height);
    context.drawImage(source, 0, 0, frame.width, 1, frame.x, frame.y - bleed, frame.width, bleed);
    context.drawImage(source, 0, frame.height - 1, frame.width, 1, frame.x, frame.y + frame.height, frame.width, bleed);
    context.drawImage(source, 0, 0, 1, 1, frame.x - bleed, frame.y - bleed, bleed, bleed);
    context.drawImage(source, frame.width - 1, 0, 1, 1, frame.x + frame.width, frame.y - bleed, bleed, bleed);
    context.drawImage(source, 0, frame.height - 1, 1, 1, frame.x - bleed, frame.y + frame.height, bleed, bleed);
    context.drawImage(source, frame.width - 1, frame.height - 1, 1, 1, frame.x + frame.width, frame.y + frame.height, bleed, bleed);
  }
}

function getSourceWidth(item: TextureAtlasPackerItem): number {
  return Math.max(0, Math.floor(item.width ?? getIntrinsicWidth(item.source)));
}

function getSourceHeight(item: TextureAtlasPackerItem): number {
  return Math.max(0, Math.floor(item.height ?? getIntrinsicHeight(item.source)));
}

function getItemSize(item: TextureAtlasPackerItem): { readonly width: number; readonly height: number } {
  return {
    width: getSourceWidth(item),
    height: getSourceHeight(item)
  };
}

function getIntrinsicWidth(source: TextureSource): number {
  if ("naturalWidth" in source) {
    return source.naturalWidth;
  }

  if ("videoWidth" in source) {
    return source.videoWidth;
  }

  if ("displayWidth" in source) {
    return source.displayWidth;
  }

  return typeof source.width === "number" ? source.width : source.width.baseVal.value;
}

function getIntrinsicHeight(source: TextureSource): number {
  if ("naturalHeight" in source) {
    return source.naturalHeight;
  }

  if ("videoHeight" in source) {
    return source.videoHeight;
  }

  if ("displayHeight" in source) {
    return source.displayHeight;
  }

  return typeof source.height === "number" ? source.height : source.height.baseVal.value;
}

function nextPowerOfTwo(value: number): number {
  let result = 1;

  while (result < value) {
    result *= 2;
  }

  return result;
}

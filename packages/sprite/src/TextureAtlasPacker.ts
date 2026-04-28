import { Texture } from "./Texture.js";
import { TextureAtlas } from "./TextureAtlas.js";
import type { TextureFrame } from "./TextureAtlas.type.js";
import type {
  TextureAtlasPackerCanvas,
  TextureAtlasPackerItem,
  TextureAtlasPackerOptions
} from "./TextureAtlasPacker.type.js";
import type { TextureSource } from "./Texture.type.js";

interface Placement {
  readonly item: TextureAtlasPackerItem;
  readonly frame: TextureFrame;
}

export class TextureAtlasPacker {
  private readonly padding: number;
  private readonly maxWidth: number;
  private readonly powerOfTwo: boolean;
  private readonly createCanvas: TextureAtlasPackerOptions["createCanvas"];

  public constructor(options: TextureAtlasPackerOptions = {}) {
    this.padding = Math.max(0, Math.floor(options.padding ?? 0));
    this.maxWidth = Math.max(1, Math.floor(options.maxWidth ?? 2048));
    this.powerOfTwo = options.powerOfTwo ?? false;
    this.createCanvas = options.createCanvas;
  }

  public pack(items: readonly TextureAtlasPackerItem[]): TextureAtlas {
    const placements = this.createPlacements(items);
    const width = this.getAtlasWidth(placements);
    const height = this.getAtlasHeight(placements);
    const canvas = this.createAtlasCanvas(width, height);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("TextureAtlasPacker could not create a 2D context.");
    }

    context.clearRect(0, 0, width, height);

    for (const placement of placements) {
      const frame = placement.frame;
      context.drawImage(placement.item.source, 0, 0, frame.width, frame.height, frame.x, frame.y, frame.width, frame.height);
    }

    return new TextureAtlas({
      texture: new Texture({ source: canvas, width, height }),
      frames: Object.fromEntries(placements.map((placement) => [placement.item.name, placement.frame]))
    });
  }

  private createPlacements(items: readonly TextureAtlasPackerItem[]): readonly Placement[] {
    const placements: Placement[] = [];
    let x = this.padding;
    let y = this.padding;
    let rowHeight = 0;

    for (const item of items) {
      const width = getSourceWidth(item);
      const height = getSourceHeight(item);

      if (width + this.padding * 2 > this.maxWidth) {
        throw new Error(`TextureAtlasPacker item is wider than maxWidth: ${item.name}`);
      }

      if (x + width + this.padding > this.maxWidth && rowHeight > 0) {
        x = this.padding;
        y += rowHeight + this.padding;
        rowHeight = 0;
      }

      placements.push({ item, frame: { x, y, width, height } });
      x += width + this.padding;
      rowHeight = Math.max(rowHeight, height);
    }

    return placements;
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
}

function getSourceWidth(item: TextureAtlasPackerItem): number {
  return Math.max(0, Math.floor(item.width ?? getIntrinsicWidth(item.source)));
}

function getSourceHeight(item: TextureAtlasPackerItem): number {
  return Math.max(0, Math.floor(item.height ?? getIntrinsicHeight(item.source)));
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

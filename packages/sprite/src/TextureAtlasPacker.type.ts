import type { TextureAtlas } from "./TextureAtlas.js";
import type { TextureSource } from "./Texture.type.js";

export type TextureAtlasPackerSort = "none" | "height" | "area";

export interface TextureAtlasPackerItem {
  readonly name: string;
  readonly source: TextureSource;
  readonly width?: number;
  readonly height?: number;
}

export interface TextureAtlasPackerOptions {
  readonly padding?: number;
  readonly edgeBleed?: number;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly powerOfTwo?: boolean;
  readonly sort?: TextureAtlasPackerSort;
  readonly createCanvas?: TextureAtlasPackerCanvasFactory;
}

export interface TextureAtlasPackerResult {
  readonly atlas: TextureAtlas;
  readonly stats: TextureAtlasPackerStats;
}

export interface TextureAtlasPackerStats {
  readonly width: number;
  readonly height: number;
  readonly totalArea: number;
  readonly usedArea: number;
  readonly wastedArea: number;
  readonly fragmentedArea: number;
  readonly outerWasteArea: number;
  readonly occupancy: number;
  readonly fragmentation: number;
  readonly frameCount: number;
  readonly resizeSuggestion: TextureAtlasPackerResizeSuggestion;
}

export interface TextureAtlasPackerStatsFrame {
  readonly x?: number;
  readonly y?: number;
  readonly width: number;
  readonly height: number;
}

export type TextureAtlasPackerResizeAction = "keep" | "shrink" | "growWidth";

export interface TextureAtlasPackerResizeSuggestion {
  readonly action: TextureAtlasPackerResizeAction;
  readonly width: number;
  readonly height: number;
  readonly reason: string;
}

export type TextureAtlasPackerCanvas = TextureSource & {
  width: number;
  height: number;
  getContext(contextId: "2d"): TextureAtlasPackerContext | null;
};

export interface TextureAtlasPackerContext {
  clearRect(x: number, y: number, width: number, height: number): void;
  drawImage(
    source: TextureSource,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destinationX: number,
    destinationY: number,
    destinationWidth: number,
    destinationHeight: number
  ): void;
}

export type TextureAtlasPackerCanvasFactory = (width: number, height: number) => TextureAtlasPackerCanvas;

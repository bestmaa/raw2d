import type { TextureSource } from "./Texture.type.js";

export interface TextureAtlasPackerItem {
  readonly name: string;
  readonly source: TextureSource;
  readonly width?: number;
  readonly height?: number;
}

export interface TextureAtlasPackerOptions {
  readonly padding?: number;
  readonly maxWidth?: number;
  readonly powerOfTwo?: boolean;
  readonly createCanvas?: TextureAtlasPackerCanvasFactory;
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

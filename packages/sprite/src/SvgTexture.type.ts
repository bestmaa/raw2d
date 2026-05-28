import type { TextureSource } from "./Texture.type.js";

export type SvgRasterizeInput = string | Blob;

export interface SvgRasterizeOptions {
  readonly svg: SvgRasterizeInput;
  readonly width: number;
  readonly height: number;
  readonly createCanvas?: SvgRasterizeCanvasFactory;
  readonly createImage?: SvgRasterizeImageFactory;
  readonly createObjectURL?: SvgObjectUrlFactory;
  readonly revokeObjectURL?: SvgObjectUrlRevoke;
}

export interface CreateSvgTextureOptions extends SvgRasterizeOptions {
  readonly id?: string;
  readonly url?: string;
}

export type SvgRasterizeCanvas = TextureSource & {
  width: number;
  height: number;
  getContext(contextId: "2d"): SvgRasterizeContext | null;
};

export interface SvgRasterizeContext {
  clearRect(x: number, y: number, width: number, height: number): void;
  drawImage(
    source: TextureSource,
    destinationX: number,
    destinationY: number,
    destinationWidth: number,
    destinationHeight: number
  ): void;
}

export interface SvgRasterizeImage {
  crossOrigin: string | null;
  src: string;
  addEventListener(type: "load" | "error", listener: () => void): void;
  removeEventListener(type: "load" | "error", listener: () => void): void;
  decode?: () => Promise<void>;
}

export type SvgRasterizeCanvasFactory = (width: number, height: number) => SvgRasterizeCanvas;
export type SvgRasterizeImageFactory = () => SvgRasterizeImage;
export type SvgObjectUrlFactory = (blob: Blob) => string;
export type SvgObjectUrlRevoke = (url: string) => void;

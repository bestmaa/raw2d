import type { TextureOptions, TextureSize, TextureSource } from "./Texture.type.js";

export class Texture {
  public readonly source: TextureSource;
  public readonly width: number;
  public readonly height: number;

  public constructor(options: TextureOptions) {
    this.source = options.source;
    this.width = Math.max(0, options.width ?? getSourceWidth(options.source));
    this.height = Math.max(0, options.height ?? getSourceHeight(options.source));
  }

  public getSize(): TextureSize {
    return {
      width: this.width,
      height: this.height
    };
  }
}

function getSourceWidth(source: TextureSource): number {
  if (source instanceof HTMLImageElement) {
    return source.naturalWidth;
  }

  if (source instanceof SVGImageElement) {
    return source.width.baseVal.value;
  }

  if ("videoWidth" in source) {
    return source.videoWidth;
  }

  if ("displayWidth" in source) {
    return source.displayWidth;
  }

  return source.width;
}

function getSourceHeight(source: TextureSource): number {
  if (source instanceof HTMLImageElement) {
    return source.naturalHeight;
  }

  if (source instanceof SVGImageElement) {
    return source.height.baseVal.value;
  }

  if ("videoHeight" in source) {
    return source.videoHeight;
  }

  if ("displayHeight" in source) {
    return source.displayHeight;
  }

  return source.height;
}
